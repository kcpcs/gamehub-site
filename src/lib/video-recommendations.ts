// AI-Powered Video Recommendation System
// Uses view history and preferences to recommend relevant videos

import { db } from './db'
import { redis } from './redis'

const PREFERENCE_CACHE_TTL = 300

interface VideoRecommendation {
  id: string
  video_id: string
  platform: string
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration?: number
  view_count?: bigint
  published_at?: Date
  video_type: string
  is_live: boolean
  relevance_score: number
  recommendation_reason: string
}

interface UserPreferences {
  preferred_games: string[]
  preferred_video_types: string[]
  preferred_platforms: string[]
}

/**
 * Get user preferences based on their view history and favorites
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const cacheKey = `user:prefs:video:${userId}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached
      return parsed as UserPreferences
    }

    const viewHistory = await db.videoViewHistory.findMany({
      where: { user_id: userId },
      include: { video: true },
      orderBy: { watched_at: 'desc' },
      take: 50
    })

    const favorites = await db.videoFavorite.findMany({
      where: { user_id: userId },
      include: { video: true },
      take: 20
    })

    const preferredGames = new Set<string>()
    const preferredTypes = new Set<string>()
    const preferredPlatforms = new Set<string>()

    viewHistory.forEach(history => {
      if (history.video.game_id) {
        preferredGames.add(history.video.game_id)
      }
      preferredTypes.add(history.video.video_type)
      preferredPlatforms.add(history.video.platform)
    })

    favorites.forEach(fav => {
      if (fav.video.game_id) {
        preferredGames.add(fav.video.game_id)
      }
      preferredTypes.add(fav.video.video_type)
      preferredPlatforms.add(fav.video.platform)
    })

    const preferences: UserPreferences = {
      preferred_games: Array.from(preferredGames),
      preferred_video_types: Array.from(preferredTypes),
      preferred_platforms: Array.from(preferredPlatforms)
    }

    await redis.set(cacheKey, JSON.stringify(preferences), { ex: PREFERENCE_CACHE_TTL })

    return preferences
  } catch (error) {
    console.error('[getUserPreferences]', error)
    return {
      preferred_games: [],
      preferred_video_types: [],
      preferred_platforms: []
    }
  }
}

/**
 * Calculate relevance score for a video based on user preferences
 */
function calculateRelevanceScore(
  video: { game_id?: string | null; video_type: string; platform: string; view_count?: bigint | null },
  preferences: UserPreferences
): number {
  let score = 0

  if (video.game_id && preferences.preferred_games.includes(video.game_id)) {
    score += 50
  }

  if (preferences.preferred_video_types.includes(video.video_type)) {
    score += 30
  }

  if (preferences.preferred_platforms.includes(video.platform)) {
    score += 20
  }

  if (video.view_count) {
    const views = Number(video.view_count)
    if (views > 1000000) score += 25
    else if (views > 100000) score += 15
    else if (views > 10000) score += 10
    else score += 5
  }

  return Math.min(score, 100)
}

/**
 * Get AI-powered video recommendations for a user
 */
