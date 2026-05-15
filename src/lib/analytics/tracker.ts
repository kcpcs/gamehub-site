import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import crypto from 'crypto'

const TRACKING_BUFFER: Array<{
  type: string
  data: Record<string, unknown>
  timestamp: number
}> = []

const BUFFER_FLUSH_INTERVAL = 5000
const BUFFER_MAX_SIZE = 50
const SESSION_TTL = 1800
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'gamehub-analytics-salt'

let flushTimer: ReturnType<typeof setInterval> | null = null

function getFlushTimer() {
  if (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>).__analytics_flush_timer) {
    return (globalThis as Record<string, unknown>).__analytics_flush_timer as ReturnType<typeof setInterval>
  }
  return null
}

function setFlushTimer(timer: ReturnType<typeof setInterval> | null) {
  if (typeof globalThis !== 'undefined') {
    (globalThis as Record<string, unknown>).__analytics_flush_timer = timer
  }
}

function ensureFlushTimer() {
  if (getFlushTimer()) return
  const timer = setInterval(flushBuffer, BUFFER_FLUSH_INTERVAL)
  if (timer && typeof timer === 'object' && 'unref' in timer) {
    (timer as NodeJS.Timeout).unref()
  }
  setFlushTimer(timer)
}

async function flushBuffer() {
  if (TRACKING_BUFFER.length === 0) return

  const batch = TRACKING_BUFFER.splice(0, TRACKING_BUFFER.length)
  const pageViews = batch.filter(e => e.type === 'pageview')
  const events = batch.filter(e => e.type === 'event')

  try {
    if (pageViews.length > 0) {
      await db.pageView.createMany({
        data: pageViews.map(e => ({
          path: String(e.data.path || ''),
          referrer: e.data.referrer ? String(e.data.referrer) : null,
          session_id: e.data.sessionId ? String(e.data.sessionId) : null,
          user_id: e.data.userId ? String(e.data.userId) : null,
          ip_hash: e.data.ipHash ? String(e.data.ipHash) : null,
          user_agent: e.data.userAgent ? String(e.data.userAgent).slice(0, 500) : null,
          duration: typeof e.data.duration === 'number' ? e.data.duration : 0,
        })),
      })
    }

    for (const event of events) {
      const date = new Date().toISOString().slice(0, 10)
      const dateObj = new Date(date)
      await db.dailyMetric.upsert({
        where: {
          date_metric_type_metric_key: {
            date: dateObj,
            metric_type: 'event',
            metric_key: String(event.data.event || 'unknown'),
          },
        },
        create: {
          date: dateObj,
          metric_type: 'event',
          metric_key: String(event.data.event || 'unknown'),
          value: 1,
        },
        update: {
          value: { increment: 1 },
        },
      })
    }
  } catch (err) {
    console.error('[Analytics] Flush error:', err)
    TRACKING_BUFFER.push(...batch)
  }
}

function hashIP(ip: string): string {
  return crypto.createHmac('sha256', IP_HASH_SALT).update(ip).digest('hex').slice(0, 16)
}

export interface TrackPageViewParams {
  path: string
  referrer?: string
  sessionId?: string
  userId?: string
  ip?: string
  userAgent?: string
  duration?: number
}

export function trackPageView(params: TrackPageViewParams) {
  ensureFlushTimer()

  TRACKING_BUFFER.push({
    type: 'pageview',
    data: {
      path: params.path,
      referrer: params.referrer || null,
      sessionId: params.sessionId || null,
      userId: params.userId || null,
      ipHash: params.ip ? hashIP(params.ip) : null,
      userAgent: params.userAgent || null,
      duration: params.duration || 0,
    },
    timestamp: Date.now(),
  })

  if (TRACKING_BUFFER.length >= BUFFER_MAX_SIZE) {
    flushBuffer().catch(() => {})
  }
}

export interface TrackEventParams {
  event: string
  userId?: string
  sessionId?: string
  properties?: Record<string, string | number | boolean>
}

export function trackEvent(params: TrackEventParams) {
  ensureFlushTimer()

  TRACKING_BUFFER.push({
    type: 'event',
    data: {
      event: params.event,
      userId: params.userId || null,
      sessionId: params.sessionId || null,
      properties: params.properties || {},
    },
    timestamp: Date.now(),
  })

  if (TRACKING_BUFFER.length >= BUFFER_MAX_SIZE) {
    flushBuffer().catch(() => {})
  }
}

export function generateSessionId(): string {
  return `sess_${crypto.randomUUID()}`
}

export async function getSessionData(sessionId: string) {
  try {
    const cacheKey = `analytics:session:${sessionId}`
    const cached = await redis.get(cacheKey)
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

    const session = {
      id: sessionId,
      startTime: Date.now(),
      pagesViewed: 0,
      events: 0,
    }

    await redis.set(cacheKey, JSON.stringify(session), { ex: SESSION_TTL })
    return session
  } catch {
    return {
      id: sessionId,
      startTime: Date.now(),
      pagesViewed: 0,
      events: 0,
    }
  }
}

export async function updateSession(sessionId: string, update: { pagesViewed?: number; events?: number }) {
  try {
    const cacheKey = `analytics:session:${sessionId}`
    const existing = await getSessionData(sessionId)
    const updated = { ...existing, ...update }
    await redis.set(cacheKey, JSON.stringify(updated), { ex: SESSION_TTL })
    return updated
  } catch {
    return null
  }
}

export async function getPageViewStats(params: {
  days?: number
  path?: string
}) {
  const days = params.days || 7
  const since = new Date()
  since.setDate(since.getDate() - days)

  try {
    const whereClause: Record<string, unknown> = {
      created_at: { gte: since },
    }
    if (params.path) {
      whereClause.path = params.path
    }

    const [totalViews, uniquePaths, topPaths, hourlyViews] = await Promise.all([
      db.pageView.count({ where: whereClause }),
      db.pageView.groupBy({
        by: ['path'],
        where: whereClause,
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 100,
      }),
      db.pageView.groupBy({
        by: ['path'],
        where: whereClause,
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 20,
      }),
      db.pageView.groupBy({
        by: ['created_at'],
        where: whereClause,
        _count: { id: true },
        orderBy: { created_at: 'asc' },
      }),
    ])

    const totalSessions = await db.pageView.groupBy({
      by: ['session_id'],
      where: { ...whereClause, session_id: { not: null } },
    })

    return {
      totalViews,
      uniquePaths: uniquePaths.length,
      uniqueSessions: totalSessions.length,
      avgDuration: 0,
      topPaths: topPaths.map(p => ({
        path: p.path,
        views: p._count.path,
      })),
      hourlyBreakdown: hourlyViews.map(h => ({
        hour: h.created_at.toISOString(),
        views: h._count.id,
      })),
    }
  } catch (err) {
    console.error('[Analytics] getPageViewStats error:', err)
    return {
      totalViews: 0,
      uniquePaths: 0,
      uniqueSessions: 0,
      avgDuration: 0,
      topPaths: [],
      hourlyBreakdown: [],
    }
  }
}

export function shutdown() {
  setFlushTimer(null)
  return flushBuffer()
}