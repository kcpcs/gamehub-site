'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface SearchHit {
  objectID: string
  type: 'game' | 'guide'
  slug: string
  title: string
  image_url: string
  excerpt?: string
  game_name?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=all`)
      const data = await res.json()
      
      if (data.success && data.data?.hits) {
        setResults(data.data.hits)
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  const getResultUrl = (result: SearchHit) => {
    if (result.type === 'game') {
      return `/games/${result.slug}`
    }
    return `/guides/${result.slug}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-2xl mx-4 rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, guides, and more..."
            className="flex-1 bg-transparent text-lg outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {loading && (
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-opacity-50 transition-colors"
            style={{ backgroundColor: 'var(--bg-overlay)' }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query && results.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>No results found for "{query}"</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Try different keywords</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <a
                  key={result.objectID}
                  href={getResultUrl(result)}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-opacity-50 transition-colors"
                  style={{ backgroundColor: 'var(--bg-overlay)' }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold overflow-hidden"
                    style={{ 
                      backgroundColor: result.type === 'game' ? 'var(--accent)' : 'var(--success)',
                    }}
                  >
                    {result.image_url ? (
                      <img src={result.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white">{result.type === 'game' ? '🎮' : '📝'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {result.title}
                    </p>
                    {result.game_name && (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {result.game_name}
                      </p>
                    )}
                    {result.excerpt && (
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {result.excerpt}
                      </p>
                    )}
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-muted)' }}
                  >
                    {result.type === 'game' ? 'Game' : 'Guide'}
                  </span>
                </a>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-6">
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Elden Ring', 'Genshin Impact', 'Minecraft', 'Tier List', 'Codes'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: 'var(--bg-raised)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-overlay)' }}>Enter</kbd> to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-overlay)' }}>Esc</kbd> to close
            </span>
          </div>
          <span>Search powered by GameHub</span>
        </div>
      </div>
    </div>
  )
}
