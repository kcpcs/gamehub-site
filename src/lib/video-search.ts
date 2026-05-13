// Enhanced Video Search - Combines all platforms
// Supports multi-platform search with advanced filtering

import { searchGameVideos } from './youtube'
import { searchTwitchStreams } from './twitch'
import { searchTikTokVideos } from './tiktok'

interface VideoSearchResult {
  id: string
  video_id: string
  platform: string
  title: string
  description?: string | null
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration?: number | null
  view_count?: string | null
  published_at?: string | null
  video_type: string
  is_live: boolean
  score: number
}

interface SearchFilters {
  query: string
  platforms?: ('YOUTUBE' | 'TWITCH' | 'TIKTOK' | 'YOUTUBE_SHORTS')[]
  videoTypes?: ('GAMEPLAY' | 'TUTORIAL' | 'REVIEW' | 'WALKTHROUGH' | 'NEWS' | 'TRAILER' | 'LIVE')[]
  sortBy?: 'relevance' | 'date' | 'views'
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all'
  duration?: 'short' | 'medium' | 'long' | 'all'
  minViews?: number
}

interface SearchOptions {
  maxResults?: number
  filters?: SearchFilters
}

/**
 * Calculate relevance score based on search query and video metadata
 */
function calculateRelevanceScore(query: string, title: string, description: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/)
  const titleLower = title.toLowerCase()
  const descLower = description.toLowerCase()
  
  let score = 0
  
  queryTerms.forEach(term => {
    if (titleLower.includes(term)) {
      score += 10
      if (titleLower.startsWith(term)) score += 5
    }
    if (descLower.includes(term)) {
      score += 3
    }
  })
  
  return score
}

/**
 * Normalize video data to standard format
 */
function normalizeVideoData(video: any, platform: string, query: string): VideoSearchResult {
  const viewCount = video.view_count 
    ? typeof video.view_count === 'bigint'
      ? video.view_count.toString()
      : video.view_count
    : '0'

  return {
    id: `${platform}_${video.video_id}`,
    video_id: video.video_id,
    platform: platform,
    title: video.title,
    description: video.description || null,
    thumbnail_url: video.thumbnail_url,
    channel_name: video.channel_name,
    channel_url: video.channel_url,
    duration: video.duration || null,
    view_count: viewCount,
    published_at: video.published_at 
      ? (video.published_at instanceof Date ? video.published_at.toISOString() : video.published_at)
      : null,
    video_type: video.video_type,
    is_live: video.is_live,
    score: calculateRelevanceScore(query, video.title, video.description || '')
  }
}

/**
 * Check if video matches filters
 */
function matchesFilters(video: VideoSearchResult, filters: SearchFilters): boolean {
  if (filters.platforms && filters.platforms.length > 0) {
    if (!filters.platforms.includes(video.platform as any)) {
      return false
    }
  }

  if (filters.videoTypes && filters.videoTypes.length > 0) {
    if (!filters.videoTypes.includes(video.video_type as any)) {
      return false
    }
  }

  if (filters.minViews && parseInt(video.view_count || '0') < filters.minViews) {
    return false
  }

  if (filters.duration && filters.duration !== 'all') {
    const duration = video.duration || 0
    if (filters.duration === 'short' && duration > 60) return false
    if (filters.duration === 'medium' && (duration < 60 || duration > 600)) return false
    if (filters.duration === 'long' && duration < 600) return false
  }

  if (filters.timeRange && filters.timeRange !== 'all' && video.published_at) {
    const publishedAt = new Date(video.published_at)
    const now = new Date()
    const daysDiff = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)
    
    if (filters.timeRange === 'day' && daysDiff > 1) return false
    if (filters.timeRange === 'week' && daysDiff > 7) return false
    if (filters.timeRange === 'month' && daysDiff > 30) return false
    if (filters.timeRange === 'year' && daysDiff > 365) return false
  }

  return true
}

/**
 * Enhanced video search across all platforms
 */
export async function searchVideos(
  gameName: string,
  options: SearchOptions = {}
): Promise<VideoSearchResult[]> {
  const { maxResults = 20, filters } = options
  const query = filters?.query || gameName

  try {
    const [youtubeVideos, twitchVideos, tiktokVideos] = await Promise.all([
      searchGameVideos(gameName, 15),
      searchTwitchStreams(gameName, 10),
      searchTikTokVideos(gameName, 10)
    ])

    let allVideos: VideoSearchResult[] = [
      ...youtubeVideos.map(v => normalizeVideoData(v, v.platform === 'YOUTUBE_SHORTS' ? 'YOUTUBE_SHORTS' : 'YOUTUBE', query)),
      ...twitchVideos.map(v => normalizeVideoData(v, 'TWITCH', query)),
      ...tiktokVideos.map(v => normalizeVideoData(v, 'TIKTOK', query))
    ]

    if (filters) {
      allVideos = allVideos.filter(video => matchesFilters(video, filters))
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'date':
          allVideos.sort((a, b) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
            return dateB - dateA
          })
          break
        case 'views':
          allVideos.sort((a, b) => {
            const viewsA = parseInt(a.view_count || '0')
            const viewsB = parseInt(b.view_count || '0')
            return viewsB - viewsA
          })
          break
        case 'relevance':
        default:
          allVideos.sort((a, b) => b.score - a.score)
          break
      }
    } else {
      allVideos.sort((a, b) => b.score - a.score)
    }

    return allVideos.slice(0, maxResults)
  } catch (error) {
    console.error('[searchVideos]', error)
    return []
  }
}

/**
 * Get video search suggestions based on partial query
 */
export function getSearchSuggestions(query: string): string[] {
  const suggestions = [
    'gameplay',
    'walkthrough',
    'tutorial',
    'review',
    'tips and tricks',
    'beginner guide',
    'advanced tips',
    'secret ending',
    'boss fight',
    'all endings'
  ]

  if (!query || query.length < 2) return []

  const lowerQuery = query.toLowerCase()
  return suggestions
    .filter(s => s.includes(lowerQuery))
    .slice(0, 5)
}

/**
 * Get trending search queries for games
 */
export function getTrendingSearchQueries(gameName: string): string[] {
  const baseQueries = [
    `${gameName} gameplay`,
    `${gameName} walkthrough`,
    `${gameName} review`,
    `${gameName} tips`,
    `${gameName} guide`
  ]

  return baseQueries
}
