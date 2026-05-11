import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

const CACHE_TTL = 600

/**
 * GET /api/guides/[slug]
 * Returns: ApiResponse<Article>  — full article with content, SEO, affiliate links
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cacheKey = `api:guide:${slug}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    const article = await db.article.findUnique({
      where: { slug, status: 'published' },
      include: {
        game: { select: { id: true, slug: true, name: true, cover_url: true, platforms: true } },
        author: { select: { id: true, username: true, avatar: true, creator_level: true } },
      },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Increment view count (fire-and-forget)
    db.article.update({ where: { id: article.id }, data: { view_count: { increment: 1 } } }).catch(() => {})

    const response: ApiResponse<typeof article> = { success: true, data: article }
    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/guides/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
