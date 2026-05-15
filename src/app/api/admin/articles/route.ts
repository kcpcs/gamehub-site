import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
      ]
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
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
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      db.article.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      )
    }

    const existingArticle = await db.article.findUnique({ where: { slug } })
    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article with this slug already exists' },
        { status: 409 }
      )
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        article_type: 'guide',
        status: 'draft',
        cover_alt: title,
        excerpt: content.substring(0, 200) + '...',
        read_time: 5,
        seo_title: title,
        seo_description: content.substring(0, 160),
      },
    })

    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
