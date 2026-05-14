import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

// GET /api/games/compare - 游戏对比
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const slugs = searchParams.getAll('slug')

    // 验证 slug 数量
    if (slugs.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'At least 2 games are required for comparison'
      }, { status: 400 })
    }

    if (slugs.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 5 games can be compared at once'
      }, { status: 400 })
    }

    // 查找游戏
    const games = await db.game.findMany({
      where: {
        slug: { in: slugs }
      },
      include: {
        ratings: true
      }
    })

    // 检查是否所有游戏都找到
    if (games.length !== slugs.length) {
      const foundSlugs = games.map(g => g.slug)
      const missingSlugs = slugs.filter(s => !foundSlugs.includes(s))
      return NextResponse.json({
        success: false,
        error: `Some games not found: ${missingSlugs.join(', ')}`
      }, { status: 404 })
    }

    // 计算每个游戏的统计数据
    const gamesWithStats = games.map(game => {
      const ratings = game.ratings || []
      const avgScore = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0

      return {
        id: game.id,
        slug: game.slug,
        name: game.name,
        cover_url: game.cover_url,
        platforms: game.platforms,
        genres: game.genres,
        developer: game.developer,
        publisher: game.publisher,
        release_date: game.release_date,
        score_opencritic: game.score_opencritic,
        score_steam_pct: game.score_steam_pct,
        score_community: game.score_community,
        score_review_count: game.score_review_count,
        guide_count: game.guide_count,
        code_count: game.code_count,
        userRating: {
          average: avgScore,
          count: ratings.length
        }
      }
    })

    // 按照请求的 slug 顺序排列
    const orderedGames = slugs.map(slug => 
      gamesWithStats.find(g => g.slug === slug)
    ).filter(Boolean)

    return NextResponse.json({
      success: true,
      data: {
        games: orderedGames
      }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[GET /api/games/compare]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
