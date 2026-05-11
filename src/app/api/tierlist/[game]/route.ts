import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse, TierList, TierCategory } from '@/types'
import { getDefaultTierList } from '@/data/tierListData'

const CACHE_TTL = 300

/**
 * GET /api/tierlist/[game]?category=character
 * Returns: ApiResponse<TierList>
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ game: string }> }
) {
  const { game: gameSlug } = await params
  const category = (req.nextUrl.searchParams.get('category') ?? 'character') as TierCategory
  const cacheKey = `api:tierlist:${gameSlug}:${category}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    const game = await db.game.findUnique({ where: { slug: gameSlug }, select: { id: true, name: true } })
    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const tierList = await db.tierList.findUnique({
      where: { game_id_category: { game_id: game.id, category } },
      include: { entries: { orderBy: { avg_score: 'desc' } } },
    })

    if (!tierList) {
      const defaultTierList = getDefaultTierList(gameSlug)
      const response: ApiResponse<typeof defaultTierList> = { success: true, data: defaultTierList }
      await redis.set(cacheKey, response, { ex: CACHE_TTL })
      return NextResponse.json(response)
    }

    const response: ApiResponse<typeof tierList> = { success: true, data: tierList }
    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/tierlist/[game]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
