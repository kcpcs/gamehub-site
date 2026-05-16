import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

const SEGMENT_CACHE_TTL = 300

export type SegmentType = 'activity' | 'engagement' | 'preference' | 'lifecycle'

export interface SegmentResult {
  segment_name: string
  user_count: number
  percentage: number
  description: string
  avg_score: number
}

export interface UserProfile {
  user_id: string
  username: string
  email: string
  segments: Array<{ type: string; name: string; score: number }>
  metrics: {
    total_views: number
    total_likes: number
    total_comments: number
    total_ratings: number
    points: number
    article_count: number
  }
  activity_score: number
  engagement_score: number
  last_active: string | null
}

function getDateRange(days: number) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)
  return since
}

export async function getActivitySegments(days: number = 30): Promise<SegmentResult[]> {
  const cacheKey = `analytics:segments:activity:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const since = getDateRange(days)
    const totalUsers = await db.user.count()

    const activeUsers = await db.pageView.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: since },
        user_id: { not: null },
      },
    })

    const activeUserIds = activeUsers.map(u => u.user_id!).filter(Boolean)

    const usersWithArticles = await db.article.groupBy({
      by: ['author_id'],
      where: {
        created_at: { gte: since },
        author_id: { not: null },
      },
    })

    const usersWithComments = await db.comment.groupBy({
      by: ['author_username'],
      where: {
        created_at: { gte: since },
      },
    })

    const usersWithRatings = await db.gameRating.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: since },
      },
    })

    const veryActiveSet = new Set<string>()
    const moderatelyActiveSet = new Set<string>()

    for (const userId of activeUserIds) {
      const userViews = activeUsers.filter(u => u.user_id === userId).length
      const hasArticle = usersWithArticles.some(a => a.author_id === userId)
      const hasRating = usersWithRatings.some(r => r.user_id === userId)

      if (userViews > 10 || hasArticle || hasRating) {
        veryActiveSet.add(userId)
      } else if (userViews > 3) {
        moderatelyActiveSet.add(userId)
      }
    }

    const activeSet = new Set(activeUserIds)
    const dormantCount = totalUsers - activeSet.size

    const veryActive = veryActiveSet.size
    const active = activeSet.size - veryActive
    const dormant = dormantCount

    const segments: SegmentResult[] = [
      {
        segment_name: '高活跃用户',
        user_count: veryActive,
        percentage: totalUsers > 0 ? Math.round((veryActive / totalUsers) * 10000) / 100 : 0,
        description: '浏览>10次或有创作行为',
        avg_score: 0.85,
      },
      {
        segment_name: '活跃用户',
        user_count: active,
        percentage: totalUsers > 0 ? Math.round((active / totalUsers) * 10000) / 100 : 0,
        description: '浏览3-10次',
        avg_score: 0.55,
      },
      {
        segment_name: '沉默用户',
        user_count: dormant,
        percentage: totalUsers > 0 ? Math.round((dormant / totalUsers) * 10000) / 100 : 0,
        description: '近期无浏览行为',
        avg_score: 0.15,
      },
    ]

    await redis.set(cacheKey, JSON.stringify(segments), { ex: SEGMENT_CACHE_TTL })
    return segments
  } catch (err) {
    console.error('[Analytics] getActivitySegments error:', err)
    return []
  }
}

export async function getEngagementSegments(days: number = 30): Promise<SegmentResult[]> {
  const cacheKey = `analytics:segments:engagement:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const since = getDateRange(days)
    const users = await db.user.findMany({
      select: {
        id: true,
        total_views: true,
        article_count: true,
        points: true,
      },
    })

    let highEngagement = 0
    let mediumEngagement = 0
    let lowEngagement = 0

    for (const user of users) {
      const score = user.total_views * 0.3 + user.article_count * 10 + user.points * 0.1
      if (score > 100) highEngagement++
      else if (score > 20) mediumEngagement++
      else lowEngagement++
    }

    const total = users.length || 1
    const segments: SegmentResult[] = [
      {
        segment_name: '高参与度',
        user_count: highEngagement,
        percentage: Math.round((highEngagement / total) * 10000) / 100,
        description: '浏览+创作+积分综合评分>100',
        avg_score: 0.9,
      },
      {
        segment_name: '中等参与度',
        user_count: mediumEngagement,
        percentage: Math.round((mediumEngagement / total) * 10000) / 100,
        description: '综合评分20-100',
        avg_score: 0.5,
      },
      {
        segment_name: '低参与度',
        user_count: lowEngagement,
        percentage: Math.round((lowEngagement / total) * 10000) / 100,
        description: '综合评分<20',
        avg_score: 0.15,
      },
    ]

    await redis.set(cacheKey, JSON.stringify(segments), { ex: SEGMENT_CACHE_TTL })
    return segments
  } catch (err) {
    console.error('[Analytics] getEngagementSegments error:', err)
    return []
  }
}

