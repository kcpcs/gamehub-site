// @ts-nocheck
"use client"

import type { Game } from '@/types'
import { useState } from 'react'
import { ResponsiveImage } from '../ResponsiveImage'
import { PlatformIcon } from '../PlatformIcon'

interface GameCardProps {
  game: Game
}

function getScoreColor(score?: number): string {
  if (!score || score < 50) return 'var(--danger)'
  if (score < 75) return 'var(--warning)'
  return 'var(--success)'
}

export function GameCard({ game }: GameCardProps) {
  const displayScore = game.scores.opencritic || game.scores.community || game.scores.steam_positive_pct
  const scoreColor = getScoreColor(displayScore)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  return (
    <a 
      href={`/games/${game.slug}`}
      className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <ResponsiveImage
          src={game.cover.url || game.cover.igdb_url}
          alt={game.name}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {displayScore && (
          <div 
            className="absolute top-3 right-3 flex gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: 'rgba(13, 17, 23, 0.9)', color: scoreColor }}
            >
              {displayScore}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(13, 17, 23, 0.9)' }}
        >
          <svg 
            className="w-4 h-4" 
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: isSaved ? 'var(--accent-light)' : 'var(--text-secondary)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-sm mb-2 truncate" style={{ color: 'var(--text-primary)' }}>
            {game.name}
          </h3>
          
          <div className="flex flex-wrap gap-1.5 mb-2">
            {game.platforms.slice(0, 3).map((platform) => (
              <span 
                key={platform}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--text-secondary)' }}
              >
                <PlatformIcon platform={platform} size="sm" /> {platform}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {game.guide_count} guides
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {game.code_count} codes
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
