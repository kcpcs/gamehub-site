import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 开发模式：完全开放所有API，不做任何验证
  if (process.env.NODE_ENV === 'development') {
    const response = NextResponse.next()
    response.headers.set('x-admin-id', 'admin-1')
    response.headers.set('x-admin-role', 'super_admin')
    return response
  }

  // 生产模式才做验证
  const sessionToken = request.cookies.get('admin_session')?.value
  if (sessionToken) {
    try {
      const { validateAdminSession } = await import('@/lib/admin-auth')
      const session = await validateAdminSession(sessionToken)
      if (session) {
        const response = NextResponse.next()
        response.headers.set('x-admin-id', session.id.toString())
        response.headers.set('x-admin-role', session.role)
        return response
      }
    } catch {
      // Session validation failed, fall through to rejection
    }
  }

  const adminApiKey = request.headers.get('x-admin-api-key')
  const expectedKey = process.env.INTERNAL_API_SECRET || process.env.ADMIN_API_KEY
  if (expectedKey && adminApiKey === expectedKey) {
    return NextResponse.next()
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized: Admin authentication required',
      code: 'ADMIN_AUTH_REQUIRED',
    },
    { status: 401 }
  )
}

export const config = {
  matcher: '/api/admin/:path*',
}
