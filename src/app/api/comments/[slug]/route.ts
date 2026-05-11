import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Comment {
  id: string
  author: {
    username: string
    avatar?: string
  }
  content: string
  created_at: string
  likes: number
  replies?: Comment[]
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    const comments = await db.comment.findMany({
      where: { article_slug: slug },
      orderBy: { created_at: 'desc' },
      take: 50,
    })

    const formattedComments: Comment[] = comments.map(comment => ({
      id: comment.id,
      author: {
        username: comment.author_username || 'Anonymous',
        avatar: undefined,
      },
      content: comment.content,
      created_at: comment.created_at.toISOString(),
      likes: 0,
    }))

    return NextResponse.json({
      success: true,
      data: formattedComments,
    })
  } catch (err) {
    console.error('[GET /api/comments]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch comments',
    }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    const body = await req.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Content is required',
      }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        article_slug: slug,
        author_username: 'Guest_User',
        content: content.trim(),
      },
    })

    const responseComment: Comment = {
      id: comment.id,
      author: {
        username: comment.author_username || 'Anonymous',
        avatar: undefined,
      },
      content: comment.content,
      created_at: comment.created_at.toISOString(),
      likes: 0,
    }

    return NextResponse.json({
      success: true,
      data: responseComment,
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/comments]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to create comment',
    }, { status: 500 })
  }
}