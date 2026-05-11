'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Gamepad2, BookOpen, Hash } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'game' | 'guide' | 'code'
  title: string
  subtitle?: string
  slug: string
}

interface SearchSuggestionsProps {
  onSelect?: (result: SearchResult) => void
}

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const debounce = setTimeout(() => {
      fetchResults(query)
    }, 200)

    return () => clearTimeout(debounce)
  }, [query])

  const fetchResults = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || mockResults(searchQuery))
      } else {
        setResults(mockResults(searchQuery))
      }
    } catch {
      setResults(mockResults(searchQuery))
    }
    setIsLoading(false)
  }

  const handleSelect = (result: SearchResult) => {
    setQuery('')
    setIsOpen(false)
    onSelect?.(result)
    
    const url = result.type === 'game' 
      ? `/games/${result.slug}` 
      : result.type === 'guide' 
        ? `/guides/${result.slug}` 
        : `/codes/${result.slug}`
    
    window.location.href = url
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'game':
        return <Gamepad2 className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
      case 'guide':
        return <BookOpen className="w-4 h-4" style={{ color: 'var(--success)' }} />
      case 'code':
        return <Hash className="w-4 h-4" style={{ color: 'var(--warning)' }} />
      default:
        return <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'game':
        return 'Game'
      case 'guide':
        return 'Guide'
      case 'code':
        return 'Code'
      default:
        return ''
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border)'}`,
        }}
      >
        <Search className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search games, guides, codes..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {/* Recent searches */}
          {!query && (
            <div className="p-3">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Recent searches
              </p>
              <div className="space-y-1">
                {['Genshin Impact', 'Elden Ring', 'Valorant'].map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-left text-sm transition-colors"
                  >
                    <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && (
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-transparent border-t-accent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.slice(0, 6).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-muted)' }}
                      >
                        {getTypeLabel(result.type)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-10 h-10 mx-auto mb-2 opacity-50" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View all button */}
          {query && results.length > 0 && (
            <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                className="w-full text-center text-sm font-medium transition-colors hover:text-accent-light"
                style={{ color: 'var(--text-secondary)' }}
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function mockResults(query: string): SearchResult[] {
  const games = [
    { id: '1', type: 'game' as const, title: 'Genshin Impact', subtitle: 'Action RPG', slug: 'genshin-impact' },
    { id: '2', type: 'game' as const, title: 'Elden Ring', subtitle: 'Open World RPG', slug: 'elden-ring' },
    { id: '3', type: 'game' as const, title: 'Valorant', subtitle: 'Tactical Shooter', slug: 'valorant' },
  ]

  const guides = [
    { id: '4', type: 'guide' as const, title: 'Genshin Impact Beginner Guide', subtitle: 'Complete Starter Guide', slug: 'genshin-impact-beginner-guide' },
    { id: '5', type: 'guide' as const, title: 'Elden Ring Boss Guide', subtitle: 'Defeat All Bosses', slug: 'elden-ring-boss-guide' },
  ]

  const codes = [
    { id: '6', type: 'code' as const, title: 'Genshin Impact Codes', subtitle: 'Active Redeem Codes', slug: 'genshin-impact' },
  ]

  const allResults = [...games, ...guides, ...codes]
  return allResults.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  )
}