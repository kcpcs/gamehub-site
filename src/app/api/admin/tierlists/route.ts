import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/tierlists - 获取所有排行榜
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.game = { name: { contains: search } }
    }

    if (category !== 'all') {
      where.category = category
    }

    const [tierLists, total] = await Promise.all([
      db.tierList.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
              cover_url: true,
            },
          },
          entries: {
            orderBy: { avg_score: 'desc' },
          },
          _count: {
            select: {
              entries: true,
              votes: true,
            },
          },
        },
      }),
      db.tierList.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: tierLists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching tier lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tier lists' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tierlists - 创建排行榜
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { game_id, category, patch_version, is_community = true, entries = [] } = body

    if (!game_id || !category || !patch_version) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: game_id, category, patch_version' },
        { status: 400 }
      )
    }

    // Check if tier list already exists for this game+category
    const existing = await db.tierList.findUnique({
      where: { game_id_category: { game_id, category } },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A tier list for this game and category already exists' },
        { status: 409 }
      )
    }

    const tierList = await db.tierList.create({
      data: {
        game_id,
        category: category as any,
        patch_version,
        is_community,
        entries: {
          create: entries.map((entry: any) => ({
            name: entry.name,
            image_url: entry.image_url || '',
            grade: entry.grade as any,
            description: entry.description || null,
          })),
        },
      },
      include: {
        game: {
          select: { id: true, name: true, slug: true },
        },
        entries: true,
      },
    })

    return NextResponse.json({ success: true, data: tierList }, { status: 201 })
  } catch (error) {
    console.error('Error creating tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tier list' },
      { status: 500 }
    )
  }
}
