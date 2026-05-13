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

    const existingFavorite = await db.videoFavorite.findFirst({
      where: { user_id: userId, video_id: videoId }
    })

    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        data: { favorited: true, existing: true }
      })
    }

    const favorite = await db.videoFavorite.create({
      data: { user_id: userId, video_id: videoId }
    })

    return NextResponse.json({
      success: true,
      data: { favorited: true, favoriteId: favorite.id }
    })
  } catch (error) {
    console.error('[POST /api/videos/:videoId/favorite]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to favorite video', code: 'SERVER_ERROR' },
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

    const result = await db.videoFavorite.deleteMany({
      where: { user_id: userId, video_id: videoId }
    })

    if (result.count > 0) {
      return NextResponse.json({ success: true, data: { favorited: false } })
    }

    return NextResponse.json({ success: true, data: { favorited: false } }, { status: 404 })
  } catch (error) {
    console.error('[DELETE /api/videos/:videoId/favorite]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unfavorite video', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
