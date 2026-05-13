import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const videoId = slug
    const searchParams = req.nextUrl.searchParams
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '20')

    const comments = await db.videoComment.findMany({
      where: {
        video_id: videoId,
        parent_id: null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        replies: {
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0
    })

    const hasNextPage = comments.length > limit
    const edges = hasNextPage ? comments.slice(0, -1) : comments

    return NextResponse.json({
      success: true,
      data: {
        comments: edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].id : null
        }
      }
    })
  } catch (error) {
    console.error('[GET /api/videos/:videoId/comments]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

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
    const body = await req.json()
    const { content, parentId } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required', code: 'INVALID_INPUT' },
        { status: 400 }
      )
    }

    const comment = await db.videoComment.create({
      data: {
        video_id: videoId,
        user_id: session.user.id as string,
        content: content.trim(),
        parent_id: parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('[POST /api/videos/:videoId/comments]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to post comment', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
