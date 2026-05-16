import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const gameUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  cover_url: z.string().url().optional(),
  platforms: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  description: z.string().max(5000).optional(),
  developer: z.string().max(100).optional(),
  publisher: z.string().max(100).optional(),
  release_date: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

const batchActionSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(['update', 'delete']),
  data: gameUpdateSchema.optional(),
})

// GET /api/admin/games - 获取所有游戏
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
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

    // 将 JSON 字符串字段解析为数组
    const parsedGames = games.map(game => ({
      ...game,
      screenshots: game.screenshots ? JSON.parse(game.screenshots) : [],
      platforms: game.platforms ? JSON.parse(game.platforms) : [],
      genres: game.genres ? JSON.parse(game.genres) : [],
      tags: game.tags ? JSON.parse(game.tags) : [],
    }))

    return NextResponse.json({
      success: true,
      data: parsedGames,
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
    await requireAdmin(request)
    const body = await request.json()
    const { name, slug, cover_url, platforms, genres, tags, screenshots, description, developer, publisher, release_date } = body

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
        screenshots: JSON.stringify(screenshots || []),
        platforms: JSON.stringify(platforms || []),
        genres: JSON.stringify(genres || []),
        tags: JSON.stringify(tags || []),
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
    await requireAdmin(request)
    const body = await request.json()
    
    const validation = batchActionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const { ids, action, data } = validation.data

    let result

    switch (action) {
      case 'update':
        if (!data || Object.keys(data).length === 0) {
          return NextResponse.json(
            { success: false, error: 'data is required for update action' },
            { status: 400 }
          )
        }
        const ALLOWED_GAME_UPDATE_FIELDS = ['name', 'slug', 'cover_url', 'platforms', 'genres', 'description', 'developer', 'publisher', 'release_date', 'status']
        const sanitizedData = Object.fromEntries(
          Object.entries(data).filter(([key]) => ALLOWED_GAME_UPDATE_FIELDS.includes(key))
        )
        result = await db.game.updateMany({
          where: { id: { in: ids } },
          data: sanitizedData,
        })
        break

      case 'delete':
        result = await db.game.deleteMany({
          where: { id: { in: ids } },
        })
        break
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
