import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

interface PerformanceMetrics {
  path: string
  method: string
  statusCode: number
  duration: number
  timestamp: string
  userAgent?: string
  ip?: string
}

const metricsBuffer: PerformanceMetrics[] = []
const MAX_BUFFER_SIZE = 100
const FLUSH_INTERVAL = 60000

interface AlertRule {
  name: string
  condition: (metrics: PerformanceMetrics[]) => boolean
  threshold: number
  message: string
  triggered: boolean
}

const alertRules: AlertRule[] = [
  {
    name: 'High Error Rate',
    condition: (metrics) => {
      const recent = metrics.slice(-50)
      const errors = recent.filter((m) => m.statusCode >= 500)
      return recent.length >= 10 && errors.length / recent.length > 0.1
    },
    threshold: 0.1,
    message: 'Error rate exceeds 10% in recent requests',
    triggered: false,
  },
  {
    name: 'Slow Response Time',
    condition: (metrics) => {
      const recent = metrics.slice(-20)
      return recent.length >= 5 && recent.every((m) => m.duration > 2000)
    },
    threshold: 2000,
    message: 'All recent requests taking longer than 2 seconds',
    triggered: false,
  },
  {
    name: 'Database High Latency',
    condition: (metrics) => {
      const recent = metrics.filter((m) => m.path.includes('/api/'))
      const dbPaths = recent.filter(
        (m) =>
          m.path.includes('/games') ||
          m.path.includes('/guides') ||
          m.path.includes('/codes')
      )
      return dbPaths.length >= 3 && dbPaths.slice(-3).every((m) => m.duration > 1000)
    },
    threshold: 1000,
    message: 'Database queries taking longer than 1 second',
    triggered: false,
  },
]

export function middleware(request: NextRequest) {
  const startTime = Date.now()

  const response = NextResponse.next()

  const duration = Date.now() - startTime

  const metrics: PerformanceMetrics = {
    path: request.nextUrl.pathname,
    method: request.method,
    statusCode: response.status,
    duration,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
  }

  metricsBuffer.push(metrics)

  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift()
  }

  if (metrics.duration > 2000) {
    logger.warn(`Slow request detected: ${metrics.method} ${metrics.path} took ${metrics.duration}ms`)
  }

  if (metrics.statusCode >= 500) {
    logger.error(
      `Server error: ${metrics.method} ${metrics.path} returned ${metrics.statusCode}`,
      undefined,
      { duration: metrics.duration }
    )
  }

  for (const rule of alertRules) {
    if (!rule.triggered && rule.condition(metricsBuffer)) {
      rule.triggered = true
      logger.warn(`Alert triggered: ${rule.name} - ${rule.message}`)

      setTimeout(() => {
        rule.triggered = false
      }, 300000)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/games/:path*',
    '/guides/:path*',
    '/codes/:path*',
    '/tier-list/:path*',
  ],
}

export function getMetrics(): PerformanceMetrics[] {
  return [...metricsBuffer]
}

export function getAverageResponseTime(): number {
  if (metricsBuffer.length === 0) return 0
  const total = metricsBuffer.reduce((sum, m) => sum + m.duration, 0)
  return Math.round(total / metricsBuffer.length)
}

export function getErrorRate(): number {
  if (metricsBuffer.length === 0) return 0
  const errors = metricsBuffer.filter((m) => m.statusCode >= 400)
  return Math.round((errors.length / metricsBuffer.length) * 100)
}

setInterval(() => {
  if (metricsBuffer.length > 0) {
    logger.info('Performance snapshot', {
      totalRequests: metricsBuffer.length,
      avgResponseTime: getAverageResponseTime(),
      errorRate: `${getErrorRate()}%`,
      slowRequests: metricsBuffer.filter((m) => m.duration > 2000).length,
    })
  }
}, FLUSH_INTERVAL)
