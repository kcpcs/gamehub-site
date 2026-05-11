import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

/** Verify internal API secret (n8n calls only) */
function verifyInternalToken(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const secretHeader = req.headers.get('INTERNAL_API_SECRET')
  return token === process.env.INTERNAL_API_SECRET || secretHeader === process.env.INTERNAL_API_SECRET
}

/**
 * POST /api/internal/articles
 * Called by n8n after Claude generates an article.
 * Creates a draft article for human review.
 *
 * Body: {
 *   slug, title, article_type, game_slug?,
 *   cover_url, cover_alt, cover_credit?,
 *   content, excerpt, read_time,
 *   seo_title, seo_description, seo_keywords,
 *   source_urls, affiliate_links?,
 *   quality_score?
 * }
 */
export async function POST(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const required = ['slug', 'title', 'article_type', 'cover_url', 'cover_alt', 'content', 'excerpt', 'seo_title', 'seo_description']
    const missing = required.filter(k => !body[k])
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missing.join(', ')}`, code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    let gameId: string | undefined
    if (body.game_slug) {
      const game = await db.game.findUnique({ where: { slug: body.game_slug }, select: { id: true } })
      gameId = game?.id
    }

    const article = await db.article.create({
      data: {
        slug:            body.slug,
        title:           body.title,
        article_type:    body.article_type,
        status:          'draft',
        source_type:     'ai',
        source_urls:     body.source_urls ?? [],
        game_id:         gameId,
        cover_url:       body.cover_url,
        cover_alt:       body.cover_alt,
        cover_credit:    body.cover_credit,
        content:         body.content,
        excerpt:         body.excerpt,
        read_time:       body.read_time ?? 5,
        seo_title:       body.seo_title,
        seo_description: body.seo_description,
        seo_keywords:    body.seo_keywords ?? [],
        affiliate_links: body.affiliate_links ?? [],
        quality_score:   body.quality_score,
      },
    })

    return NextResponse.json({ success: true, data: { id: article.id, slug: article.slug } } satisfies ApiResponse<unknown>, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists', code: 'DUPLICATE' }, { status: 409 })
    }
    console.error('[POST /api/internal/articles]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

/**
 * PATCH /api/internal/articles
 * Updates an existing article by slug (used when n8n re-runs an article update).
 * Body: { slug: string; [fields to update] }
 */
export async function PATCH(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const { slug, ...updates } = await req.json()
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const article = await db.article.update({ where: { slug }, data: updates })

    // Bust cache
    await redis.del(`api:guide:${slug}`)

    return NextResponse.json({ success: true, data: { id: article.id } } satisfies ApiResponse<unknown>)
  } catch (err) {
    console.error('[PATCH /api/internal/articles]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
