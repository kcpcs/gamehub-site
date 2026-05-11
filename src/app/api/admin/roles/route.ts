import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth, createAuditLog } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const roles = await db.adminRole.findMany({
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ success: true, data: roles })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageRoles) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { 
      name, 
      description,
      can_manage_users = false,
      can_manage_games = false,
      can_manage_articles = false,
      can_manage_codes = false,
      can_manage_tierlists = false,
      can_manage_comments = false,
      can_view_analytics = false,
      can_manage_settings = false,
      can_manage_roles = false,
      can_manage_ai_players = false,
    } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: '角色名称不能为空' },
        { status: 400 }
      )
    }

    const existingRole = await db.adminRole.findUnique({ where: { name } })
    if (existingRole) {
      return NextResponse.json(
        { success: false, error: '该角色名称已存在' },
        { status: 400 }
      )
    }

    const role = await db.adminRole.create({
      data: {
        name,
        description,
        can_manage_users,
        can_manage_games,
        can_manage_articles,
        can_manage_codes,
        can_manage_tierlists,
        can_manage_comments,
        can_view_analytics,
        can_manage_settings,
        can_manage_roles,
        can_manage_ai_players,
      },
    })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'create',
        resource_type: 'admin_role',
        resource_id: role.id,
        details: { name, description },
        success: true,
      },
      request
    )

    return NextResponse.json({ success: true, data: role })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create role' },
      { status: 500 }
    )
  }
}