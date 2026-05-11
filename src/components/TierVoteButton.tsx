'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, Check } from 'lucide-react'

interface TierVoteButtonProps {
  entryId: string
  voteCount: number
  hasVoted: boolean
  onVote: (entryId: string) => void
}

export function TierVoteButton({ entryId, voteCount, hasVoted, onVote }: TierVoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [displayCount, setDisplayCount] = useState(voteCount)

  useEffect(() => {
    setDisplayCount(voteCount)
  }, [voteCount])

  const handleVote = async () => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    
    try {
      await onVote(entryId)
      setDisplayCount(prev => prev + 1)
    } catch (error) {
      console.error('Vote failed:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || isVoting}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        hasVoted ? 'opacity-60' : 'hover:scale-105'
      }`}
      style={{
        backgroundColor: hasVoted ? 'var(--success)' : 'var(--bg-surface)',
        color: hasVoted ? 'white' : 'var(--text-secondary)',
        border: `1px solid ${hasVoted ? 'var(--success)' : 'var(--border)'}`,
      }}
    >
      {hasVoted ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>{displayCount.toLocaleString()}</span>
        </>
      ) : (
        <>
          <ThumbsUp className={`w-3.5 h-3.5 ${isVoting ? 'animate-pulse' : ''}`} />
          <span>{displayCount.toLocaleString()}</span>
        </>
      )}
    </button>
  )
}

interface TierVoteSectionProps {
  totalVotes: number
  onVoteAll: () => void
}

export function TierVoteSection({ totalVotes, onVoteAll }: TierVoteSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVoteAll = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onVoteAll()
    } catch (error) {
      console.error('Vote all failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className="rounded-xl p-6 text-center"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-center gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
        <ThumbsUp className="w-5 h-5" />
        <span>
          <strong>{totalVotes.toLocaleString()}</strong> total votes
        </span>
      </div>
      <button
        onClick={handleVoteAll}
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Voting...
          </span>
        ) : (
          'Vote Now'
        )}
      </button>
      <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        Login to cast your votes
      </p>
    </div>
  )
}