import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/articles/[id] - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const article = await db.article.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        comments: {
          orderBy: { created_at: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
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

// PATCH /api/admin/articles/[id] - 更新文章
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const article = await db.article.findUnique({ where: { id } })
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        title: body.title ?? article.title,
        slug: body.slug ?? article.slug,
        content: body.content ?? article.content,
        article_type: body.article_type ?? article.article_type,
        status: body.status ?? article.status,
        game_id: body.game_id ?? article.game_id,
        cover_url: body.cover_url ?? article.cover_url,
        cover_alt: body.cover_alt ?? article.cover_alt,
        excerpt: body.excerpt ?? article.excerpt,
        read_time: body.read_time ?? article.read_time,
        seo_title: body.seo_title ?? article.seo_title,
        seo_description: body.seo_description ?? article.seo_description,
        view_count: body.view_count ?? article.view_count,
        share_count: body.share_count ?? article.share_count,
        published_at: body.status === 'published' && !article.published_at
          ? new Date()
          : article.published_at,
      },
    })

    return NextResponse.json({ success: true, data: updatedArticle })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/articles/[id] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const article = await db.article.findUnique({ where: { id } })
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }

    await db.article.delete({ where: { id } })

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
