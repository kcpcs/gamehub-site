import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/comments - 获取所有评论 (with pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all' // all, pending, approved, spam

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { content: { contains: search } },
        { author_username: { contains: search } },
        { article_slug: { contains: search } },
      ]
    }

    // We don't have a status field in Comment model, so we handle it client-side
    // But we can filter by parent_id for top-level vs replies
    const filterTopLevel = searchParams.get('top_level')
    if (filterTopLevel === 'true') {
      where.parent_id = null
    }

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          article: {
            select: {
              slug: true,
              title: true,
            },
          },
          replies: {
            select: {
              id: true,
            },
          },
        },
      }),
      db.comment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/comments - 批量删除评论
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ids is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    // Delete replies first (child comments)
    await db.comment.deleteMany({
      where: { parent_id: { in: ids } },
    })

    // Delete the comments themselves
    const result = await db.comment.deleteMany({
      where: { id: { in: ids } },
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully deleted ${result.count} comments`,
    })
  } catch (error) {
    console.error('Error deleting comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comments' },
      { status: 500 }
    )
  }
}
