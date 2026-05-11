import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

function verifyInternalToken(req: NextRequest): boolean {
  return req.headers.get('authorization')?.replace('Bearer ', '') === process.env.INTERNAL_API_SECRET
}

/**
 * POST /api/internal/codes/import
 * Called by n8n Discord/Reddit listener when new codes are detected.
 * Body: { codes: CodePayload[] }
 * CodePayload: { code, game_slug, reward_desc, source, source_url?, expires_at? }
 */
export async function POST(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const { codes } = await req.json() as { codes: Record<string, unknown>[] }

    if (!Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ success: false, error: 'codes array required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    let created = 0
    const skipped: string[] = []

    for (const c of codes) {
      const game = await db.game.findUnique({ where: { slug: c.game_slug as string }, select: { id: true } })
      if (!game) { skipped.push(`unknown game: ${c.game_slug}`); continue }

      try {
        await db.gameCode.create({
          data: {
            code:        (c.code as string).trim().toUpperCase(),
            game_id:     game.id,
            reward_desc: c.reward_desc as string,
            status:      'active',
            source:      c.source as never,
            source_url:  c.source_url as string | undefined,
            expires_at:  c.expires_at ? new Date(c.expires_at as string) : undefined,
            verified_at: new Date(),
          },
        })
        created++
        // Bust codes cache for this game
        await redis.del(`api:codes:${c.game_slug}`)
      } catch {
        skipped.push(`duplicate: ${c.code}`)
      }
    }

    return NextResponse.json({ success: true, data: { created, skipped, total: codes.length } } satisfies ApiResponse<unknown>)
  } catch (err) {
    console.error('[POST /api/internal/codes/import]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
