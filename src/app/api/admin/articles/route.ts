import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const articleUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  content: z.string().max(50000).optional(),
  article_type: z.enum(['guide', 'news', 'review', 'tierlist']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  game_id: z.string().optional(),
  cover_url: z.string().url().optional(),
  cover_alt: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional(),
  read_time: z.number().int().min(1).max(300).optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
})

const batchActionSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(['update', 'delete']),
  data: articleUpdateSchema.optional(),
})

// GET /api/admin/articles - 获取所有文章
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const type = searchParams.get('type') || 'all'

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    if (type !== 'all') {
      where.article_type = type
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

// POST /api/admin/articles - 创建文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      article_type = 'guide',
      status = 'draft',
      game_id,
      cover_url,
      cover_alt,
      excerpt,
      read_time = 5,
      seo_title,
      seo_description,
    } = body

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
        article_type: article_type as any,
        status: status as any,
        game_id,
        cover_url: cover_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20guide%20cover%20art%20${encodeURIComponent(title)}%20gaming%20dark%20theme%20fantasy%20style&image_size=landscape_16_9`,
        cover_alt: cover_alt || title,
        excerpt: excerpt || content.substring(0, 200) + '...',
        read_time: read_time || Math.ceil(content.split(/\s+/).length / 200),
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt || content.substring(0, 160),
        published_at: status === 'published' ? new Date() : null,
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

// PATCH /api/admin/articles - 批量更新文章
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = batchActionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const { ids, action, data } = validation.data

    let result

    switch (action) {
      case 'update':
        if (!data || Object.keys(data).length === 0) {
          return NextResponse.json(
            { success: false, error: 'data is required for update action' },
            { status: 400 }
          )
        }
        // 添加字段白名单过滤
        const ALLOWED_ARTICLE_UPDATE_FIELDS = ['title', 'slug', 'content', 'article_type', 'status', 'game_id', 'cover_url', 'cover_alt', 'excerpt', 'read_time', 'seo_title', 'seo_description']
        const sanitizedData = Object.fromEntries(
          Object.entries(data).filter(([key]) => ALLOWED_ARTICLE_UPDATE_FIELDS.includes(key))
        )
        result = await db.article.updateMany({
          where: { id: { in: ids } },
          data: {
            ...sanitizedData,
            ...(sanitizedData.status === 'published' && { published_at: new Date() }),
          },
        })
        break

      case 'delete':
        result = await db.article.deleteMany({
          where: { id: { in: ids } },
        })
        break
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully performed ${action} on ${result.count} articles`,
    })
  } catch (error) {
    console.error('Error performing batch action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform batch action' },
      { status: 500 }
    )
  }
}
