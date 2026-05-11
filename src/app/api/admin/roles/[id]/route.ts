import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth, createAuditLog } from '@/lib/admin-auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const role = await db.adminRole.findUnique({ where: { id } })

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: role })
  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch role' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageRoles) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { 
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
    } = body

    const role = await db.adminRole.findUnique({ where: { id } })
    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, any> = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (can_manage_users !== undefined) updateData.can_manage_users = can_manage_users
    if (can_manage_games !== undefined) updateData.can_manage_games = can_manage_games
    if (can_manage_articles !== undefined) updateData.can_manage_articles = can_manage_articles
    if (can_manage_codes !== undefined) updateData.can_manage_codes = can_manage_codes
    if (can_manage_tierlists !== undefined) updateData.can_manage_tierlists = can_manage_tierlists
    if (can_manage_comments !== undefined) updateData.can_manage_comments = can_manage_comments
    if (can_view_analytics !== undefined) updateData.can_view_analytics = can_view_analytics
    if (can_manage_settings !== undefined) updateData.can_manage_settings = can_manage_settings
    if (can_manage_roles !== undefined) updateData.can_manage_roles = can_manage_roles
    if (can_manage_ai_players !== undefined) updateData.can_manage_ai_players = can_manage_ai_players

    const updatedRole = await db.adminRole.update({
      where: { id },
      data: updateData,
    })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'update',
        resource_type: 'admin_role',
        resource_id: updatedRole.id,
        details: updateData,
        success: true,
      },
      request
    )

    return NextResponse.json({ success: true, data: updatedRole })
  } catch (error: any) {
    console.error('Error updating role:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: '角色名称已存在' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update role' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageRoles) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const role = await db.adminRole.findUnique({ where: { id } })
    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      )
    }

    const defaultRoles = ['super_admin_role', 'admin_role', 'moderator_role', 'editor_role']
    if (defaultRoles.includes(id)) {
      return NextResponse.json(
        { success: false, error: '无法删除默认角色' },
        { status: 400 }
      )
    }

    await db.adminRole.delete({ where: { id } })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'delete',
        resource_type: 'admin_role',
        resource_id: id,
        details: { name: role.name },
        success: true,
      },
      request
    )

    return NextResponse.json({ success: true, message: 'Role deleted' })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete role' },
      { status: 500 }
    )
  }
}