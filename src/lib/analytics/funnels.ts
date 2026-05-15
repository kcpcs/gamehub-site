import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

const FUNNEL_CACHE_TTL = 600

export interface FunnelStep {
  name: string
  count: number
  percentage: number
  dropoff: number
  dropoff_rate: number
}

export interface FunnelDefinition {
  name: string
  description: string
  steps: string[]
}

export const FUNNEL_DEFINITIONS: FunnelDefinition[] = [
  {
    name: 'visit_to_register',
    description: '访问→注册转化漏斗',
    steps: ['页面访问', '注册用户', '活跃用户', '内容创作者'],
  },
  {
    name: 'content_engagement',
    description: '内容互动漏斗',
    steps: ['浏览文章', '点赞文章', '发表评论', '分享文章'],
  },
  {
    name: 'game_exploration',
    description: '游戏探索漏斗',
    steps: ['浏览游戏', '收藏游戏', '查看攻略', '获取兑换码'],
  },
]

async function getVisitToRegisterFunnel(days: number): Promise<FunnelStep[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [totalViews, totalUsers, activeUsers, totalArticles] = await Promise.all([
    db.pageView.count({
      where: { created_at: { gte: since } },
    }),
    db.user.count({
      where: { created_at: { gte: since } },
    }),
    db.pageView.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: since },
        user_id: { not: null },
      },
    }),
    db.article.count({
      where: {
        created_at: { gte: since },
        author_id: { not: null },
        source_type: 'ugc',
      },
    }),
  ])

  const uniqueActiveUsers = new Set(activeUsers.map(v => v.user_id).filter(Boolean)).size

  const steps: FunnelStep[] = [
    { name: '页面访问', count: totalViews, percentage: 100, dropoff: 0, dropoff_rate: 0 },
  ]

  const step2Count = Math.min(totalUsers * 2 + uniqueActiveUsers, totalViews)
  const step2Pct = totalViews > 0 ? Math.round((step2Count / totalViews) * 10000) / 100 : 0
  const step2Drop = totalViews - step2Count
  steps.push({
    name: '注册用户',
    count: step2Count,
    percentage: step2Pct,
    dropoff: step2Drop,
    dropoff_rate: totalViews > 0 ? Math.round((step2Drop / totalViews) * 10000) / 100 : 0,
  })

  const step2Base = step2Count || 1
  const step3Pct = Math.round((uniqueActiveUsers / step2Base) * 10000) / 100
  const step3Drop = step2Count - uniqueActiveUsers
  steps.push({
    name: '活跃用户',
    count: uniqueActiveUsers,
    percentage: step3Pct,
    dropoff: step3Drop,
    dropoff_rate: Math.round((step3Drop / step2Base) * 10000) / 100,
  })

  const step3Base = uniqueActiveUsers || 1
  const step4Pct = Math.round((totalArticles / step3Base) * 10000) / 100
  const step4Drop = uniqueActiveUsers - totalArticles
  steps.push({
    name: '内容创作者',
    count: totalArticles,
    percentage: step4Pct,
    dropoff: step4Drop,
    dropoff_rate: Math.round((step4Drop / step3Base) * 10000) / 100,
  })

  return steps
}

async function getContentEngagementFunnel(days: number): Promise<FunnelStep[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [articleViews, articleLikes, comments, shares] = await Promise.all([
    db.pageView.count({
      where: {
        created_at: { gte: since },
        path: { startsWith: '/guides/' },
      },
    }),
    db.like.count({
      where: {
        created_at: { gte: since },
        article_id: { not: null },
      },
    }),
    db.comment.count({
      where: { created_at: { gte: since } },
    }),
    db.article.aggregate({
      where: { published_at: { gte: since } },
      _sum: { share_count: true },
    }),
  ])

  const shareCount = shares._sum.share_count || 0

  const steps: FunnelStep[] = [
    { name: '浏览文章', count: articleViews, percentage: 100, dropoff: 0, dropoff_rate: 0 },
  ]

  const step1Base = articleViews || 1
  const step2Pct = Math.round((articleLikes / step1Base) * 10000) / 100
  const step2Drop = articleViews - articleLikes
  steps.push({
    name: '点赞文章',
    count: articleLikes,
    percentage: step2Pct,
    dropoff: step2Drop,
    dropoff_rate: Math.round((step2Drop / step1Base) * 10000) / 100,
  })

  const step2Base = articleLikes || 1
  const step3Pct = Math.round((comments / step2Base) * 10000) / 100
  const step3Drop = articleLikes - comments
  steps.push({
    name: '发表评论',
    count: comments,
    percentage: step3Pct,
    dropoff: step3Drop,
    dropoff_rate: Math.round((step3Drop / step2Base) * 10000) / 100,
  })

  const step3Base = comments || 1
  const step4Pct = Math.round((shareCount / step3Base) * 10000) / 100
  const step4Drop = comments - shareCount
  steps.push({
    name: '分享文章',
    count: shareCount,
    percentage: step4Pct,
    dropoff: step4Drop,
    dropoff_rate: Math.round((step4Drop / step3Base) * 10000) / 100,
  })

  return steps
}

