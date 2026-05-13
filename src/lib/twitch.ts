// Twitch API Integration
// Low-risk approach: only use official APIs, no stream downloading

interface TwitchStream {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: string
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tag_ids: string[]
  tags: string[]
  is_mature: boolean
}

interface TwitchStreamsResponse {
  data: TwitchStream[]
  pagination: { cursor?: string }
}

interface TwitchStreamer {
  id: string
  user_name: string
  profile_image_url: string
}

interface TwitchVideo {
  video_id: string
  platform: 'TWITCH'
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration?: number
  view_count?: bigint
  published_at?: Date
  video_type: 'GAMEPLAY' | 'TUTORIAL' | 'REVIEW' | 'WALKTHROUGH' | 'NEWS' | 'TRAILER' | 'LIVE'
  is_live: boolean
}

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || ''
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || ''
let twitchAccessToken: string | null = null
let tokenExpiresAt: number = 0

/**
 * Get Twitch access token
 */
async function getTwitchAccessToken(): Promise<string | null> {
  if (twitchAccessToken && Date.now() < tokenExpiresAt) {
    return twitchAccessToken
  }

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    return null
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    })

    if (!response.ok) throw new Error('Twitch token error')
    
    const data = await response.json()
    twitchAccessToken = data.access_token
    tokenExpiresAt = Date.now() + (data.expires_in * 1000 - 300000) // 5 min buffer
    return twitchAccessToken
  } catch (error) {
    console.error('Twitch token error:', error)
    return null
  }
}

/**
 * Classify video type based on title
 */
function classifyVideoType(title: string): TwitchVideo['video_type'] {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('trailer') || lowerTitle.includes('teaser')) return 'TRAILER'
  if (lowerTitle.includes('review')) return 'REVIEW'
  if (lowerTitle.includes('walkthrough') || lowerTitle.includes('playthrough')) return 'WALKTHROUGH'
  if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to')) return 'TUTORIAL'
  if (lowerTitle.includes('news') || lowerTitle.includes('update')) return 'NEWS'
  return 'GAMEPLAY'
}

/**
 * Get Twitch live streams for a game
 */
export async function searchTwitchStreams(gameName: string, maxResults: number = 10): Promise<TwitchVideo[]> {
  const token = await getTwitchAccessToken()
  
  if (!token || !TWITCH_CLIENT_ID) {
    return getDemoTwitchStreams(gameName)
  }

  try {
    const url = new URL('https://api.twitch.tv/helix/streams')
    url.searchParams.set('game_name', gameName)
    url.searchParams.set('first', maxResults.toString())

    const response = await fetch(url.toString(), {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Twitch API error')
    
    const data: TwitchStreamsResponse = await response.json()

    if (!data.data || data.data.length === 0) {
      return getDemoTwitchStreams(gameName)
    }

    const videos: TwitchVideo[] = data.data.map(stream => ({
      video_id: stream.id,
      platform: 'TWITCH',
      title: stream.title,
      description: stream.title,
      thumbnail_url: stream.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'),
      channel_name: stream.user_name,
      channel_url: `https://twitch.tv/${stream.user_login}`,
      view_count: BigInt(stream.viewer_count),
      published_at: new Date(stream.started_at),
      video_type: 'LIVE',
      is_live: true,
    }))

    return videos
  } catch (error) {
    console.error('Twitch API error:', error)
    return getDemoTwitchStreams(gameName)
  }
}

/**
 * Get demo Twitch streams when API is not available
 */
function getDemoTwitchStreams(gameName: string): TwitchVideo[] {
  return [
    {
      video_id: 'demo12345',
      platform: 'TWITCH',
      title: `${gameName} - Live First Look!`,
      description: `Playing ${gameName} for the first time!`,
      thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_games-1920x1080.jpg`,
      channel_name: 'GamingLive',
      channel_url: 'https://twitch.tv/gaminglive',
      view_count: BigInt(5200),
      published_at: new Date(),
      video_type: 'LIVE',
      is_live: true,
    },
    {
      video_id: 'demo67890',
      platform: 'TWITCH',
      title: `${gameName} - Speedrun Attempt`,
      description: `Trying to break the ${gameName} speedrun record`,
      thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_speed-1920x1080.jpg`,
      channel_name: 'SpeedKing',
      channel_url: 'https://twitch.tv/speedking',
      view_count: BigInt(2800),
      published_at: new Date(Date.now() - 7200000),
      video_type: 'GAMEPLAY',
      is_live: true,
    },
  ]
}

/**
 * Get Twitch embed URL
 */
export function getTwitchEmbedUrl(channel: string): string {
  return `https://player.twitch.tv/?channel=${channel}&parent=${process.env.NEXT_PUBLIC_SITE_URL || 'localhost'}`
}
