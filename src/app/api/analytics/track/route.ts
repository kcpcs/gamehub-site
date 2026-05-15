import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackEvent } from '@/lib/analytics/tracker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1'

    const userAgent = request.headers.get('user-agent') || undefined

    switch (type) {
      case 'pageview':
        trackPageView({
          path: data.path || '/',
          referrer: data.referrer,
          sessionId: data.sessionId,
          userId: data.userId,
          ip,
          userAgent,
          duration: data.duration,
        })
        break
      case 'event':
        trackEvent({
          event: data.event || 'unknown',
          userId: data.userId,
          sessionId: data.sessionId,
          properties: data.properties,
        })
        break
      default:
        return NextResponse.json({ success: false, error: 'Invalid event type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}