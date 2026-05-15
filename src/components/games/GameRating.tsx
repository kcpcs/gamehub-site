'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import Link from 'next/link'

interface GameRatingWithUser {
  id: string
  user_id: string
  user: {
    id: string
    username: string
    avatar: string | null
  }
  game_id: string
  score: number
  review: string | null
  helpful_count: number
  created_at: string
  updated_at: string
}

interface GameRatingStats {
  average: number
  total: number
  distribution: Record<number, number>
}

interface GameRatingProps {
  gameSlug: string
}

export function GameRating({ gameSlug }: GameRatingProps) {
  const { t } = useLanguage()
  const [ratings, setRatings] = useState<GameRatingWithUser[]>([])
  const [stats, setStats] = useState<GameRatingStats>({ average: 0, total: 0, distribution: {} })
  const [userRating, setUserRating] = useState<GameRatingWithUser | null>(null)
  const [selectedScore, setSelectedScore] = useState<number>(0)
  const [reviewText, setReviewText] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkLoginStatus()
    fetchRatings()
  }, [gameSlug])

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setIsLoggedIn(!!data?.user)
    } catch {
      setIsLoggedIn(false)
    }
  }

  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/games/${gameSlug}/ratings`)
      const data = await res.json()
      if (data.success) {
        setRatings(data.data.ratings)
        setStats(data.data.stats)
        
        const resSession = await fetch('/api/auth/session')
        const sessionData = await resSession.json()
        if (sessionData?.user) {
          const userRating = data.data.ratings.find((r: GameRatingWithUser) => r.user_id === sessionData.user.id)
          if (userRating) {
            setUserRating(userRating)
            setSelectedScore(userRating.score)
            setReviewText(userRating.review || '')
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRating = async () => {
    if (!selectedScore) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/games/${gameSlug}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: selectedScore, review: reviewText || null })
      })
      
      const data = await res.json()
      if (data.success) {
        setUserRating(data.data)
        await fetchRatings()
      }
    } catch (err) {
      console.error('Failed to submit rating:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRating = async () => {
    if (!confirm('Are you sure you want to delete your rating?')) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/games/${gameSlug}/ratings`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setUserRating(null)
        setSelectedScore(0)
        setReviewText('')
        await fetchRatings()
      }
    } catch (err) {
      console.error('Failed to delete rating:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)'
    if (score >= 6) return 'var(--warning)'
    if (score >= 4) return 'var(--text-secondary)'
    return 'var(--danger)'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
          <div className="h-32 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {t('ratings_title') || 'Ratings & Reviews'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <div className="text-6xl font-bold mb-2" style={{ color: getScoreColor(stats.average) }}>
              {stats.average.toFixed(1)}
            </div>
            <div className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('out_of_10') || 'out of 10'}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {stats.total} {t('ratings') || 'ratings'}
            </div>
          </div>

          <div className="space-y-2">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => {
              const count = stats.distribution?.[score] || 0
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              
              return (
                <div key={score} className="flex items-center gap-3">
                  <span className="w-6 text-right text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {score}
                  </span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getScoreColor(score)
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm" style={{ color: 'var(--text-muted)' }}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {!isLoggedIn ? (
          <div className="text-center py-8">
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('login_to_rate') || 'Login to rate this game'}
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              {t('sign_in')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {userRating ? (t('your_rating') || 'Your Rating') : (t('rate_game') || 'Rate this Game')}
            </h3>

            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <button
                  key={score}
                  onClick={() => setSelectedScore(score)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all hover:scale-110 ${
                    selectedScore === score ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: selectedScore === score ? getScoreColor(score) : 'var(--bg-overlay)',
                    color: selectedScore === score ? 'white' : 'var(--text-secondary)',
                    outlineColor: getScoreColor(score)
                  }}
                >
                  {score}
                </button>
              ))}
            </div>

            <div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t('write_review') || 'Write a review...'}
                className="w-full p-3 rounded-lg resize-none"
                style={{
                  backgroundColor: 'var(--bg-overlay)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  minHeight: '100px'
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitRating}
                disabled={submitting || !selectedScore}
                className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                {submitting ? (t('submitting') || 'Submitting...') : (userRating ? (t('update_rating') || 'Update Rating') : (t('submit_rating') || 'Submit Rating'))}
              </button>
              
              {userRating && (
                <button
                  onClick={handleDeleteRating}
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--danger)' }}
                >
                  {t('delete_rating') || 'Delete'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {ratings.length > 0 && (
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('all_reviews') || 'All Reviews'}
          </h3>
          
          <div className="space-y-4">
            {ratings.map(rating => (
              <div
                key={rating.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--bg-overlay)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {rating.user.avatar ? (
                      <img
                        src={rating.user.avatar}
                        alt={rating.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                      >
                        {rating.user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {rating.user.username}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(rating.created_at)}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold px-3 py-1 rounded-lg"
                    style={{ backgroundColor: getScoreColor(rating.score), color: 'white' }}
                  >
                    {rating.score}
                  </div>
                </div>
                
                {rating.review && (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {rating.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
