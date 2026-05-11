'use client'

import { useState, useCallback } from 'react'
import type { Game, Platform, Genre } from '@/types'
import { GameCard } from '@/components/games/GameCard'
import { GameFilters } from '@/components/games/GameFilters'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { JsonLd } from '@/components/SeoSchema'

const INITIAL_LIMIT = 24

interface PaginationMeta {
  page: number
  limit: number
  total: number
  has_next: boolean
  has_prev: boolean
}

interface GamesApiResponse {
  success: boolean
  data?: {
    games: Game[]
    meta?: PaginationMeta
  }
  meta?: PaginationMeta
}

async function fetchGamesPage(
  page: number,
  limit: number = INITIAL_LIMIT,
  sort: string = 'popular'
): Promise<{ games: Game[]; meta: PaginationMeta }> {
  try {
    const res = await fetch(`/api/games?page=${page}&limit=${limit}&sort=${sort}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data: GamesApiResponse = await res.json()
    if (data.success && data.data?.games) {
      const games = data.data.games.map((game: any) => ({
        id: game.id,
        slug: game.slug,
        name: game.name,
        cover: { url: game.cover_url || `https://picsum.photos/seed/${game.slug}/300/400` },
        screenshots: [],
        platforms: game.platforms || [],
        genres: game.genres || [],
        tags: [],
        developer: '',
        publisher: '',
        release_date: '',
        scores: game.scores || {
          opencritic: game.score_opencritic,
          steam_positive_pct: game.score_steam_pct,
          community: game.score_community,
          review_count: game.score_review_count
        },
        description: '',
        guide_count: game.guide_count || 0,
        code_count: game.code_count || 0,
        has_tier_list: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      return {
        games,
        meta: data.meta || data.data.meta || { page, limit, total: 0, has_next: false, has_prev: false }
      }
    }
  } catch {
    // Fallback handled in hook
  }
  return { games: [], meta: { page, limit, total: 0, has_next: false, has_prev: false } }
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<{
    platform?: Platform
    genre?: Genre
    sort: 'popular' | 'newest' | 'score' | 'name'
    search?: string
  }>({ sort: 'popular' })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadMore = useCallback(async () => {
    const currentSort = filters.sort === 'newest' ? 'latest' : filters.sort === 'score' ? 'rating' : filters.sort
    const { games: newGames, meta } = await fetchGamesPage(page + 1, INITIAL_LIMIT, currentSort)
    if (newGames.length > 0) {
      setGames(prev => [...prev, ...newGames])
      setPage(prev => prev + 1)
    }
    return meta.has_next
  }, [page, filters.sort])

  const { observeRef, isLoading, hasMore, setHasMore } = useInfiniteScroll(loadMore, {
    rootMargin: '200px'
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
    setHasMore(true)
    setIsInitialLoad(true)

    const currentSort = newFilters.sort === 'newest' ? 'latest' : newFilters.sort === 'score' ? 'rating' : newFilters.sort
    fetchGamesPage(1, INITIAL_LIMIT, currentSort).then(({ games: initialGames, meta }) => {
      setGames(initialGames)
      setHasMore(meta.has_next)
      setIsInitialLoad(false)
    })
  }

  const filteredGames = games.filter((game) => {
    if (filters.platform && !game.platforms.includes(filters.platform)) return false
    if (filters.genre && !game.genres.includes(filters.genre)) return false
    if (filters.search && !game.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  if (isInitialLoad && games.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 rounded mb-2 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }} />
          <div className="h-4 w-64 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }} />
        </div>
        <div className="h-12 rounded-lg mb-8 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="aspect-[3/4]" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/games`,
        name: 'Game Library',
        description: 'Browse our extensive collection of games with guides, redeem codes, and tier lists.',
        breadcrumb: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [{
            '@type': 'ListItem',
            position: 1,
            name: 'Games',
            item: '/games'
          }]
        }
      }} />

      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Games' }]} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Game Library
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse {filteredGames.length} games with guides, codes, and tier lists
        </p>
      </div>

      <GameFilters onFilterChange={handleFilterChange} totalGames={filteredGames.length} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div ref={observeRef} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-6 h-6 border-2 border-transparent border-t-accent rounded-full animate-spin" />
            <span>Loading more games...</span>
          </div>
        )}
        {!hasMore && filteredGames.length > 0 && (
          <span style={{ color: 'var(--text-muted)' }}>You've reached the end</span>
        )}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No games found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search</p>
        </div>
      )}
    </div>
  )
}