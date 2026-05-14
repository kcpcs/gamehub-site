import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { ApiResponse } from '@/types'

// GET /api/games/[slug]/ratings - 获取游戏评分列表（支持分页和排序）
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = req.nextUrl.searchParams
    
    // Query parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    // 查找游戏
    const game = await db.game.findUnique({
      where: { slug }
    })

    if (!game) {
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }

    const skip = (page - 1) * limit

    // 构建排序条件
    const orderBy: any = {}
    if (sort === 'score') {
      orderBy.score = order
    } else if (sort === 'helpful') {
      orderBy.helpful_count = order
    } else {
      orderBy.created_at = order
    }

    // 获取评分列表
    const [ratings, total] = await Promise.all([
      db.gameRating.findMany({
        where: { game_id: game.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        },
        skip,
        take: limit,
        orderBy
      }),
      db.gameRating.count({ where: { game_id: game.id } })
    ])

    // 计算统计数据
    const stats = await db.gameRating.aggregate({
      where: { game_id: game.id },
      _avg: { score: true },
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        ratings,
        stats: {
          average: stats._avg.score || 0,
          total: stats._count.id
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[GET /api/games/[slug]/ratings]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/games/[slug]/ratings - 创建或更新游戏评分
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { slug } = await params
    const body = await req.json()
    const { score, review } = body

    if (!score || score < 1 || score > 5) {
      return NextResponse.json({
        success: false,
        error: 'Invalid score (must be 1-5)'
      }, { status: 400 })
    }

    // 查找游戏
    const game = await db.game.findUnique({
      where: { slug }
    })

    if (!game) {
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }

    // 查找现有评分或创建新评分
    const existingRating = await db.gameRating.findUnique({
      where: {
        user_id_game_id: {
          user_id: session.user.id,
          game_id: game.id
        }
      }
    })

    let rating

    if (existingRating) {
      // 更新现有评分
      rating = await db.gameRating.update({
        where: { id: existingRating.id },
        data: {
          score,
          review: review || existingRating.review
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      })
    } else {
      // 创建新评分
      rating = await db.gameRating.create({
        data: {
          user_id: session.user.id,
          game_id: game.id,
          score,
          review: review || null
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: rating
    } as ApiResponse<any>, { status: existingRating ? 200 : 201 })
  } catch (error) {
    console.error('[POST /api/games/[slug]/ratings]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/games/[slug]/ratings - 删除评分
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { slug } = await params

    // 查找游戏
    const game = await db.game.findUnique({
      where: { slug }
    })

    if (!game) {
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }

    // 删除评分
    const deleted = await db.gameRating.deleteMany({
      where: {
        user_id: session.user.id,
        game_id: game.id
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({
        success: false,
        error: 'Rating not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: null
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[DELETE /api/games/[slug]/ratings]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
