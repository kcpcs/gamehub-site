import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse, Game } from '@/types'

const CACHE_TTL = 600 // 10 minutes

/**
 * GET /api/games/[slug]
 * Returns: ApiResponse<Game>  (full game object with all fields)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cacheKey = `api:game:${slug}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    const game = await db.game.findUnique({ where: { slug } })

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Transform database fields to match frontend Game type
    const transformedGame = {
      ...game,
      scores: {
        opencritic: game.score_opencritic || 0,
        community: game.score_community || 0,
        review_count: game.score_review_count || 0
      }
    }

    const response: ApiResponse<typeof transformedGame> = { success: true, data: transformedGame }
    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/games/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
