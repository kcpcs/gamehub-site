import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { ApiResponse } from '@/types'

// GET /api/notifications - 获取通知列表
export async function GET(req: NextRequest) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const unreadOnly = searchParams.get('unread') === 'true'

    const skip = (page - 1) * limit
    const where: any = { user_id: session.user.id }
    
    if (unreadOnly) {
      where.read = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      db.notification.count({ where: { user_id: session.user.id } }),
      db.notification.count({ where: { user_id: session.user.id, read: false } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        unreadCount
      }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[GET /api/notifications]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PATCH /api/notifications - 标记通知为已读
export async function PATCH(req: NextRequest) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await req.json()
    const { ids, all } = body

    if (all) {
      await db.notification.updateMany({
        where: { user_id: session.user.id, read: false },
        data: { read: true }
      })
    } else if (ids && Array.isArray(ids)) {
      await db.notification.updateMany({
        where: {
          id: { in: ids },
          user_id: session.user.id
        },
        data: { read: true }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid request'
      }, { status: 400 })
    }

    const unreadCount = await db.notification.count({
      where: { user_id: session.user.id, read: false }
    })

    return NextResponse.json({
      success: true,
      data: { unreadCount }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[PATCH /api/notifications]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/notifications - 删除旧通知
export async function DELETE(req: NextRequest) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await req.json()
    const { olderThan, ids, all } = body

    const where: any = { user_id: session.user.id }

    if (all) {
      // 删除所有已读通知
      where.read = true
    } else if (ids && Array.isArray(ids)) {
      where.id = { in: ids }
    } else if (olderThan) {
      const date = new Date(olderThan)
      if (isNaN(date.getTime())) {
        return NextResponse.json({
          success: false,
          error: 'Invalid date'
        }, { status: 400 })
      }
      where.created_at = { lt: date }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid request'
      }, { status: 400 })
    }

    const deleted = await db.notification.deleteMany({ where })

    return NextResponse.json({
      success: true,
      data: { deletedCount: deleted.count }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[DELETE /api/notifications]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
