import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth, createAuditLog } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageUsers) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const adminUser = await db.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: adminUser })
  } catch (error) {
    console.error('Error fetching admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageUsers) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { email, username, password, role, avatar } = body

    const updateData: Record<string, any> = {}
    if (email !== undefined) updateData.email = email
    if (username !== undefined) updateData.username = username
    if (role !== undefined) updateData.role = role
    if (avatar !== undefined) updateData.avatar = avatar
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      )
    }

    const adminUser = await db.adminUser.update({
      where: { id },
      data: updateData,
    })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'update',
        resource_type: 'admin_user',
        resource_id: adminUser.id,
        details: updateData,
        success: true,
      },
      request
    )

    return NextResponse.json({
      success: true,
      data: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
      },
    })
  } catch (error: any) {
    console.error('Error updating admin user:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: '邮箱或用户名已被使用' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageUsers) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const adminUser = await db.adminUser.findUnique({ where: { id } })
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      )
    }

    if (authResult.admin?.id === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await db.adminUser.delete({ where: { id } })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'delete',
        resource_type: 'admin_user',
        resource_id: id,
        details: { email: adminUser.email, username: adminUser.username },
        success: true,
      },
      request
    )

    return NextResponse.json({ success: true, message: 'Admin user deleted' })
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin user' },
      { status: 500 }
    )
  }
}