import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { ApiResponse } from '@/types'

// POST /api/comments/vote - 评论投票
export async function POST(req: NextRequest) {
  try {
    const session = getSession()
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await req.json()
    const { commentId, value } = body

    // 验证输入
    if (!commentId) {
      return NextResponse.json({
        success: false,
        error: 'Comment ID is required'
      }, { status: 400 })
    }

    if (value !== 1 && value !== -1 && value !== 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid vote value (must be 1, -1, or 0)'
      }, { status: 400 })
    }

    // 检查评论是否存在
    const comment = await db.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found'
      }, { status: 404 })
    }

    // 查找现有投票
    const existingVote = await db.commentVote.findUnique({
      where: {
        user_id_comment_id: {
          user_id: session.user.id,
          comment_id: commentId
        }
      }
    })

    let vote
    let delta = 0

    if (value === 0) {
      // 取消投票
      if (existingVote) {
        delta = -existingVote.value
        await db.commentVote.delete({
          where: { id: existingVote.id }
        })
      }
    } else if (existingVote) {
      // 更新投票
      delta = value - existingVote.value
      vote = await db.commentVote.update({
        where: { id: existingVote.id },
        data: { value }
      })
    } else {
      // 创建新投票
      delta = value
      vote = await db.commentVote.create({
        data: {
          user_id: session.user.id,
          comment_id: commentId,
          value
        }
      })
    }

    // 更新评论的投票分数
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: {
        vote_score: {
          increment: delta
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        vote,
        comment: updatedComment
      }
    } as ApiResponse<any>)
  } catch (error) {
    console.error('[POST /api/comments/vote]', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
