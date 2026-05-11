'use client'

import { useState } from 'react'

interface LikeButtonProps {
  initialLikes?: number
  initialLiked?: boolean
  onLike?: (liked: boolean, newCount: number) => void | Promise<void>
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export function LikeButton({
  initialLikes = 0,
  initialLiked = false,
  onLike,
  size = 'md',
  showCount = true
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = async () => {
    if (loading) return

    setLoading(true)
    const newLiked = !liked
    const newCount = newLiked ? likes + 1 : likes - 1

    setLiked(newLiked)
    setLikes(newCount)

    try {
      if (onLike) {
        await onLike(newLiked, newCount)
      }
    } catch {
      setLiked(!newLiked)
      setLikes(newLiked ? newCount - 1 : newCount + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{
        backgroundColor: liked ? 'var(--accent)' : 'var(--bg-surface)',
        border: liked ? 'none' : '1px solid var(--border)'
      }}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <svg
        className={`${iconSizes[size]} transition-all duration-300`}
        style={{
          color: liked ? 'white' : 'var(--text-secondary)',
          fill: liked ? 'white' : 'none',
          stroke: liked ? 'white' : 'currentColor'
        }}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showCount && (
        <span
          className="ml-2 text-sm font-medium"
          style={{ color: liked ? 'white' : 'var(--text-secondary)' }}
        >
          {likes}
        </span>
      )}
    </button>
  )
}

interface ShareButtonProps {
  url?: string
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ShareButton({
  url,
  title = 'Check out this content!',
  description,
  size = 'md'
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch {
      prompt('Copy this link:', shareUrl)
    }
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)'
        }}
        aria-label="Share"
      >
        <svg
          className={iconSizes[size]}
          style={{ color: 'var(--text-secondary)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-20 py-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => window.open(shareLinks.twitter, '_blank')}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-opacity-50 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={() => window.open(shareLinks.facebook, '_blank')}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-opacity-50 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Facebook</span>
            </button>
            <button
              onClick={() => window.open(shareLinks.reddit, '_blank')}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-opacity-50 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Reddit</span>
            </button>
            <button
              onClick={() => window.open(shareLinks.linkedin, '_blank')}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-opacity-50 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>LinkedIn</span>
            </button>
            <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-opacity-50 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Copy Link</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}