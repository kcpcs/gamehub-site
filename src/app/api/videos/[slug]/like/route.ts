import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const videoId = slug
    const userId = session.user.id as string

    const existingLike = await db.videoLike.findFirst({
      where: { user_id: userId, video_id: videoId }
    })

    if (existingLike) {
      return NextResponse.json({
        success: true,
        data: { liked: true, existing: true }
      })
    }

    await db.videoLike.create({
      data: { user_id: userId, video_id: videoId }
    })

    return NextResponse.json({ success: true, data: { liked: true } })
  } catch (error) {
    console.error('[POST /api/videos/:videoId/like]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like video', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const videoId = slug
    const userId = session.user.id as string

    await db.videoLike.deleteMany({
      where: { user_id: userId, video_id: videoId }
    })

    return NextResponse.json({ success: true, data: { liked: false } })
  } catch (error) {
    console.error('[DELETE /api/videos/:videoId/like]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unlike video', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