export async function getPreferenceSegments(): Promise<SegmentResult[]> {
  const cacheKey = 'analytics:segments:preference'
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        preferred_games: true,
      },
    })

    let noPreference = 0
    let singlePreference = 0
    let multiPreference = 0

    for (const user of users) {
      try {
        const games = JSON.parse(user.preferred_games || '[]')
        if (games.length === 0) noPreference++
        else if (games.length === 1) singlePreference++
        else multiPreference++
      } catch {
        noPreference++
      }
    }

    const total = users.length || 1
    const segments: SegmentResult[] = [
      {
        segment_name: '多偏好用户',
        user_count: multiPreference,
        percentage: Math.round((multiPreference / total) * 10000) / 100,
        description: '关注多个游戏',
        avg_score: 0.8,
      },
      {
        segment_name: '单偏好用户',
        user_count: singlePreference,
        percentage: Math.round((singlePreference / total) * 10000) / 100,
        description: '关注单个游戏',
        avg_score: 0.5,
      },
      {
        segment_name: '无偏好设置',
        user_count: noPreference,
        percentage: Math.round((noPreference / total) * 10000) / 100,
        description: '未设置游戏偏好',
        avg_score: 0.2,
      },
    ]

    await redis.set(cacheKey, JSON.stringify(segments), { ex: SEGMENT_CACHE_TTL })
    return segments
  } catch (err) {
    console.error('[Analytics] getPreferenceSegments error:', err)
    return []
  }
}

