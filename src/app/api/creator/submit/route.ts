import { NextRequest, NextResponse } from 'next/server'
import { submitContent, getCreatorSubmissions, getCreatorProfile } from '@/lib/creator-program'
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

    const profile = await getCreatorProfile(session.user.id as string)
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'You must be an approved creator', code: 'NOT_CREATOR' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { content_type, title, description, url, game_id } = body

    if (!content_type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      )
    }

    const submission = await submitContent({
      creator_id: profile.id,
      content_type,
      title,
      description,
      url,
      game_id
    })

    return NextResponse.json({ success: true, data: submission })
  } catch (error) {
    console.error('[POST /api/creator/submit]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit content', code: 'SERVER_ERROR' },
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

    const profile = await getCreatorProfile(session.user.id as string)
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'You must be an approved creator', code: 'NOT_CREATOR' },
        { status: 403 }
      )
    }

    const submissions = await getCreatorSubmissions(profile.id)

    return NextResponse.json({ success: true, data: submissions })
  } catch (error) {
    console.error('[GET /api/creator/submit]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
