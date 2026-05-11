'use client'

import { useState } from 'react'
import { Play, Volume2, VolumeX, Maximize, User, Radio } from 'lucide-react'

interface VideoEmbedProps {
  url: string
  title: string
  duration?: string
  thumbnail?: string
}

interface LiveStreamProps {
  streamer: string
  game: string
  viewers: number
  thumbnail: string
  isLive: boolean
  platform: 'twitch' | 'youtube'
}

export function VideoEmbed({ url, title, duration, thumbnail }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const getVideoId = () => {
    if (url.includes('youtube.com')) {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
      return match ? match[1] : null
    }
    if (url.includes('bilibili.com')) {
      const match = url.match(/bilibili\.com\/video\/([^\/?]+)/)
      return match ? match[1] : null
    }
    return null
  }

  const videoId = getVideoId()
  const embedUrl = url.includes('youtube.com') 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`
    : url

  return (
    <div className="group rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="relative aspect-video bg-black">
        {!isPlaying ? (
          <>
            <img
              src={thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-[var(--accent)]/50"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </button>
            </div>
            {duration && (
              <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-white text-xs">
                {duration}
              </span>
            )}
          </>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="p-4">
        <h4 className="font-medium mb-2 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h4>
        {isPlaying && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> : <Volume2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors">
              <Maximize className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function LiveStreamCard({ streamer, game, viewers, thumbnail, isLive, platform }: LiveStreamProps) {
  return (
    <a
      href={`https://${platform === 'twitch' ? 'twitch.tv' : 'youtube.com'}/${streamer}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="relative aspect-video">
        <img
          src={thumbnail}
          alt={`${streamer} streaming ${game}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] flex items-center justify-center">
              <User className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{streamer}</p>
              <p className="text-white/70 text-xs truncate">{game}</p>
            </div>
            <span className="px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium">
              {viewers.toLocaleString()} viewers
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

export function VideoGallery({ videos }: { videos: VideoEmbedProps[] }) {
  return (
    <div className="space-y-4">
      {videos.map((video, index) => (
        <VideoEmbed key={index} {...video} />
      ))}
    </div>
  )
}

export function LiveStreamsSection({ streams }: { streams: LiveStreamProps[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <Radio className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        Live Streams
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streams.map((stream, index) => (
          <LiveStreamCard key={index} {...stream} />
        ))}
      </div>
    </div>
  )
}