export async function getVideoRecommendations(
  userId: string,
  limit: number = 10,
  excludeVideoIds: string[] = []
): Promise<VideoRecommendation[]> {
  try {
    const preferences = await getUserPreferences(userId)

    if (preferences.preferred_games.length === 0) {
      return []
    }

    const recentVideoIds = excludeVideoIds.length > 0
      ? excludeVideoIds
      : (await db.videoViewHistory.findMany({
          where: { user_id: userId },
          select: { video_id: true },
          take: 20
        })).map(v => v.video_id)

    const candidateVideos = await db.video.findMany({
      where: {
        game_id: { in: preferences.preferred_games },
        is_active: true,
        NOT: {
          OR: [
            { id: { in: recentVideoIds } },
            { video_id: { in: recentVideoIds } }
          ]
        }
      },
      take: 50
    })

    const scoredVideos = candidateVideos.map(video => {
      const score = calculateRelevanceScore(video, preferences)
      let reason = ''

      if (video.game_id && preferences.preferred_games.includes(video.game_id)) {
        reason = 'Based on your interest in this game'
      } else if (preferences.preferred_video_types.includes(video.video_type)) {
        reason = `You often watch ${video.video_type.toLowerCase()} videos`
      } else {
        reason = 'Popular in your preferred category'
      }

      return {
        id: video.id,
        video_id: video.video_id,
        platform: video.platform,
        title: video.title,
        description: video.description || '',
        thumbnail_url: video.thumbnail_url,
        channel_name: video.channel_name,
        channel_url: video.channel_url,
        duration: video.duration || undefined,
        view_count: video.view_count || undefined,
        published_at: video.published_at || undefined,
        video_type: video.video_type,
        is_live: video.is_live,
        game_id: video.game_id || undefined,
        relevance_score: score,
        recommendation_reason: reason
      }
    })

    scoredVideos.sort((a, b) => b.relevance_score - a.relevance_score)

    return scoredVideos.slice(0, limit)
  } catch (error) {
    console.error('[getVideoRecommendations]', error)
    return []
  }
}

/**
 * Get trending videos based on view count and recency
 */
export async function getTrendingVideos(limit: number = 10): Promise<VideoRecommendation[]> {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const trendingVideos = await db.video.findMany({
      where: {
        is_active: true,
        is_live: false,
        OR: [
          { published_at: { gte: oneWeekAgo } },
          { view_count: { gte: BigInt(100000) } }
        ]
      },
      orderBy: [
        { view_count: 'desc' },
        { published_at: 'desc' }
      ],
      take: limit
    })

    return trendingVideos.map(video => ({
      id: video.id,
      video_id: video.video_id,
      platform: video.platform,
      title: video.title,
      description: video.description || '',
      thumbnail_url: video.thumbnail_url,
      channel_name: video.channel_name,
      channel_url: video.channel_url,
      duration: video.duration || undefined,
      view_count: video.view_count || undefined,
      published_at: video.published_at || undefined,
      video_type: video.video_type,
      is_live: video.is_live,
      relevance_score: 100,
      recommendation_reason: 'Trending now'
    }))
  } catch (error) {
    console.error('[getTrendingVideos]', error)
    return []
  }
}

/**
 * Get similar videos based on a given video
 */
export async function getSimilarVideos(
  videoId: string,
  limit: number = 6
): Promise<VideoRecommendation[]> {
  try {
    const targetVideo = await db.video.findFirst({
      where: {
        OR: [
          { id: videoId },
          { video_id: videoId }
        ]
      }
    })

    if (!targetVideo) {
      return []
    }

    const similarVideos = await db.video.findMany({
      where: {
        is_active: true,
        OR: [
          { game_id: targetVideo.game_id },
          { video_type: targetVideo.video_type }
        ],
        NOT: {
          OR: [
            { id: targetVideo.id },
            { video_id: targetVideo.video_id }
          ]
        }
      },
      orderBy: { view_count: 'desc' },
      take: limit
    })

    return similarVideos.map(video => ({
      id: video.id,
      video_id: video.video_id,
      platform: video.platform,
      title: video.title,
      description: video.description || '',
      thumbnail_url: video.thumbnail_url,
      channel_name: video.channel_name,
      channel_url: video.channel_url,
      duration: video.duration || undefined,
      view_count: video.view_count || undefined,
      published_at: video.published_at || undefined,
      video_type: video.video_type,
      is_live: video.is_live,
      relevance_score: 80,
      recommendation_reason: `Similar to ${targetVideo.title}`
    }))
  } catch (error) {
    console.error('[getSimilarVideos]', error)
    return []
  }
}

/**
 * Record video view for recommendation learning
 */
export async function recordVideoView(
  userId: string,
  videoId: string
): Promise<void> {
  try {
    await db.videoViewHistory.create({
      data: {
        user_id: userId,
        video_id: videoId
      }
    })
  } catch (error) {
    console.error('[recordVideoView]', error)
  }
}
