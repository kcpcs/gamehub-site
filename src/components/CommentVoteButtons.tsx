'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface CommentVoteButtonsProps {
  commentId: string
  initialScore?: number
  initialUserVote?: 'up' | 'down' | null
}

export function CommentVoteButtons({
  commentId,
  initialScore = 0,
  initialUserVote = null
}: CommentVoteButtonsProps) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVote = async (vote: 'up' | 'down') => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/comments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          vote
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setScore(data.data.score)
          setUserVote(data.data.userVote)
        }
      }
    } catch {
      // Optimistic update fallback
      const oldVote = userVote
      
      if (oldVote === vote) {
        setUserVote(null)
        setScore(prev => prev + (vote === 'up' ? -1 : 1))
      } else {
        let scoreChange = vote === 'up' ? 1 : -1
        if (oldVote) {
          scoreChange += oldVote === 'up' ? -1 : 1
        }
        setUserVote(vote)
        setScore(prev => prev + scoreChange)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <ThumbsUp size={16} style={{ color: 'var(--text-muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{initialScore}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote('up')}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: userVote === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
        }}
        aria-label="Upvote"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ThumbsUp
            size={16}
            fill={userVote === 'up' ? 'currentColor' : 'none'}
            style={{ color: userVote === 'up' ? '#22c55e' : 'var(--text-secondary)' }}
          />
        )}
      </button>

      <span className="text-sm font-medium" style={{ 
        color: score > 0 ? '#22c55e' : score < 0 ? '#ef4444' : 'var(--text-secondary)' 
      }}>
        {score > 0 ? `+${score}` : score}
      </span>

      <button
        onClick={() => handleVote('down')}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: userVote === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
        }}
        aria-label="Downvote"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ThumbsDown
            size={16}
            fill={userVote === 'down' ? 'currentColor' : 'none'}
            style={{ color: userVote === 'down' ? '#ef4444' : 'var(--text-secondary)' }}
          />
        )}
      </button>
    </div>
  )
}
