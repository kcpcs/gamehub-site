import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

function verifyInternalToken(req: NextRequest): boolean {
  return req.headers.get('authorization')?.replace('Bearer ', '') === process.env.INTERNAL_API_SECRET
}

/**
 * POST /api/internal/patch-notes
 * Called by n8n RSS watcher when a patch note is published.
 * Creates a patch_notes article and updates the game's last_patch_at.
 *
 * Body: {
 *   game_slug, patch_version, title, content (markdown),
 *   source_url, published_at
 * }
 */
export async function POST(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const game = await db.game.findUnique({ where: { slug: body.game_slug }, select: { id: true, name: true } })
    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const slug = `${body.game_slug}-patch-${body.patch_version?.replace(/\./g, '-')}-notes`

    const [article] = await Promise.all([
      db.article.create({
        data: {
          slug,
          title:           body.title,
          article_type:    'patch_notes',
          status:          'published',
          source_type:     'aggregated',
          source_urls:     JSON.stringify([body.source_url]),
          game_id:         game.id,
          cover_url:       body.cover_url ?? '/images/patch-notes-default.webp',
          cover_alt:       `${game.name} Patch ${body.patch_version} Notes`,
          content:         body.content,
          excerpt:         body.excerpt ?? body.content.slice(0, 200),
          read_time:       Math.ceil(body.content.split(' ').length / 200),
          seo_title:       `${game.name} Patch ${body.patch_version} Notes`,
          seo_description: `All changes in ${game.name} patch ${body.patch_version}`,
          seo_keywords:    JSON.stringify([game.name, `patch ${body.patch_version}`, 'patch notes']),
          published_at:    body.published_at ? new Date(body.published_at) : new Date(),
        },
      }),
      db.game.update({
        where: { id: game.id },
        data:  { last_patch_at: new Date() },
      }),
    ])

    await redis.del(`api:game:${body.game_slug}`)

    return NextResponse.json({ success: true, data: { slug: article.slug } } satisfies ApiResponse<unknown>, { status: 201 })
  } catch (err) {
    console.error('[POST /api/internal/patch-notes]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
