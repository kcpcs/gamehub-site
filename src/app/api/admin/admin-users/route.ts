import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth, createAuditLog } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageUsers) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminUsers = await db.adminUser.findMany({
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
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ success: true, data: adminUsers })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized || !authResult.permissions?.canManageUsers) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, username, password, role = 'editor' } = body

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: '邮箱、用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const existingEmail = await db.adminUser.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    const existingUsername = await db.adminUser.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: '该用户名已被使用' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const adminUser = await db.adminUser.create({
      data: {
        email,
        username,
        password_hash: passwordHash,
        role: role as any,
      },
    })

    await createAuditLog(
      {
        admin_id: authResult.admin?.id || null,
        action: 'create',
        resource_type: 'admin_user',
        resource_id: adminUser.id,
        details: { email, username, role },
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
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}