import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/comments/[id] - 获取单个评论详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const comment = await db.comment.findUnique({
      where: { id },
      include: {
        article: true,
        replies: true,
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

// PATCH /api/admin/comments/[id] - 更新单个评论
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const comment = await db.comment.update({
      where: { id },
      data: {
        content: body.content,
      },
    })

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/comments/[id] - 删除单个评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await db.comment.deleteMany({
      where: { OR: [{ id }, { parent_id: id }] },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment and its replies deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
