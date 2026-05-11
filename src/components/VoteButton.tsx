'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface VoteButtonProps {
  itemId: string
  itemType: 'tier_entry' | 'article' | 'comment'
  initialUpvotes?: number
  initialDownvotes?: number
  initialUserVote?: 'up' | 'down' | null
}

const VOTES_KEY = 'gamehub_votes'

interface VoteData {
  itemId: string
  itemType: string
  vote: 'up' | 'down'
  votedAt: string
}

export function VoteButton({
  itemId,
  itemType,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null
}: VoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const votes = getVotes()
    const existingVote = votes.find(v => v.itemId === `${itemType}_${itemId}`)
    if (existingVote) {
      setUserVote(existingVote.vote)
    }
  }, [itemId, itemType])

  const getVotes = (): VoteData[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(VOTES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveVotes = (votes: VoteData[]) => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
  }

  const handleVote = (vote: 'up' | 'down') => {
    if (isLoading) return

    setIsLoading(true)

    const votes = getVotes()
    const voteKey = `${itemType}_${itemId}`
    const existingIndex = votes.findIndex(v => v.itemId === voteKey)

    if (userVote === vote) {
      votes.splice(existingIndex, 1)
      setUserVote(null)
      if (vote === 'up') setUpvotes(prev => prev - 1)
      else setDownvotes(prev => prev - 1)
    } else {
      if (existingIndex > -1) {
        const oldVote = votes[existingIndex].vote
        votes.splice(existingIndex, 1)
        if (oldVote === 'up') setUpvotes(prev => prev - 1)
        else setDownvotes(prev => prev - 1)
      }

      votes.push({
        itemId: voteKey,
        itemType,
        vote,
        votedAt: new Date().toISOString()
      })
      setUserVote(vote)
      if (vote === 'up') setUpvotes(prev => prev + 1)
      else setDownvotes(prev => prev + 1)
    }

    saveVotes(votes)
    setTimeout(() => setIsLoading(false), 300)
  }

  const score = upvotes - downvotes

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <ThumbsUp size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{initialUpvotes}</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <ThumbsDown size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{initialDownvotes}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote('up')}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
        style={{
          backgroundColor: userVote === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-surface)',
          border: `1px solid ${userVote === 'up' ? 'rgba(34, 197, 94, 0.3)' : 'var(--border)'}`,
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
        <span className="text-sm font-medium" style={{ color: userVote === 'up' ? '#22c55e' : 'var(--text-secondary)' }}>
          {upvotes}
        </span>
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
        style={{
          backgroundColor: userVote === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
          border: `1px solid ${userVote === 'down' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
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
        <span className="text-sm font-medium" style={{ color: userVote === 'down' ? '#ef4444' : 'var(--text-secondary)' }}>
          {downvotes}
        </span>
      </button>

      {score > 0 && (
        <span className="ml-2 text-sm font-bold" style={{ color: '#22c55e' }}>
          +{score}
        </span>
      )}
      {score < 0 && (
        <span className="ml-2 text-sm font-bold" style={{ color: '#ef4444' }}>
          {score}
        </span>
      )}
    </div>
  )
}
