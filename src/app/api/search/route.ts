import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

const CACHE_TTL = 300

interface SearchHit {
  objectID: string
  type: 'game' | 'guide'
  slug: string
  title: string
  image_url: string
  excerpt?: string
  game_name?: string
  platform?: string[]
  genre?: string[]
}

/**
 * GET /api/search?q=query&type=games|guides|all&page=1
 * Database-based search with Redis caching.
 * Returns: ApiResponse<{ hits: SearchHit[]; nbHits: number; query: string }>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query = searchParams.get('q')?.trim()
  const type  = searchParams.get('type') ?? 'all'
  const page  = Number(searchParams.get('page') ?? 0)

  if (!query || query.length < 2) {
    return NextResponse.json({ success: false, error: 'Query too short', code: 'VALIDATION_ERROR' }, { status: 400 })
  }

  const cacheKey = `search:${type}:${query}:${page}`
  
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const hits: SearchHit[] = []
    
    if (type === 'games' || type === 'all') {
      const games = await db.game.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          cover_url: true,
          description: true,
          platforms: true,
          genres: true,
        },
        take: 10,
        skip: page * 10,
      })

      // Filter on client side for SQLite
      const filteredGames = games.filter(game => {
        const searchLower = query.toLowerCase()
        return game.name.toLowerCase().includes(searchLower) ||
               game.slug.toLowerCase().includes(searchLower) ||
               (game.description && game.description.toLowerCase().includes(searchLower))
      })

      filteredGames.forEach(game => {
        hits.push({
          objectID: `game-${game.id}`,
          type: 'game',
          slug: game.slug,
          title: game.name,
          image_url: game.cover_url,
          excerpt: game.description?.slice(0, 150) + '...',
          platform: game.platforms as string[],
          genre: game.genres as string[],
        })
      })
    }

    if (type === 'guides' || type === 'all') {
      const articles = await db.article.findMany({
        where: {
          status: 'published',
        },
        select: {
          id: true,
          slug: true,
          title: true,
          cover_url: true,
          excerpt: true,
          game: { select: { name: true } },
        },
        take: 10,
        skip: page * 10,
      })

      // Filter on client side for SQLite
      const filteredArticles = articles.filter(article => {
        const searchLower = query.toLowerCase()
        return article.title.toLowerCase().includes(searchLower) ||
               article.slug.toLowerCase().includes(searchLower) ||
               (article.excerpt && article.excerpt.toLowerCase().includes(searchLower))
      })

      filteredArticles.forEach(article => {
        hits.push({
          objectID: `guide-${article.id}`,
          type: 'guide',
          slug: article.slug,
          title: article.title,
          image_url: article.cover_url,
          excerpt: article.excerpt || undefined,
          game_name: article.game?.name,
        })
      })
    }

    const response: ApiResponse<{ hits: typeof hits; nbHits: number; query: string }> = {
      success: true,
      data: { hits, nbHits: hits.length, query },
    }

    await redis.set(cacheKey, response, { ex: CACHE_TTL })

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return NextResponse.json({ success: false, error: 'Search unavailable', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
