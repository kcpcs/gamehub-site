import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

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
    if (cached) {
      const parsedCached = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(parsedCached as ApiResponse<unknown>)
    }

    const game = await db.game.findUnique({ where: { slug } })

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // 正确处理 JSON 字段
    let platforms: string[] = []
    let genres: string[] = []
    let tags: string[] = []
    let screenshots: string[] = []
    
    try {
      platforms = typeof game.platforms === 'string' 
        ? JSON.parse(game.platforms) 
        : Array.isArray(game.platforms) 
          ? game.platforms 
          : []
    } catch {
      platforms = []
    }
    
    try {
      genres = typeof game.genres === 'string' 
        ? JSON.parse(game.genres) 
        : Array.isArray(game.genres) 
          ? game.genres 
          : []
    } catch {
      genres = []
    }
    
    try {
      tags = typeof game.tags === 'string' 
        ? JSON.parse(game.tags) 
        : Array.isArray(game.tags) 
          ? game.tags 
          : []
    } catch {
      tags = []
    }
    
    try {
      screenshots = typeof game.screenshots === 'string' 
        ? JSON.parse(game.screenshots) 
        : Array.isArray(game.screenshots) 
          ? game.screenshots 
          : []
    } catch {
      screenshots = []
    }

    // Transform database fields to match frontend Game type
    const transformedGame = {
      id: game.id,
      slug: game.slug,
      name: game.name,
      cover: { url: game.cover_url },
      screenshots: screenshots,
      platforms: platforms,
      genres: genres,
      tags: tags,
      developer: game.developer,
      publisher: game.publisher,
      release_date: game.release_date?.toISOString() || null,
      description: game.description,
      scores: {
        opencritic: game.score_opencritic || 0,
        steam_positive_pct: game.score_steam_pct || 0,
        community: game.score_community || 0,
        review_count: game.score_review_count || 0
      },
      guide_count: game.guide_count,
      code_count: game.code_count,
      video_count: game.video_count,
      has_tier_list: game.has_tier_list,
      last_patch_at: game.last_patch_at?.toISOString() || null,
      created_at: game.created_at?.toISOString() || new Date().toISOString(),
      updated_at: game.updated_at?.toISOString() || new Date().toISOString()
    }

    const response: ApiResponse<typeof transformedGame> = { success: true, data: transformedGame }
    await redis.set(cacheKey, JSON.stringify(response), { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/games/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
