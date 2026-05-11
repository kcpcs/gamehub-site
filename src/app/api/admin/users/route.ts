import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/users - 获取所有用户
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
      ]
    }

    if (role !== 'all') {
      where.creator_level = role
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
          membership: true,
          creator_level: true,
          points: true,
          article_count: true,
          total_views: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              articles: true,
              tier_votes: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users - 批量更新用户
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
        result = await db.user.updateMany({
          where: { id: { in: ids } },
          data,
        })
        break

      case 'delete':
        result = await db.user.deleteMany({
          where: { id: { in: ids } },
        })
        break

      case 'ban':
        // In a real app, you'd have a banned field
        result = await db.user.updateMany({
          where: { id: { in: ids } },
          data: { membership: 'free' },
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
      message: `Successfully performed ${action} on ${result.count} users`,
    })
  } catch (error) {
    console.error('Error performing batch action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch action' },
      { status: 500 }
    )
  }
}