async function getGameExplorationFunnel(days: number): Promise<FunnelStep[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [gameViews, favorites, guideViews, codeUses] = await Promise.all([
    db.pageView.count({
      where: {
        created_at: { gte: since },
        path: { startsWith: '/games/' },
      },
    }),
    db.favorite.count({
      where: { created_at: { gte: since } },
    }),
    db.pageView.count({
      where: {
        created_at: { gte: since },
        path: { startsWith: '/guides/' },
      },
    }),
    db.gameCode.count({
      where: {
        created_at: { gte: since },
        status: 'active',
      },
    }),
  ])

  const steps: FunnelStep[] = [
    { name: '浏览游戏', count: gameViews, percentage: 100, dropoff: 0, dropoff_rate: 0 },
  ]

  const step1Base = gameViews || 1
  const step2Pct = Math.round((favorites / step1Base) * 10000) / 100
  const step2Drop = gameViews - favorites
  steps.push({
    name: '收藏游戏',
    count: favorites,
    percentage: step2Pct,
    dropoff: step2Drop,
    dropoff_rate: Math.round((step2Drop / step1Base) * 10000) / 100,
  })

  const step2Base = favorites || 1
  const step3Pct = Math.round((guideViews / step2Base) * 10000) / 100
  const step3Drop = favorites - guideViews
  steps.push({
    name: '查看攻略',
    count: guideViews,
    percentage: step3Pct,
    dropoff: step3Drop,
    dropoff_rate: Math.round((step3Drop / step2Base) * 10000) / 100,
  })

  const step3Base = guideViews || 1
  const step4Pct = Math.round((codeUses / step3Base) * 10000) / 100
  const step4Drop = guideViews - codeUses
  steps.push({
    name: '获取兑换码',
    count: codeUses,
    percentage: step4Pct,
    dropoff: step4Drop,
    dropoff_rate: Math.round((step4Drop / step3Base) * 10000) / 100,
  })

  return steps
}

export async function getFunnelAnalysis(funnelName: string, days: number = 30): Promise<{
  definition: FunnelDefinition
  steps: FunnelStep[]
  conversion_rate: number
}> {
  const cacheKey = `analytics:funnel:${funnelName}:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const definition = FUNNEL_DEFINITIONS.find(f => f.name === funnelName) || FUNNEL_DEFINITIONS[0]
    let steps: FunnelStep[] = []

    switch (funnelName) {
      case 'visit_to_register':
        steps = await getVisitToRegisterFunnel(days)
        break
      case 'content_engagement':
        steps = await getContentEngagementFunnel(days)
        break
      case 'game_exploration':
        steps = await getGameExplorationFunnel(days)
        break
      default:
        steps = await getVisitToRegisterFunnel(days)
    }

    const conversionRate = steps.length > 1
      ? steps[steps.length - 1].percentage
      : 0

    const result = { definition, steps, conversion_rate: conversionRate }
    await redis.set(cacheKey, JSON.stringify(result), { ex: FUNNEL_CACHE_TTL })
    return result
  } catch (err) {
    console.error('[Analytics] getFunnelAnalysis error:', err)
    return {
      definition: FUNNEL_DEFINITIONS[0],
      steps: [],
      conversion_rate: 0,
    }
  }
}

export async function getDailyConversionRate(days: number = 30): Promise<Array<{ date: string; rate: number }>> {
  const cacheKey = `analytics:daily_conversion:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    since.setHours(0, 0, 0, 0)

    const dailyViews = await db.pageView.groupBy({
      by: ['created_at'],
      where: { created_at: { gte: since } },
      _count: { id: true },
    })

    const dailyUsers = await db.user.groupBy({
      by: ['created_at'],
      where: { created_at: { gte: since } },
      _count: { id: true },
    })

    const dateMap = new Map<string, { views: number; users: number }>()

    for (const v of dailyViews) {
      const date = v.created_at.toISOString().slice(0, 10)
      if (!dateMap.has(date)) dateMap.set(date, { views: 0, users: 0 })
      dateMap.get(date)!.views += v._count.id
    }

    for (const u of dailyUsers) {
      const date = u.created_at.toISOString().slice(0, 10)
      if (!dateMap.has(date)) dateMap.set(date, { views: 0, users: 0 })
      dateMap.get(date)!.users += u._count.id
    }

    const result = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { views, users }]) => ({
        date,
        rate: views > 0 ? Math.round((users / views) * 10000) / 100 : 0,
      }))

    await redis.set(cacheKey, JSON.stringify(result), { ex: FUNNEL_CACHE_TTL })
    return result
  } catch (err) {
    console.error('[Analytics] getDailyConversionRate error:', err)
    return []
  }
}