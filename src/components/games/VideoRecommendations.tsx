'use client'

import { useState, useEffect } from 'react'
import { GameVideoCard } from './GameVideoCard'
import { Loader2, TrendingUp, Sparkles, Eye } from 'lucide-react'

interface RecommendedVideo {
  id: string
  video_id: string
  platform: string
  title: string
  description: string
  thumbnail_url: string
  channel_name: string
  channel_url: string
  duration?: number
  view_count?: string
  published_at?: string
  video_type: string
  is_live: boolean
  relevance_score: number
  recommendation_reason: string
}

interface VideoRecommendationsProps {
  currentVideoId?: string
  type?: 'recommended' | 'trending' | 'similar'
  title?: string
  limit?: number
}

export function VideoRecommendations({
  currentVideoId,
  type = 'recommended',
  title,
  limit = 6
}: VideoRecommendationsProps) {
  const [videos, setVideos] = useState<RecommendedVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          type,
          limit: limit.toString()
        })

        if (currentVideoId) {
          params.set('videoId', currentVideoId)
        }

        const response = await fetch(`/api/recommend/videos?${params}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setVideos(data.data.videos)
          }
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [type, currentVideoId, limit])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (videos.length === 0) {
    return null
  }

  const getIcon = () => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-5 h-5" />
      case 'similar':
        return <Eye className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case 'trending':
        return 'Trending Now'
      case 'similar':
        return 'Similar Videos'
      default:
        return 'Recommended For You'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getIcon()}
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
      </div>

      {type === 'recommended' && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Based on your viewing history
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative">
            <GameVideoCard
              videoId={video.video_id}
              platform={video.platform}
              title={video.title}
              thumbnailUrl={video.thumbnail_url}
              channelName={video.channel_name}
              channelUrl={video.channel_url}
              duration={video.duration}
              viewCount={video.view_count}
              publishedAt={video.published_at}
              isLive={video.is_live}
              isFeatured={video.relevance_score > 80}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
