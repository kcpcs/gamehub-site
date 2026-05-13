// TikTok API Integration
// Low-risk approach: only use official APIs, no video downloading

interface TikTokVideo {
  video_id: string
  platform: 'TIKTOK'
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

const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY || ''
const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2'

/**
 * Search TikTok for game-related videos
 * Note: TikTok's API has limited availability, using embed approach instead
 */
export async function searchTikTokVideos(gameName: string, maxResults: number = 10): Promise<TikTokVideo[]> {
  if (!TIKTOK_API_KEY) {
    return getDemoTikTokVideos(gameName)
  }

  try {
    const response = await fetch(`${TIKTOK_API_BASE}/video/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TIKTOK_API_KEY}`
      },
      body: JSON.stringify({
        query: {
          keyword: `${gameName} gaming`,
          period: 30
        },
        max_count: maxResults
      })
    })

    if (!response.ok) throw new Error('TikTok API error')
    
    const data = await response.json()

    return data.data.videos.map((video: any) => ({
      video_id: video.id,
      platform: 'TIKTOK' as const,
      title: video.title,
      description: video.description || '',
      thumbnail_url: video.cover_image_url || '',
      channel_name: video.author?.nickname || 'Unknown',
      channel_url: `https://tiktok.com/@${video.author?.unique_id || 'user'}`,
      duration: video.duration,
      view_count: BigInt(video.stats?.play_count || 0),
      like_count: BigInt(video.stats?.like_count || 0),
      published_at: video.create_time ? new Date(video.create_time * 1000) : undefined,
      video_type: classifyVideoType(video.title, video.description || ''),
      is_live: false
    }))
  } catch (error) {
    console.error('TikTok API error:', error)
    return getDemoTikTokVideos(gameName)
  }
}

/**
 * Classify video type based on title and description
 */
function classifyVideoType(title: string, description: string): TikTokVideo['video_type'] {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = description.toLowerCase()
  
  if (lowerTitle.includes('trailer') || lowerTitle.includes('teaser')) return 'TRAILER'
  if (lowerTitle.includes('review')) return 'REVIEW'
  if (lowerTitle.includes('gameplay') || lowerTitle.includes('playing')) return 'GAMEPLAY'
  if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to')) return 'TUTORIAL'
  if (lowerTitle.includes('news') || lowerTitle.includes('update')) return 'NEWS'
  return 'GAMEPLAY'
}

/**
 * Get demo TikTok videos when API is not available
 */
function getDemoTikTokVideos(gameName: string): TikTokVideo[] {
  return [
    {
      video_id: 'demo_tiktok_123',
      platform: 'TIKTOK',
      title: `${gameName} Game Moment #gaming #fyp`,
      description: `Amazing moment in ${gameName}!`,
      thumbnail_url: 'https://p16-sg-default.tiktokcdn.com/cdn/img/default-cover.png',
      channel_name: 'GamingMoments',
      channel_url: 'https://tiktok.com/@gamingmoments',
      duration: 60,
      view_count: BigInt(500000),
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      video_type: 'GAMEPLAY',
      is_live: false
    },
    {
      video_id: 'demo_tiktok_456',
      platform: 'TIKTOK',
      title: `${gameName} Pro Tips #tutorial #gaming`,
      description: `Pro tips for ${gameName}`,
      thumbnail_url: 'https://p16-sg-default.tiktokcdn.com/cdn/img/default-cover.png',
      channel_name: 'ProGamerTips',
      channel_url: 'https://tiktok.com/@progamertips',
      duration: 45,
      view_count: BigInt(250000),
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      video_type: 'TUTORIAL',
      is_live: false
    }
  ]
}

/**
 * Get TikTok embed URL
 */
export function getTikTokEmbedUrl(videoId: string): string {
  return `https://www.tiktok.com/embed/${videoId}`
}

/**
 * Get TikTok video player HTML
 */
export function getTikTokPlayerHtml(videoId: string): string {
  return `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/${videoId}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;"><section><a target="_blank" title="@user" href="https://www.tiktok.com/@user?refer=embed">@user</a></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`
}
