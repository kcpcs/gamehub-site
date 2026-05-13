import { NextRequest, NextResponse } from 'next/server'
import { submitCreatorApplication, getCreatorApplication } from '@/lib/creator-program'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { platform, channel_url, channel_name, subscriber_count, content_type, experience } = body

    if (!platform || !channel_url || !channel_name || !subscriber_count) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      )
    }

    const application = await submitCreatorApplication({
      user_id: session.user.id as string,
      platform,
      channel_url,
      channel_name,
      subscriber_count: parseInt(subscriber_count),
      content_type: content_type || [],
      experience: experience || ''
    })

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error('[POST /api/creator/apply]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    const application = await getCreatorApplication(session.user.id as string)

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'No application found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error('[GET /api/creator/apply]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
