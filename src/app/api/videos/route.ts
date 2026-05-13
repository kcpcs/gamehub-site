import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { searchGameVideos } from '@/lib/youtube'
import { searchTwitchStreams } from '@/lib/twitch'
import type { ApiResponse } from '@/types'

const CACHE_TTL = 300 // 5 minutes

interface VideoResponse {
  id: string
  video_id: string
  platform: string
  title: string
  description: string | null
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration: number | null
  view_count: string | null
  published_at: string | null
  video_type: string
  is_live: boolean
  is_featured: boolean
}

/**
 * GET /api/videos?game=slug
 * Returns videos for a specific game
 */
export async function GET(req: NextRequest) {
  const gameSlug = req.nextUrl.searchParams.get('game')
  const cacheKey = gameSlug ? `api:videos:${gameSlug}` : 'api:videos:all'

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let videos = []

    if (gameSlug) {
      const game = await db.game.findUnique({ where: { slug: gameSlug } })
      if (!game) {
        return NextResponse.json(
          { success: false, error: 'Game not found', code: 'NOT_FOUND' },
          { status: 404 }
        )
      }

      videos = await db.video.findMany({
        where: { game_id: game.id, is_active: true },
        orderBy: { published_at: 'desc' },
        take: 20,
      })

      // If no videos in database, try to fetch from YouTube/Twitch
      if (videos.length === 0) {
        const youtubeVideos = await searchGameVideos(game.name, 8)
        const twitchStreams = await searchTwitchStreams(game.name, 4)

        // Combine and save videos (this is demo mode, no actual DB saving)
        const allVideos = [...youtubeVideos, ...twitchStreams]
        
        videos = allVideos.map((video, index) => ({
          id: `video-${index}`,
          video_id: video.video_id,
          platform: video.platform,
          game_id: game.id,
          title: video.title,
          description: video.description || null,
          thumbnail_url: video.thumbnail_url,
          channel_name: video.channel_name,
          channel_url: video.channel_url,
          duration: video.duration || null,
          view_count: video.view_count || null,
          like_count: video.like_count || null,
          published_at: video.published_at || null,
          video_type: video.video_type as any,
          video_tags: [],
          is_live: video.is_live,
          is_featured: index < 2,
          is_active: true,
          ai_summary: null,
          ai_relevance_score: null,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      }
    } else {
      videos = await db.video.findMany({
        where: { is_active: true },
        orderBy: { published_at: 'desc' },
        take: 20,
      })
    }

    const transformedVideos: VideoResponse[] = videos.map(video => ({
      id: video.id,
      video_id: video.video_id,
      platform: video.platform,
      title: video.title,
      description: video.description,
      thumbnail_url: video.thumbnail_url,
      channel_name: video.channel_name,
      channel_url: video.channel_url,
      duration: video.duration,
      view_count: video.view_count?.toString() || null,
      published_at: video.published_at?.toISOString() || null,
      video_type: video.video_type,
      is_live: video.is_live,
      is_featured: video.is_featured,
    }))

    const response: ApiResponse<VideoResponse[]> = { success: true, data: transformedVideos }
    await redis.set(cacheKey, response, { ex: CACHE_TTL })
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/videos]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}