export async function getRetentionData(days: number = 90): Promise<{
  cohorts: Array<{ week: string; users: number; retention: number[] }>
  overallRetention: number[]
}> {
  const cacheKey = `analytics:retention:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const since = getDateRange(days)

    const users = await db.user.findMany({
      select: { id: true, created_at: true },
      where: { created_at: { gte: since } },
      orderBy: { created_at: 'asc' },
    })

    const cohorts: Array<{ week: string; users: number; retention: number[] }> = []
    const weekMap = new Map<string, string[]>()

    for (const user of users) {
      const week = getWeekLabel(user.created_at)
      if (!weekMap.has(week)) weekMap.set(week, [])
      weekMap.get(week)!.push(user.id)
    }

    for (const [week, userIds] of weekMap) {
      const retention = await calculateRetentionForCohort(userIds, week)
      cohorts.push({ week, users: userIds.length, retention })
    }

    const overallRetention = calculateOverallRetention(cohorts)

    const result = { cohorts, overallRetention }
    await redis.set(cacheKey, JSON.stringify(result), { ex: SEGMENT_CACHE_TTL })
    return result
  } catch (err) {
    console.error('[Analytics] getRetentionData error:', err)
    return { cohorts: [], overallRetention: [] }
  }
}

function getWeekLabel(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

async function calculateRetentionForCohort(userIds: string[], startWeek: string): Promise<number[]> {
  const baseDate = new Date(startWeek)
  const retention: number[] = [100]

  for (let i = 1; i <= 4; i++) {
    const weekStart = new Date(baseDate)
    weekStart.setDate(weekStart.getDate() + i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    try {
      const activeInWeek = await db.pageView.groupBy({
        by: ['user_id'],
        where: {
          user_id: { in: userIds.filter(Boolean) },
          created_at: { gte: weekStart, lt: weekEnd },
        },
      })

      const uniqueActive = new Set(activeInWeek.map(a => a.user_id))
      const retained = userIds.filter(id => uniqueActive.has(id)).length
      retention.push(Math.round((retained / userIds.length) * 10000) / 100)
    } catch {
      retention.push(0)
    }
  }

  return retention
}

function calculateOverallRetention(cohorts: Array<{ week: string; users: number; retention: number[] }>): number[] {
  if (cohorts.length === 0) return [100, 0, 0, 0, 0]

  const maxWeeks = Math.max(...cohorts.map(c => c.retention.length))
  const result: number[] = []

  for (let i = 0; i < maxWeeks; i++) {
    const total = cohorts.reduce((sum, c) => sum + (c.retention[i] !== undefined ? c.retention[i] * c.users : 0), 0)
    const totalUsers = cohorts.reduce((sum, c) => sum + (c.retention[i] !== undefined ? c.users : 0), 0)
    result.push(totalUsers > 0 ? Math.round((total / totalUsers) * 100) / 100 : 0)
  }

  return result
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        total_views: true,
        article_count: true,
        points: true,
        created_at: true,
      },
    })

    if (!user) return null

    const [likeCount, commentCount, ratingCount, segments, lastActive] = await Promise.all([
      db.like.count({ where: { user_id: userId } }),
      db.comment.count({ where: { author_username: user.username } }),
      db.gameRating.count({ where: { user_id: userId } }),
      db.userSegment.findMany({ where: { user_id: userId } }),
      db.pageView.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        select: { created_at: true },
      }),
    ])

    const activityScore = Math.min(1, (user.total_views || 0) / 100 * 0.5 + (likeCount > 0 ? 0.3 : 0) + (commentCount > 0 ? 0.2 : 0))
    const engagementScore = Math.min(1, (user.article_count || 0) / 10 * 0.4 + (user.points || 0) / 1000 * 0.3 + (ratingCount > 0 ? 0.3 : 0))

    return {
      user_id: user.id,
      username: user.username,
      email: user.email,
      segments: segments.map(s => ({
        type: s.segment_type,
        name: s.segment_name,
        score: s.score,
      })),
      metrics: {
        total_views: user.total_views || 0,
        total_likes: likeCount,
        total_comments: commentCount,
        total_ratings: ratingCount,
        points: user.points || 0,
        article_count: user.article_count || 0,
      },
      activity_score: Math.round(activityScore * 100) / 100,
      engagement_score: Math.round(engagementScore * 100) / 100,
      last_active: lastActive?.created_at?.toISOString() || null,
    }
  } catch (err) {
    console.error('[Analytics] getUserProfile error:', err)
    return null
  }
}

export async function classifyUser(userId: string): Promise<void> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        total_views: true,
        article_count: true,
        points: true,
        created_at: true,
      },
    })
    if (!user) return

    const now = new Date()
    const daysSinceJoin = Math.max(1, Math.floor((now.getTime() - user.created_at.getTime()) / (1000 * 60 * 60 * 24)))
    const viewsPerDay = (user.total_views || 0) / daysSinceJoin

    let activityName = 'new_user'
    let activityScore = 0.3
    if (viewsPerDay > 5) {
      activityName = 'power_user'
      activityScore = 0.9
    } else if (viewsPerDay > 1) {
      activityName = 'regular_user'
      activityScore = 0.6
    } else if (viewsPerDay > 0.1) {
      activityName = 'casual_user'
      activityScore = 0.3
    }

    await db.userSegment.upsert({
      where: {
        user_id_segment_type: {
          user_id: userId,
          segment_type: 'activity',
        },
      },
      create: {
        user_id: userId,
        segment_type: 'activity',
        segment_name: activityName,
        score: activityScore,
      },
      update: {
        segment_name: activityName,
        score: activityScore,
      },
    })

    let engagementName = 'passive'
    let engagementScore = 0.2
    const engagementValue = (user.article_count || 0) * 10 + (user.points || 0) * 0.1
    if (engagementValue > 200) {
      engagementName = 'creator'
      engagementScore = 0.9
    } else if (engagementValue > 50) {
      engagementName = 'contributor'
      engagementScore = 0.6
    } else if (engagementValue > 10) {
      engagementName = 'participant'
      engagementScore = 0.4
    }

    await db.userSegment.upsert({
      where: {
        user_id_segment_type: {
          user_id: userId,
          segment_type: 'engagement',
        },
      },
      create: {
        user_id: userId,
        segment_type: 'engagement',
        segment_name: engagementName,
        score: engagementScore,
      },
      update: {
        segment_name: engagementName,
        score: engagementScore,
      },
    })
  } catch (err) {
    console.error('[Analytics] classifyUser error:', err)
  }
}