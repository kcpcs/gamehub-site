import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js Middleware to protect all /api/admin/* routes.
 *
 * This acts as a first-line security gate ensuring that no admin API route
 * can be accessed without valid credentials. It checks:
 * 1. The `admin_session` cookie (set during login)
 * 2. The `x-admin-api-key` header (for server-to-server calls)
 *
 * In development mode, requests are allowed through for convenience.
 *
 * Auth routes (/api/admin/auth/login, /api/admin/auth/logout) are exempt
 * so that admins can authenticate without already being authenticated.
 */

// Paths that should NOT require authentication
const PUBLIC_ADMIN_PATHS = [
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin auth routes (login/logout) without any checks
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    return NextResponse.next()
  }

  // In development mode, allow all requests through for convenience
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Check for admin session cookie
  const sessionToken = request.cookies.get('admin_session')?.value
  if (sessionToken) {
    return NextResponse.next()
  }

  // Check for API key header (used for internal/server-to-server calls)
  const adminApiKey = request.headers.get('x-admin-api-key')
  const expectedKey = process.env.INTERNAL_API_SECRET || process.env.ADMIN_API_KEY
  if (expectedKey && adminApiKey === expectedKey) {
    return NextResponse.next()
  }

  // No valid credentials found - reject the request
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
