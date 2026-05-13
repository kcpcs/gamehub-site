import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/articles/[id] - 获取单个文章详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const article = await db.article.findUnique({
      where: { id },
      include: {
        game: true,
        author: true,
      },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/articles/[id] - 更新单个文章
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const article = await db.article.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        article_type: body.article_type,
        status: body.status,
        game_id: body.game_id,
        cover_url: body.cover_url,
        cover_alt: body.cover_alt,
        excerpt: body.excerpt,
        read_time: body.read_time,
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        published_at: body.status === 'published' ? new Date() : undefined,
      },
    })

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/articles/[id] - 删除单个文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await db.article.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
