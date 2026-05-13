'use client'

import { Play, Radio, Eye } from 'lucide-react'

interface GameVideoCardProps {
  videoId: string
  platform: string
  title: string
  thumbnailUrl: string
  channelName: string
  channelUrl: string
  duration?: number | null
  viewCount?: string | null
  publishedAt?: string | null
  isLive?: boolean
  isFeatured?: boolean
  onClick?: () => void
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function formatViewCount(count: string): string {
  const num = parseInt(count, 10)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return `${num}`
}

export function GameVideoCard({
  videoId,
  platform,
  title,
  thumbnailUrl,
  channelName,
  channelUrl,
  duration,
  viewCount,
  isLive = false,
  isFeatured = false,
  onClick,
}: GameVideoCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div 
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
        isFeatured ? 'ring-2 ring-blue-500/50' : ''
      }`}
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div 
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ minHeight: '140px' }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-7 h-7 text-blue-600 ml-1" fill="currentColor" />
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          ) : duration && (
            <span className="px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-medium">
              {formatDuration(duration)}
            </span>
          )}
          
          {viewCount && (
            <span className="px-2.5 py-1 rounded-full bg-black/80 text-white text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViewCount(viewCount)}
            </span>
          )}
        </div>

        {platform === 'YOUTUBE' && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded bg-red-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">YT</span>
          </div>
        )}
        {platform === 'TWITCH' && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-medium line-clamp-2 mb-2 leading-tight" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
          {title}
        </h4>
        <div className="flex items-center justify-between">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-blue-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {channelName}
          </a>
          {viewCount && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatViewCount(viewCount)} views
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
