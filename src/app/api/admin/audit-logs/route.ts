import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canViewAnalytics) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const adminId = searchParams.get('admin_id')
    const action = searchParams.get('action')
    const resourceType = searchParams.get('resource_type')

    const where: Record<string, any> = {}
    if (adminId) where.admin_id = adminId
    if (action) where.action = action
    if (resourceType) where.resource_type = resourceType

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.auditLog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}