import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminSession } from '@/lib/admin-auth'

import type { AdminRoleType } from '@/lib/admin-auth'

const ADMIN_USERS: Array<{
  id: string; email: string; username: string; avatar: string | null;
  password_hash: string; role: AdminRoleType;
}> = []

async function loadAdminUsers() {
  if (ADMIN_USERS.length > 0) return

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gamehub.ai'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  ADMIN_USERS.push({
    id: 'admin-1',
    email: adminEmail,
    username: 'admin',
    avatar: null,
    password_hash: hashedPassword,
    role: 'super_admin' as AdminRoleType,
  })

  const extraAdmins = process.env.ADMIN_EXTRA_USERS
  if (extraAdmins) {
    try {
      const parsed = JSON.parse(extraAdmins)
      for (const entry of parsed) {
        if (entry.email && entry.password) {
          ADMIN_USERS.push({
            id: entry.id || `admin-${Date.now()}`,
            email: entry.email,
            username: entry.username || entry.email.split('@')[0],
            avatar: null,
            password_hash: await bcrypt.hash(entry.password, 12),
            role: (entry.role as AdminRoleType) || 'admin',
          })
        }
      }
    } catch { /* ignore malformed JSON */ }
  }
}

export async function POST(request: NextRequest) {
  try {
    await loadAdminUsers()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    const admin = ADMIN_USERS.find(u => u.email === email)

    if (!admin) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const session = await createAdminSession({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      avatar: admin.avatar,
      role: admin.role,
    })

    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        avatar: admin.avatar,
        role: admin.role,
      },
    })

    response.cookies.set('admin_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin login error:', message)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}