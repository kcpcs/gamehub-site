'use client'

import { useState, useEffect } from 'react'
import { X, Star, TrendingUp, TrendingDown, Award } from 'lucide-react'
import type { TierEntry } from '@/types'

interface TierEntryModalProps {
  entry: TierEntry | null
  isOpen: boolean
  onClose: () => void
}

export function TierEntryModal({ entry, isOpen, onClose }: TierEntryModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !entry) return null

  const getTrendIcon = () => {
    if (entry.vote_count > 1500) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (entry.vote_count < 500) return <TrendingDown className="w-4 h-4 text-red-500" />
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative max-w-md w-full rounded-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{ backgroundColor: 'var(--bg-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>

        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)`,
            }}
          />
          <img
            src={entry.image_url}
            alt={entry.name}
            className="absolute inset-0 w-full h-full object-contain p-8 opacity-90"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative -mt-8 px-6 pb-6">
          {/* Name and Grade */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {entry.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ 
                    backgroundColor: entry.grade === 'S' ? 'var(--accent)' : 
                                     entry.grade === 'A' ? 'var(--success)' :
                                     entry.grade === 'B' ? 'var(--info)' :
                                     entry.grade === 'C' ? 'var(--warning)' :
                                     entry.grade === 'D' ? 'var(--orange)' : 'var(--danger)',
                    color: entry.grade === 'C' || entry.grade === 'D' ? 'black' : 'white'
                  }}
                >
                  Tier {entry.grade}
                </span>
                {getTrendIcon()}
              </div>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-overlay)' }}>
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {entry.avg_score.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {entry.description || 'No description available.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-overlay)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Votes</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {entry.vote_count.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-overlay)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Popularity</p>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {Math.round((entry.vote_count / 15420) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Vote Button */}
          <button
            className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Vote for {entry.name}
          </button>
        </div>
      </div>
    </div>
  )
}