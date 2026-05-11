import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'
import { redis } from '@/lib/redis'
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
 * GET /api/search?q=query&type=games|guides|codes|all&page=1
 * Algolia-powered full-text search with Redis caching.
 */
export async function GET(req: NextRequest) {
  if (!client) {
    return NextResponse.json({ success: false, error: 'Search not configured', code: 'SERVICE_UNAVAILABLE' }, { status: 503 })
  }

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

    const response: ApiResponse<{ hits: typeof hits; nbHits: number; query: string }> = {
      success: true,
      data: { hits, nbHits, query },
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
