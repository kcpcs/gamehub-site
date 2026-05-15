import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { requireAdmin } from '@/lib/admin-auth'

const CACHE_TTL = 60 // 1 minute for dashboard

function getEmptyStats() {
  return {
    overview: {
      total_games: 0,
      total_articles: 0,
      total_codes: 0,
      total_users: 0,
      published_articles: 0,
      active_codes: 0,
      draft_articles: 0,
      expired_codes: 0,
    },
    recent_activity: {
      articles: [],
      codes: [],
    },
    top_games: [],
  }
}

// GET /api/admin/dashboard - 获取仪表盘统计数�?
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { db } = await import('@/lib/db')
    
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')
    const cacheKey = `api:admin:dashboard:${days}`

    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached)
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [
      totalGames,
      totalArticles,
      totalCodes,
      totalUsers,
      publishedArticles,
      activeCodes,
      recentArticles,
      recentCodes,
      topGames,
    ] = await Promise.all([
      db.game.count(),
      db.article.count(),
      db.gameCode.count(),
      db.user.count(),
      db.article.count({ where: { status: 'published' } }),
      db.gameCode.count({ where: { status: 'active' } }),
      db.article.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, title: true, status: true, created_at: true,
          game: { select: { name: true } },
        },
      }),
      db.gameCode.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, code: true, status: true, created_at: true,
          game: { select: { name: true } },
        },
      }),
      db.game.findMany({
        take: 10,
        orderBy: { guide_count: 'desc' },
        select: {
          id: true, name: true, slug: true,
          cover_url: true, guide_count: true, code_count: true,
        },
      }),
    ])

    const stats = {
      overview: {
        total_games: totalGames,
        total_articles: totalArticles,
        total_codes: totalCodes,
        total_users: totalUsers,
        published_articles: publishedArticles,
        active_codes: activeCodes,
        draft_articles: totalArticles - publishedArticles,
        expired_codes: totalCodes - activeCodes,
      },
      recent_activity: {
        articles: recentArticles.map(a => ({
          id: a.id,
          title: a.title,
          game: a.game?.name || 'Unknown',
          status: a.status,
          created_at: a.created_at,
        })),
        codes: recentCodes.map(c => ({
          id: c.id,
          code: c.code,
          game: c.game?.name || 'Unknown',
          status: c.status,
          created_at: c.created_at,
        })),
      },
      top_games: topGames.map((g, index) => ({
        rank: index + 1,
        ...g,
      })),
    }

    const responseData = { success: true, data: stats }
    await redis.set(cacheKey, JSON.stringify(responseData), { ex: CACHE_TTL })

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Dashboard API error (DB may not be configured):', error)
    // 数据库不可用时返回空数据而非错误
    return NextResponse.json({ success: true, data: getEmptyStats() })
  }
}
