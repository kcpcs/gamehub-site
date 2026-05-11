'use client'

import { useState } from 'react'
import type { Platform, Genre } from '@/types'

interface GameFiltersProps {
  onFilterChange: (filters: { 
    platform?: Platform; 
    genre?: Genre; 
    sort: 'popular' | 'newest' | 'score' | 'name';
    search?: string;
  }) => void
  totalGames?: number
}

const PLATFORMS: Platform[] = ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile']
const GENRES: Genre[] = ['Action', 'RPG', 'Adventure', 'Strategy', 'FPS', 'Indie']
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Guides' },
  { value: 'newest', label: 'Newest' },
  { value: 'score', label: 'Highest Rated' },
  { value: 'name', label: 'A-Z' }
]

export function GameFilters({ onFilterChange, totalGames = 0 }: GameFiltersProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>()
  const [selectedGenre, setSelectedGenre] = useState<Genre | undefined>()
  const [selectedSort, setSelectedSort] = useState<'popular' | 'newest' | 'score' | 'name'>('popular')
  const [searchQuery, setSearchQuery] = useState('')

  const handlePlatformChange = (platform: Platform | undefined) => {
    const newPlatform = selectedPlatform === platform ? undefined : platform
    setSelectedPlatform(newPlatform)
    onFilterChange({
      platform: newPlatform,
      genre: selectedGenre,
      sort: selectedSort,
      search: searchQuery
    })
  }

  const handleGenreChange = (genre: Genre | undefined) => {
    const newGenre = selectedGenre === genre ? undefined : genre
    setSelectedGenre(newGenre)
    onFilterChange({
      platform: selectedPlatform,
      genre: newGenre,
      sort: selectedSort,
      search: searchQuery
    })
  }

  const handleSortChange = (sort: 'popular' | 'newest' | 'score' | 'name') => {
    setSelectedSort(sort)
    onFilterChange({
      platform: selectedPlatform,
      genre: selectedGenre,
      sort: sort,
      search: searchQuery
    })
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onFilterChange({
      platform: selectedPlatform,
      genre: selectedGenre,
      sort: selectedSort,
      search: query
    })
  }

  const clearAllFilters = () => {
    setSelectedPlatform(undefined)
    setSelectedGenre(undefined)
    setSelectedSort('popular')
    setSearchQuery('')
    onFilterChange({
      sort: 'popular'
    })
  }

  const hasActiveFilters = selectedPlatform || selectedGenre || searchQuery

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{ 
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        
        <select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value as 'popular' | 'newest' | 'score' | 'name')}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)'
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Platform:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePlatformChange(undefined)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: !selectedPlatform ? 'var(--accent)' : 'var(--bg-overlay)',
                color: !selectedPlatform ? 'white' : 'var(--text-secondary)'
              }}
            >
              All
            </button>
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformChange(platform)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: selectedPlatform === platform ? 'var(--accent)' : 'var(--bg-overlay)',
                  color: selectedPlatform === platform ? 'white' : 'var(--text-secondary)'
                }}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Genre:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenreChange(undefined)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: !selectedGenre ? 'var(--accent)' : 'var(--bg-overlay)',
                color: !selectedGenre ? 'white' : 'var(--text-secondary)'
              }}
            >
              All
            </button>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: selectedGenre === genre ? 'var(--accent)' : 'var(--bg-overlay)',
                  color: selectedGenre === genre ? 'white' : 'var(--text-secondary)'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--accent-light)' }}
          >
            Clear all
          </button>
        )}
      </div>

      {totalGames > 0 && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{totalGames}</strong> games
          {hasActiveFilters && ' (filtered)'}
        </p>
      )}
    </div>
  )
}
