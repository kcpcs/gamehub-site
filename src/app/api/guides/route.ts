import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { safeJsonParse } from '@/lib/data-utils'
import type { ApiResponse, ArticleFilters, PaginationMeta } from '@/types'

const CACHE_TTL = 300

/**
 * GET /api/guides
 * Query params: game_slug, article_type, sort, page, limit
 * Returns: ApiResponse<{ articles: ArticleCard[]; meta: PaginationMeta }>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filters: ArticleFilters = {
    game_slug:    searchParams.get('game_slug') ?? undefined,
    article_type: (searchParams.get('type') as ArticleFilters['article_type']) ?? undefined,
    sort:         (searchParams.get('sort') as ArticleFilters['sort']) ?? 'latest',
    page:         Number(searchParams.get('page') ?? 1),
    limit:        Math.min(Number(searchParams.get('limit') ?? 20), 40),
  }

  const cacheKey = `api:guides:${JSON.stringify(filters)}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      const parsedCached = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(parsedCached)
    }

    const where: Record<string, unknown> = { status: 'published' }
    if (filters.article_type) where.article_type = filters.article_type
    if (filters.game_slug) {
      const game = await db.game.findUnique({ where: { slug: filters.game_slug }, select: { id: true } })
      if (game) where.game_id = game.id
    }

    const orderBy = filters.sort === 'popular'
      ? { view_count: 'desc' as const }
      : filters.sort === 'updated'
      ? { updated_at: 'desc' as const }
      : { published_at: 'desc' as const }

    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 20)

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        select: {
          id: true, slug: true, title: true, article_type: true,
          cover_url: true, cover_alt: true, excerpt: true, read_time: true,
          view_count: true, published_at: true, seo_keywords: true,
          game: { select: { slug: true, name: true } },
          author: { select: { id: true, username: true, avatar: true, creator_level: true } },
        },
      }),
      db.article.count({ where }),
    ])

    // 处理文章数据
    const processedArticles = articles.map(article => ({
      ...article,
      seo_keywords: safeJsonParse(article.seo_keywords, []),
    }))

    const meta: PaginationMeta = {
      page: filters.page ?? 1, limit: filters.limit ?? 20, total,
      has_next: skip + articles.length < total,
      has_prev: (filters.page ?? 1) > 1,
    }

    const response: ApiResponse<{ articles: typeof processedArticles; meta: PaginationMeta }> = {
      success: true, data: { articles: processedArticles, meta }, meta,
    }

    await redis.set(cacheKey, JSON.stringify(response), { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/guides]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
