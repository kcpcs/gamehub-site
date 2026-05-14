import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'
import { redis } from '@/lib/redis'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

const CACHE_TTL = 300

const client = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY
  ? algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
  : null

interface SearchHit {
  objectID: string
  type: 'game' | 'guide' | 'code'
  slug: string
  title: string
  image_url: string
  excerpt?: string
  game_name?: string
  platform?: string[]
  genre?: string[]
}

/**
 * Local fallback search using database when Algolia is not configured
 */
async function localSearch(query: string, type: string): Promise<{ hits: SearchHit[], nbHits: number }> {
  const hits: SearchHit[] = []
  const q = query.toLowerCase()
  
  // Simple fallback: just search games for now
  try {
    if (type === 'games' || type === 'all') {
      const games = await db.game.findMany({
        take: 5,
      })
      
      // Simple filtering in memory
      const filteredGames = games.filter(game => 
        game.name?.toLowerCase().includes(q) || 
        game.description?.toLowerCase().includes(q)
      )
      
      filteredGames.forEach(game => {
        hits.push({
          objectID: `game-${game.id}`,
          type: 'game',
          slug: game.slug,
          title: game.name,
          image_url: game.cover_url || '',
          excerpt: game.description?.slice(0, 150) + '...',
          platform: (typeof game.platforms === 'string' ? JSON.parse(game.platforms) : game.platforms) as string[],
          genre: (typeof game.genres === 'string' ? JSON.parse(game.genres) : game.genres) as string[],
        })
      })
    }
  } catch (e) {
    console.error('[localSearch] Games search failed', e)
  }
  
  return { hits, nbHits: hits.length }
}

/**
 * GET /api/search?q=query&type=games|guides|codes|all&page=1
 * Algolia-powered full-text search with Redis caching and local fallback.
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

    let result: { hits: SearchHit[], nbHits: number }

    if (client) {
      // Use Algolia search if available
      const hits: SearchHit[] = []
      let nbHits = 0

      const searchParamsAlgolia = {
        query,
        hitsPerPage: 10,
        page,
      }

      if (type === 'games' || type === 'all') {
        const { hits: gameHits, nbHits: gameNbHits } = await client.searchSingleIndex({
          indexName: 'gamehub_games',
          searchParams: searchParamsAlgolia,
        })
        nbHits += gameNbHits ?? 0
        gameHits.forEach((hit: any) => {
          hits.push({
            objectID: hit.objectID,
            type: 'game',
            slug: hit.slug,
            title: hit.name,
            image_url: hit.cover_url || '',
            excerpt: hit.description?.slice(0, 150) + '...',
            platform: hit.platforms,
            genre: hit.genres,
          })
        })
      }

      if (type === 'guides' || type === 'all') {
        const { hits: articleHits, nbHits: articleNbHits } = await client.searchSingleIndex({
          indexName: 'gamehub_articles',
          searchParams: searchParamsAlgolia,
        })
        nbHits += articleNbHits ?? 0
        articleHits.forEach((hit: any) => {
          hits.push({
            objectID: hit.objectID,
            type: 'guide',
            slug: hit.slug,
            title: hit.title,
            image_url: hit.cover_url || '',
            excerpt: hit.excerpt,
            game_name: hit.game_name,
          })
        })
      }

      if (type === 'codes' || type === 'all') {
        const { hits: codeHits, nbHits: codeNbHits } = await client.searchSingleIndex({
          indexName: 'gamehub_codes',
          searchParams: searchParamsAlgolia,
        })
        nbHits += codeNbHits ?? 0
        codeHits.forEach((hit: any) => {
          hits.push({
            objectID: hit.objectID,
            type: 'code',
            slug: hit.game_slug || hit.code,
            title: hit.code,
            image_url: '',
            excerpt: hit.reward_desc,
            game_name: hit.game_name,
          })
        })
      }

      result = { hits, nbHits }
    } else {
      // Fallback to local database search
      console.log('[GET /api/search] Using local fallback search')
      result = await localSearch(query, type)
    }

    const response: ApiResponse<{ hits: typeof result.hits; nbHits: number; query: string }> = {
      success: true,
      data: { hits: result.hits, nbHits: result.nbHits, query },
    }

    await redis.set(cacheKey, response, { ex: CACHE_TTL })

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('[GET /api/search]', err)
    // Fallback to local search on error
    try {
      console.log('[GET /api/search] Falling back to local search due to error')
      const result = await localSearch(query, type)
      const response: ApiResponse<{ hits: typeof result.hits; nbHits: number; query: string }> = {
        success: true,
        data: { hits: result.hits, nbHits: result.nbHits, query },
      }
      return NextResponse.json(response)
    } catch (fallbackErr) {
      console.error('[GET /api/search] Fallback also failed', fallbackErr)
      return NextResponse.json({ success: false, error: 'Search unavailable', code: 'SERVER_ERROR' }, { status: 500 })
    }
  }
}
