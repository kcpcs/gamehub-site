import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createAdminSession, validateAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    const admin = await db.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        password_hash: true,
        role: true,
        failed_attempts: true,
        locked_until: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    const now = new Date()
    if (admin.locked_until && new Date(admin.locked_until) > now) {
      const remainingMinutes = Math.ceil(
        (new Date(admin.locked_until).getTime() - now.getTime()) / 60000
      )
      return NextResponse.json(
        { success: false, error: `账户已锁定，请${remainingMinutes}分钟后再试` },
        { status: 423 }
      )
    }

    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      const newFailedAttempts = admin.failed_attempts + 1
      let lockedUntil = null

      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(now.getTime() + 15 * 60 * 1000)
      }

      await db.adminUser.update({
        where: { id: admin.id },
        data: {
          failed_attempts: newFailedAttempts,
          locked_until: lockedUntil?.toISOString() || null,
        },
      })

      const attemptsLeft = Math.max(0, 5 - newFailedAttempts)
      return NextResponse.json(
        { success: false, error: `邮箱或密码错误，剩余${attemptsLeft}次尝试机会` },
        { status: 401 }
      )
    }

    await db.adminUser.update({
      where: { id: admin.id },
      data: {
        failed_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString(),
      },
    })

    const session = await createAdminSession(admin)

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
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}