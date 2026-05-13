'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { GameVideoCard } from '@/components/games/GameVideoCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Search, Filter, TrendingUp, PlayCircle, Radio, X, ChevronRight, Sparkles } from 'lucide-react'

interface Video {
  id: string
  video_id: string
  platform: string
  game_id?: string
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
  is_featured: boolean
}

interface VideoModalProps {
  video: Video | null
  onClose: () => void
}

function VideoModal({ video, onClose }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (!video) return null

  const getEmbedUrl = () => {
    if (video.platform === 'YOUTUBE' || video.platform === 'YOUTUBE_SHORTS') {
      return `https://www.youtube.com/embed/${video.video_id}?autoplay=1`
    }
    if (video.platform === 'TWITCH') {
      return `https://player.twitch.tv/?channel=${video.channel_name.toLowerCase().replace(/\s+/g, '')}&parent=localhost&autoplay=false`
    }
    return null
  }

  const embedUrl = getEmbedUrl()

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-video bg-black">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white/70">Video not available</p>
            </div>
          )}
        </div>

        <div className="p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {video.title}
          </h3>
          <div className="flex items-center gap-4">
            <a
              href={video.channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {video.channel_name[0]?.toUpperCase() || 'U'}
              </div>
              {video.channel_name}
            </a>
            {video.view_count && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {parseInt(video.view_count) >= 1000000 
                  ? `${(parseInt(video.view_count) / 1000000).toFixed(1)}M views`
                  : parseInt(video.view_count) >= 1000 
                    ? `${(parseInt(video.view_count) / 1000).toFixed(1)}K views`
                    : `${video.view_count} views`
                }
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="aspect-video bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const demoVideos: Video[] = [
          {
            id: '1',
            video_id: 'dQw4w9WgXcQ',
            platform: 'YOUTUBE',
            title: 'Genshin Impact - Ultimate Gameplay Guide 2024',
            description: 'Complete walkthrough and tips for Genshin Impact version 4.5',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'GameHub Official',
            channel_url: 'https://youtube.com/@gamehub',
            duration: 1800,
            view_count: '1250000',
            published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'GAMEPLAY',
            is_live: false,
            is_featured: true
          },
          {
            id: '2',
            video_id: 'demo2',
            platform: 'TWITCH',
            title: '🔴 LIVE: Honkai Star Rail - New Character Reveal',
            description: 'First look at the upcoming 2.5 version characters',
            thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_streamkinglive-320x180.jpg',
            channel_name: 'StreamKingLive',
            channel_url: 'https://twitch.tv/streamkinglive',
            view_count: '45200',
            published_at: new Date().toISOString(),
            video_type: 'LIVE',
            is_live: true,
            is_featured: true
          },
          {
            id: '3',
            video_id: 'demo3',
            platform: 'YOUTUBE',
            title: 'Hogwarts Legacy - All Secrets and Easter Eggs',
            description: 'Discover hidden secrets in Hogwarts Legacy',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'GamingExplorer',
            channel_url: 'https://youtube.com/@gamingexplorer',
            duration: 2400,
            view_count: '89000',
            published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'WALKTHROUGH',
            is_live: false,
            is_featured: false
          },
          {
            id: '4',
            video_id: 'demo4',
            platform: 'YOUTUBE',
            title: 'The Legend of Zelda: Tears of the Kingdom - Review',
            description: 'Honest review of the latest Zelda masterpiece',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'GameReviewsNow',
            channel_url: 'https://youtube.com/@gamereviewsnow',
            duration: 900,
            view_count: '567000',
            published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'REVIEW',
            is_live: false,
            is_featured: false
          },
          {
            id: '5',
            video_id: 'demo5',
            platform: 'YOUTUBE',
            title: 'Elden Ring - How to Defeat Malenia',
            description: 'Tutorial for the hardest boss in Elden Ring',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'BossGuidePro',
            channel_url: 'https://youtube.com/@bossguidepro',
            duration: 1200,
            view_count: '234000',
            published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'TUTORIAL',
            is_live: false,
            is_featured: false
          },
          {
            id: '6',
            video_id: 'demo6',
            platform: 'TWITCH',
            title: '🔴 LIVE: Fortnite Chapter 5 - First Playthrough',
            description: 'Exploring the new Fortnite season live!',
            thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_progamerlive-320x180.jpg',
            channel_name: 'ProGamerLive',
            channel_url: 'https://twitch.tv/progamerlive',
            view_count: '28900',
            published_at: new Date(Date.now() - 3600000).toISOString(),
            video_type: 'LIVE',
            is_live: true,
            is_featured: false
          },
          {
            id: '7',
            video_id: 'demo7',
            platform: 'YOUTUBE',
            title: 'Cyberpunk 2077 - Phantom Liberty DLC Review',
            description: 'Is the DLC worth buying? Full review inside!',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'TechGameReviews',
            channel_url: 'https://youtube.com/@techgamereviews',
            duration: 1500,
            view_count: '445000',
            published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'REVIEW',
            is_live: false,
            is_featured: false
          },
          {
            id: '8',
            video_id: 'demo8',
            platform: 'YOUTUBE',
            title: 'Starfield - Complete Beginners Guide',
            description: 'Everything you need to know to start your journey',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'SpaceExplorer',
            channel_url: 'https://youtube.com/@spaceexplorer',
            duration: 2100,
            view_count: '189000',
            published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'TUTORIAL',
            is_live: false,
            is_featured: false
          },
          {
            id: '9',
            video_id: 'demo9',
            platform: 'YOUTUBE',
            title: 'Baldurs Gate 3 - Best Builds for Beginners',
            description: 'Top 5 builds to dominate the game',
            thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channel_name: 'RPGMaster',
            channel_url: 'https://youtube.com/@rpgmaster',
            duration: 1600,
            view_count: '312000',
            published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            video_type: 'TUTORIAL',
            is_live: false,
            is_featured: false
          }
        ]

        setTimeout(() => {
          setVideos(demoVideos)
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || video.platform.toLowerCase() === selectedPlatform.toLowerCase()
    const matchesType = selectedType === 'all' || video.video_type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesPlatform && matchesType
  })

  const featuredVideos = filteredVideos.filter(v => v.is_featured)
  const regularVideos = filteredVideos.filter(v => !v.is_featured)
  const liveVideos = filteredVideos.filter(v => v.is_live)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Videos', href: '/videos' }
        ]} />
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
            <PlayCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Game Videos
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Discover the best gaming videos from YouTube and Twitch
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search videos, channels, or games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Platform:</span>
          </div>
          {['all', 'youtube', 'twitch'].map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPlatform === platform ? '' : 'hover:bg-opacity-80'
              }`}
              style={{
                backgroundColor: selectedPlatform === platform ? 'var(--accent)' : 'var(--bg-surface)',
                border: selectedPlatform === platform ? 'none' : '1px solid var(--border)',
                color: selectedPlatform === platform ? 'white' : 'var(--text-secondary)'
              }}
            >
              {platform === 'all' ? 'All' : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}

          <div className="h-6 w-px" style={{ backgroundColor: 'var(--border)' }} />

          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Type:</span>
          {['all', 'GAMEPLAY', 'TUTORIAL', 'REVIEW', 'LIVE'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedType === type ? '' : 'hover:bg-opacity-80'
              }`}
              style={{
                backgroundColor: selectedType === type ? 'var(--accent-light)' : 'var(--bg-surface)',
                border: selectedType === type ? 'none' : '1px solid var(--border)',
                color: selectedType === type ? 'white' : 'var(--text-secondary)'
              }}
            >
              {type === 'all' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {liveVideos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Radio className="w-5 h-5 animate-pulse" style={{ color: 'var(--danger)' }} />
              Live Streams
            </h2>
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {liveVideos.length} live
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={i} />)
            ) : (
              liveVideos.map(video => (
                <GameVideoCard 
                  key={video.id} 
                  videoId={video.video_id}
                  platform={video.platform}
                  title={video.title}
                  thumbnailUrl={video.thumbnail_url}
                  channelName={video.channel_name}
                  channelUrl={video.channel_url}
                  viewCount={video.view_count}
                  isLive={video.is_live}
                  onClick={() => setSelectedVideo(video)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {featuredVideos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Featured Videos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <VideoSkeleton key={i} />)
            ) : (
              featuredVideos.map(video => (
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
                  isFeatured={video.is_featured}
                  onClick={() => setSelectedVideo(video)}
                />
              ))
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            Latest Videos
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {regularVideos.length} videos
          </span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}
          </div>
        ) : regularVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regularVideos.map(video => (
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
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <PlayCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No videos found
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your search filters or check back later for new content.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
          <PlayCircle className="w-7 h-7" style={{ color: 'var(--accent)' }} />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Can&apos;t find what you&apos;re looking for?
        </h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Check out our game guides and walkthroughs in the Guides section!
        </p>
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          Browse Guides
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  )
}
