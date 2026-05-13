'use client'

import { useState, useEffect } from 'react'
import { GameVideoCard } from './GameVideoCard'
import { Loader2 } from 'lucide-react'

interface Video {
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

interface GameVideosSectionProps {
  gameSlug: string
}

export function GameVideosSection({ gameSlug }: GameVideosSectionProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/videos/${gameSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setVideos(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [gameSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>No videos available yet.</p>
      </div>
    )
  }

  const featuredVideos = videos.filter(v => v.is_featured)
  const regularVideos = videos.filter(v => !v.is_featured)

  return (
    <div className="space-y-6">
      {featuredVideos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Featured Videos
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredVideos.map((video) => (
              <GameVideoCard
                key={video.id}
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
                isFeatured={video.is_featured}
              />
            ))}
          </div>
        </div>
      )}

      {regularVideos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {featuredVideos.length > 0 ? 'More Videos' : 'Videos'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularVideos.map((video) => (
              <GameVideoCard
                key={video.id}
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
                isFeatured={video.is_featured}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
