import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/games - 获取所有游戏
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ]
    }

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              articles: true,
              codes: true,
              tier_lists: true,
            },
          },
        },
      }),
      db.game.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// POST /api/admin/games - 创建游戏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, cover_url, platforms, genres, description, developer, publisher, release_date } = body

    if (!name || !slug || !cover_url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, cover_url' },
        { status: 400 }
      )
    }

    const existingGame = await db.game.findUnique({ where: { slug } })
    if (existingGame) {
      return NextResponse.json(
        { success: false, error: 'Game with this slug already exists' },
        { status: 409 }
      )
    }

    const game = await db.game.create({
      data: {
        name,
        slug,
        cover_url,
        platforms: platforms || [],
        genres: genres || [],
        description,
        developer,
        publisher,
        release_date: release_date ? new Date(release_date) : null,
      },
    })

    return NextResponse.json({ success: true, data: game }, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create game' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/games - 批量更新游戏
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, action, data } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ids is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action is required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'update':
        if (!data) {
          return NextResponse.json(
            { success: false, error: 'data is required for update action' },
            { status: 400 }
          )
        }
        result = await db.game.updateMany({
          where: { id: { in: ids } },
          data,
        })
        break

      case 'delete':
        result = await db.game.deleteMany({
          where: { id: { in: ids } },
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully performed ${action} on ${result.count} games`,
    })
  } catch (error) {
    console.error('Error performing batch action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch action' },
      { status: 500 }
    )
  }
}
