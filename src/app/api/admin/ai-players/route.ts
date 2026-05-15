import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [players, total] = await Promise.all([
      db.aIPlayer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          behavior_config: true,
          stats: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
      }),
      db.aIPlayer.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: players,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[AI Players]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI players', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { username, email, personality, interests, region, occupation, bio } = body

    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: 'username and email are required' },
        { status: 400 }
      )
    }

    const existing = await db.aIPlayer.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A player with this username or email already exists' },
        { status: 409 }
      )
    }

    const player = await db.aIPlayer.create({
      data: {
        username,
        email,
        personality: personality || '{}',
        interests: interests || '[]',
        region: region || null,
        occupation: occupation || null,
        bio: bio || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: player,
      message: 'AI玩家创建成功',
    }, { status: 201 })
  } catch (error) {
    console.error('[AI Players Create]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create AI player', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}