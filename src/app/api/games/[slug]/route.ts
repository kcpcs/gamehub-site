import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import type { ApiResponse } from '@/types'

const CACHE_TTL = 600 // 10 minutes

/**
 * 【窗口A优化】高效解析JSON字段
 * Claude-3.5-Sonnet: 优化JSON解析性能，减少重复try-catch
 */
function parseJsonField(field: any): string[] {
  if (Array.isArray(field)) return field
  if (typeof field !== 'string') return []
  
  try {
    const parsed = JSON.parse(field)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * 【窗口A优化】游戏数据转换器
 * Claude-3.5-Sonnet: 简化数据转换逻辑，提升性能
 */
function transformGameData(game: any) {
  return {
    id: game.id,
    slug: game.slug,
    name: game.name,
    cover: { url: game.cover_url },
    screenshots: parseJsonField(game.screenshots),
    platforms: parseJsonField(game.platforms),
    genres: parseJsonField(game.genres),
    tags: parseJsonField(game.tags),
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
}

/**
 * GET /api/games/[slug] - 【窗口A优化版本】
 * Claude-3.5-Sonnet: 优化缓存逻辑和数据转换性能
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cacheKey = `api:game:${slug}`

  try {
    // 【窗口A优化】优化缓存检查
    const cached = await redis.get(cacheKey)
    if (cached) {
      try {
        const parsedCached = typeof cached === 'string' ? JSON.parse(cached) : cached
        return NextResponse.json(parsedCached as ApiResponse<unknown>)
      } catch (parseError) {
        // 缓存数据损坏，删除缓存继续处理
        await redis.del(cacheKey)
      }
    }

    // 【窗口A优化】数据库查询（保持不变，因为已经是最优化的单表查询）
    const game = await db.game.findUnique({ where: { slug } })

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // 【窗口A优化】使用优化后的数据转换器
    const transformedGame = transformGameData(game)

    const response: ApiResponse<typeof transformedGame> = { success: true, data: transformedGame }
    
    // 【窗口A优化】异步缓存设置，不阻塞响应
    redis.set(cacheKey, JSON.stringify(response), { ex: CACHE_TTL }).catch((err: unknown) => {
      console.error('[Redis Cache Error]', err)
    })
    
    return NextResponse.json(response)
  } catch (err: unknown) {
    console.error('[GET /api/games/[slug]]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
