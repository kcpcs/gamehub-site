'use client'

import { useState } from 'react'
import { Heart, Bookmark, Loader2 } from 'lucide-react'

interface VideoActionsProps {
  videoId: string
  initialLiked?: boolean
  initialFavorited?: boolean
  likeCount?: string
}

export function VideoActions({ videoId, initialLiked = false, initialFavorited = false, likeCount }: VideoActionsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState<'like' | 'favorite' | null>(null)

  const handleLike = async () => {
    if (loading) return
    setLoading('like')
    try {
      const method = liked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        setLiked(!liked)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleFavorite = async () => {
    if (loading) return
    setLoading('favorite')
    try {
      const method = favorited ? 'DELETE' : 'POST'
      const response = await fetch(`/api/videos/${videoId}/favorite`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        setFavorited(!favorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLike}
        disabled={loading !== null}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        {loading === 'like' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        )}
        <span className="text-sm font-medium">
          {likeCount && liked ? (parseInt(likeCount) + 1).toString() : likeCount}
        </span>
      </button>

      <button
        onClick={handleFavorite}
        disabled={loading !== null}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          favorited ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'
        }`}
      >
        {loading === 'favorite' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Bookmark className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
        )}
        <span className="text-sm font-medium">
          {favorited ? 'Saved' : 'Save'}
        </span>
      </button>
    </div>
  )
}
