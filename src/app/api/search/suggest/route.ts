import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

// GET /api/search/suggest - 搜索建议
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q')?.trim()

    // 验证查询
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 })
    }

    if (query.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query too short (min 2 characters)'
      }, { status: 400 })
    }

    // 搜索游戏
    const games = await db.game.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query
            }
          },
          {
            slug: {
              contains: query
            }
          }
        ]
      },
      take: 8,
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true
      },
      orderBy: {
        guide_count: 'desc'
      }
    })

    // 搜索文章/指南
    const articles = await db.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            slug: {
              contains: query
            }
          }
        ],
        status: 'published'
      },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        article_type: true,
        cover_url: true
      },
      orderBy: {
        view_count: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        suggestions: {
          games: games.map(game => ({
            type: 'game',
            id: game.id,
            slug: game.slug,
            name: game.name,
            cover_url: game.cover_url
          })),
          articles: articles.map(article => ({
            type: 'article',
            id: article.id,
            slug: article.slug,
            title: article.title,
            article_type: article.article_type,
            cover_url: article.cover_url
          }))
        }
      }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[GET /api/search/suggest]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
