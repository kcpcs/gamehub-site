import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/comments/[id] - 获取单条评论详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comment = await db.comment.findUnique({
      where: { id },
      include: {
        article: {
          select: { slug: true, title: true },
        },
        replies: {
          orderBy: { created_at: 'asc' },
        },
        parent: {
          select: {
            id: true,
            author_username: true,
            content: true,
          },
        },
      },
    })

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comment' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/comments/[id] - 更新/审核评论
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const comment = await db.comment.findUnique({ where: { id } })
    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Allow editing content (moderation)
    if (body.content !== undefined) {
      updateData.content = body.content
    }

    // Allow updating likes
    if (body.likes !== undefined) {
      updateData.likes = body.likes
    }

    const updatedComment = await db.comment.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: updatedComment })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/comments/[id] - 删除单条评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comment = await db.comment.findUnique({ where: { id } })
    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Delete replies first
    await db.comment.deleteMany({ where: { parent_id: id } })
    // Delete the comment
    await db.comment.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
