import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse, GameCard, GameFilters, PaginationMeta } from '@/types'

const CACHE_TTL = 300 // 5 minutes

/**
 * GET /api/games
 * Query params: platform, genre, tag, sort, page, limit
 * Returns: ApiResponse<{ games: GameCard[]; meta: PaginationMeta }>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filters: GameFilters = {
    platform:  searchParams.get('platform') as GameFilters['platform'] ?? undefined,
    genre:     searchParams.get('genre') as GameFilters['genre'] ?? undefined,
    tag:       searchParams.get('tag') ?? undefined,
    sort:      (searchParams.get('sort') as GameFilters['sort']) ?? 'popular',
    page:      Number(searchParams.get('page') ?? 1),
    limit:     Math.min(Number(searchParams.get('limit') ?? 24), 48),
  }

  const cacheKey = `api:games:${JSON.stringify(filters)}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached as ApiResponse<unknown>)
    }

    const where: Record<string, unknown> = {}
    // SQLite doesn't support JSON has operations, we'll filter on client side
    // if (filters.platform) where.platforms = { has: filters.platform }
    // if (filters.genre)    where.genres    = { has: filters.genre }
    // if (filters.tag)      where.tags      = { has: filters.tag }

    const sortField = {
      popular:     'guide_count',
      latest:      'release_date',
      rating:      'score_opencritic',
      guide_count: 'guide_count',
    }[filters.sort ?? 'popular'] ?? 'guide_count'

    const orderBy = { [sortField]: 'desc' }

    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 24)

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        orderBy,
        skip,
        take: filters.limit,
        select: {
          id: true, slug: true, name: true,
          cover_url: true, platforms: true, genres: true,
          score_opencritic: true, score_steam_pct: true, score_community: true, score_review_count: true,
          guide_count: true, code_count: true,
        },
      }),
      db.game.count({ where }),
    ])

    // Convert JSON fields to arrays and filter on client side for SQLite
    let processedGames = games.map(game => ({
      ...game,
      platforms: game.platforms as string[],
      genres: game.genres as string[],
      scores: {
        opencritic: game.score_opencritic || 0,
        community: game.score_community || 0,
        review_count: game.score_review_count || 0
      }
    }))

    // Apply client-side filtering
    if (filters.platform) {
      const platform = filters.platform as string
      processedGames = processedGames.filter(g => g.platforms.includes(platform))
    }
    if (filters.genre) {
      const genre = filters.genre as string
      processedGames = processedGames.filter(g => g.genres.includes(genre))
    }

    const meta: PaginationMeta = {
      page:     filters.page ?? 1,
      limit:    filters.limit ?? 24,
      total: processedGames.length,
      has_next: skip + processedGames.length < total,
      has_prev: (filters.page ?? 1) > 1,
    }

    const response: ApiResponse<{ games: unknown[]; meta: PaginationMeta }> = {
      success: true,
      data: { games: processedGames, meta },
      meta,
    }

    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/games]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
