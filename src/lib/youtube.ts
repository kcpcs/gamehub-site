// YouTube Data API Integration
// Low-risk approach: only use official APIs, no video downloading

interface YouTubeSearchResult {
  kind: string
  etag: string
  items: YouTubeVideoItem[]
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

interface YouTubeVideoItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId?: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: { url: string; width?: number; height?: number }
      medium?: { url: string; width?: number; height?: number }
      high?: { url: string; width?: number; height?: number }
      standard?: { url: string; width?: number; height?: number }
      maxres?: { url: string; width?: number; height?: number }
    }
    channelTitle: string
    tags?: string[]
    categoryId?: string
    liveBroadcastContent?: string
  }
  contentDetails?: {
    duration?: string
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    favoriteCount?: string
    commentCount?: string
  }
}

interface YouTubeVideo {
  video_id: string
  platform: 'YOUTUBE' | 'YOUTUBE_SHORTS'
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration?: number
  view_count?: bigint
  like_count?: bigint
  published_at?: Date
  video_type: 'GAMEPLAY' | 'TUTORIAL' | 'REVIEW' | 'WALKTHROUGH' | 'NEWS' | 'TRAILER' | 'LIVE'
  is_live: boolean
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ''
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

/**
 * Convert ISO 8601 duration to seconds
 */
function parseDuration(duration?: string): number | undefined {
  if (!duration) return undefined
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return undefined
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Classify video type based on title and description
 */
function classifyVideoType(title: string, description: string): YouTubeVideo['video_type'] {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = description.toLowerCase()
  
  if (lowerTitle.includes('trailer') || lowerTitle.includes('teaser')) return 'TRAILER'
  if (lowerTitle.includes('review')) return 'REVIEW'
  if (lowerTitle.includes('walkthrough') || lowerTitle.includes('playthrough')) return 'WALKTHROUGH'
  if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to') || lowerTitle.includes('guide')) return 'TUTORIAL'
  if (lowerTitle.includes('news') || lowerTitle.includes('update') || lowerTitle.includes('patch')) return 'NEWS'
  if (lowerTitle.includes('live') || lowerTitle.includes('stream')) return 'LIVE'
  return 'GAMEPLAY'
}

/**
 * Search YouTube for game-related videos
 * (Only uses official YouTube API, low-risk
 */
export async function searchGameVideos(gameName: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not set, returning demo mode')
    return getDemoVideos(gameName)
  }

  try {
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`)
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('q', `${gameName} gameplay tutorial`)
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('maxResults', maxResults.toString())
    searchUrl.searchParams.set('videoEmbeddable', 'true')
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const searchResponse = await fetch(searchUrl.toString())
    if (!searchResponse.ok) throw new Error('YouTube API error')
    
    const searchData: YouTubeSearchResult = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return getDemoVideos(gameName)
    }

    const videoIds = searchData.items
      .map(item => item.id.videoId)
      .filter(Boolean)
      .join(',')

    const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`)
    detailsUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
    detailsUrl.searchParams.set('id', videoIds)
    detailsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const detailsResponse = await fetch(detailsUrl.toString())
    if (!detailsResponse.ok) throw new Error('YouTube API error')
    
    const detailsData: YouTubeSearchResult = await detailsResponse.json()

    const videos: YouTubeVideo[] = detailsData.items.map(item => {
      const isShort = item.snippet.title.toLowerCase().includes('#short') || 
                      item.snippet.title.toLowerCase().includes('shorts')

      const videoType = classifyVideoType(item.snippet.title, item.snippet.description || '')

      return {
        video_id: item.id.videoId || '',
        platform: isShort ? 'YOUTUBE_SHORTS' : 'YOUTUBE',
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
        channel_name: item.snippet.channelTitle,
        channel_url: `https://www.youtube.com/channel/${item.snippet.channelId}`,
        duration: parseDuration(item.contentDetails?.duration),
        view_count: item.statistics?.viewCount ? BigInt(item.statistics.viewCount) : undefined,
        like_count: item.statistics?.likeCount ? BigInt(item.statistics.likeCount) : undefined,
        published_at: new Date(item.snippet.publishedAt),
        video_type: videoType,
        is_live: item.snippet.liveBroadcastContent === 'live',
      }
    })

    return videos
  } catch (error) {
    console.error('YouTube API error:', error)
    return getDemoVideos(gameName)
  }
}

/**
 * Get demo videos when API is not available
 */
function getDemoVideos(gameName: string): YouTubeVideo[] {
  const baseGameKeyword = encodeURIComponent(gameName)
  return [
    {
      video_id: 'dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      title: `${gameName} - Ultimate Gameplay Guide`,
      description: `Complete walkthrough and tips for ${gameName}`,
      thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      channel_name: 'GameHub Official',
      channel_url: 'https://www.youtube.com/@gamehub',
      duration: 1800,
      view_count: BigInt(150000),
      published_at: new Date(),
      video_type: 'GAMEPLAY' as const,
      is_live: false,
    },
    {
      video_id: 'dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      title: `${gameName} - All Secrets and Easter Eggs`,
      description: `Discover hidden secrets in ${gameName}`,
      thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
      channel_name: 'Gaming Explorer',
      channel_url: 'https://www.youtube.com/@gamingexplorer',
      duration: 2400,
      view_count: BigInt(89000),
      published_at: new Date(Date.now() - 86400000),
      video_type: 'WALKTHROUGH' as const,
      is_live: false,
    },
  ]
}

/**
 * Get YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = false): string {
  return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
