import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { validateBody, codeSubmissionSchema } from '@/lib/validations'
import type { ApiResponse, CodesPageData } from '@/types'

const CACHE_TTL = 120 // 2 minutes — codes update frequently

/**
 * GET /api/codes/[game]
 * Returns: ApiResponse<CodesPageData>
 * Active codes first, then expired. Sorted by created_at desc.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ game: string }> }
) {
  const { game: gameSlug } = await params
  const cacheKey = `api:codes:${gameSlug}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    const game = await db.game.findUnique({
      where: { slug: gameSlug },
      select: { id: true, name: true, cover_url: true },
    })

    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const [active, expired] = await Promise.all([
      db.gameCode.findMany({
        where: { game_id: game.id, status: 'active' },
        orderBy: { created_at: 'desc' },
      }),
      db.gameCode.findMany({
        where: { game_id: game.id, status: 'expired' },
        orderBy: { created_at: 'desc' },
        take: 20,
      }),
    ])

    const data: CodesPageData = {
      game_slug:    gameSlug,
      game_name:    game.name,
      game_cover:   game.cover_url,
      active_codes: active as never,
      expired_codes: expired as never,
      last_updated: new Date().toISOString(),
    }

    const response: ApiResponse<CodesPageData> = { success: true, data }
    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/codes/[game]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

/**
 * POST /api/codes/[game]
 * Body: CodeSubmission
 * Authenticated users submit new codes. Status = 'unverified' until bot validates.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ game: string }> }
) {
  const { game: gameSlug } = await params

  try {
    const result = await validateBody(req, codeSubmissionSchema)
    if (!result.success) return result.error
    const body = result.data

    const game = await db.game.findUnique({ where: { slug: gameSlug }, select: { id: true } })
    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const created = await db.gameCode.create({
      data: {
        code:        body.code,
        game_id:     game.id,
        reward_desc: body.reward_desc,
        status:      'unverified',
        source:      'user',
        source_url:  body.source_url || null,
        verified_at: new Date(),
      },
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Code already exists', code: 'DUPLICATE' }, { status: 409 })
    }
    console.error('[POST /api/codes/[game]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
