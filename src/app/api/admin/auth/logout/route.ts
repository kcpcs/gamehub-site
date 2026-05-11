import { NextRequest, NextResponse } from 'next/server'
import { invalidateAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (sessionToken) {
      await invalidateAdminSession(sessionToken)
    }

    const response = NextResponse.json({
      success: true,
      message: '登出成功',
    })

    response.cookies.delete('admin_session')

    return response
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: '登出失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.delete('admin_session')
  return response
}