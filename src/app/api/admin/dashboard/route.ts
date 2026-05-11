import { NextRequest, NextResponse } from 'next/server'

// 空数据回退（数据库未配置时使用）
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

// GET /api/admin/dashboard - 获取仪表盘统计数据
export async function GET(request: NextRequest) {
  try {
    // 动态导入数据库，避免在无数据库环境中崩溃
    const { db } = await import('@/lib/db')
    
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')

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
        include: {
          game: { select: { name: true } },
        },
      }),
      db.gameCode.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          game: { select: { name: true } },
        },
      }),
      db.game.findMany({
        take: 10,
        orderBy: { guide_count: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          cover_url: true,
          guide_count: true,
          code_count: true,
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

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Dashboard API error (DB may not be configured):', error)
    // 数据库不可用时返回空数据而非错误
    return NextResponse.json({ success: true, data: getEmptyStats() })
  }
}
