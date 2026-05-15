import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/logs - 获取操作日志
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action') || 'all'
    const resourceType = searchParams.get('resource_type') || 'all'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Mock logs data - In production, fetch from database
    const mockLogs = [
      {
        id: '1',
        user_id: 'admin-1',
        user_name: '管理员',
        action: 'CREATE',
        resource_type: 'article',
        resource_id: 'article-123',
        resource_name: '原神新手入门指南',
        details: { title: '原神新手入门指南' },
        ip_address: '192.168.1.1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: '2',
        user_id: 'admin-1',
        user_name: '管理员',
        action: 'UPDATE',
        resource_type: 'game',
        resource_id: 'game-456',
        resource_name: '艾尔登法环',
        details: { cover_url: 'https://...' },
        ip_address: '192.168.1.1',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: '3',
        user_id: 'admin-1',
        user_name: '管理员',
        action: 'DELETE',
        resource_type: 'code',
        resource_id: 'code-789',
        resource_name: 'GENSHINGIFT',
        details: {},
        ip_address: '192.168.1.1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '4',
        user_id: 'editor-1',
        user_name: '编辑小明',
        action: 'CREATE',
        resource_type: 'article',
        resource_id: 'article-124',
        resource_name: 'Valorant角色推荐',
        details: { title: 'Valorant角色推荐' },
        ip_address: '192.168.1.2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: '5',
        user_id: 'admin-1',
        user_name: '管理员',
        action: 'LOGIN',
        resource_type: 'auth',
        resource_id: 'session-001',
        resource_name: '登录成功',
        details: { method: 'password' },
        ip_address: '192.168.1.1',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ]

    // Filter logs
    let filteredLogs = mockLogs

    if (action !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }

    if (resourceType !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.resource_type === resourceType)
    }

    // Pagination
    const total = filteredLogs.length
    const skip = (page - 1) * limit
    const paginatedLogs = filteredLogs.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
