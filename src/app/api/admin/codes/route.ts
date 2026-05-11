import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/codes - 获取所有兑换码
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const game_id = searchParams.get('game_id') || ''

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { code: { contains: search } },
        { reward_desc: { contains: search } },
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    if (game_id) {
      where.game_id = game_id
    }

    const [codes, total] = await Promise.all([
      db.gameCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          submitted_by: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      db.gameCode.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: codes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching codes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch codes' },
      { status: 500 }
    )
  }
}

// POST /api/admin/codes - 创建兑换码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, game_id, reward_desc, source = 'official', expires_at } = body

    if (!code || !game_id || !reward_desc) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: code, game_id, reward_desc' },
        { status: 400 }
      )
    }

    const game = await db.game.findUnique({ where: { id: game_id } })
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    const existingCode = await db.gameCode.findFirst({
      where: { code, game_id },
    })
    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Code already exists for this game' },
        { status: 409 }
      )
    }

    const gameCode = await db.gameCode.create({
      data: {
        code,
        game_id,
        reward_desc,
        source: source as any,
        expires_at: expires_at ? new Date(expires_at) : null,
        status: 'active',
      },
    })

    await db.game.update({
      where: { id: game_id },
      data: { code_count: { increment: 1 } },
    })

    return NextResponse.json({ success: true, data: gameCode }, { status: 201 })
  } catch (error) {
    console.error('Error creating code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create code' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/codes - 批量更新兑换码
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
        result = await db.gameCode.updateMany({
          where: { id: { in: ids } },
          data,
        })
        break

      case 'delete':
        result = await db.gameCode.deleteMany({
          where: { id: { in: ids } },
        })
        break

      case 'verify':
        result = await db.gameCode.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'active',
            verified_at: new Date(),
          },
        })
        break

      case 'expire':
        result = await db.gameCode.updateMany({
          where: { id: { in: ids } },
          data: { status: 'expired' },
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
      message: `Successfully performed ${action} on ${result.count} codes`,
    })
  } catch (error) {
    console.error('Error performing batch action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch action' },
      { status: 500 }
    )
  }
}
