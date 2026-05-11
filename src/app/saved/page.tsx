'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from 'react'

interface SavedItem {
  id: string
  type: 'game' | 'article'
  slug: string
  title: string
  image_url: string
  game_name?: string
  saved_at: string
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'games' | 'articles'>('all')

  useEffect(() => {
    const savedItems: SavedItem[] = [
      {
        id: '1',
        type: 'game',
        slug: 'elden-ring',
        title: 'Elden Ring',
        image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
        game_name: 'Elden Ring',
        saved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        type: 'article',
        slug: 'elden-ring-beginners-guide',
        title: 'Elden Ring Complete Beginner\'s Guide',
        image_url: 'https://picsum.photos/seed/elden-guide/800/450',
        game_name: 'Elden Ring',
        saved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'game',
        slug: 'cyberpunk-2077',
        title: 'Cyberpunk 2077',
        image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2m3y.jpg',
        game_name: 'Cyberpunk 2077',
        saved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'article',
        slug: 'valorant-agents-tier-list',
        title: 'Valorant Agent Tier List',
        image_url: 'https://picsum.photos/seed/valorant-tier/800/450',
        game_name: 'Valorant',
        saved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    setTimeout(() => {
      setItems(savedItems)
      setLoading(false)
    }, 500)
  }, [])

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'games') return item.type === 'game'
    if (filter === 'articles') return item.type === 'article'
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / 86400000)

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-8 w-32 rounded mb-8 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }} />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Saved Items
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your bookmarked games and guides
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'games', 'articles'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: filter === f ? 'var(--accent)' : 'var(--bg-surface)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              border: filter === f ? 'none' : '1px solid var(--border)',
            }}
          >
            {f === 'all' ? 'All' : f === 'games' ? 'Games' : 'Articles'}
            <span className="ml-2 opacity-70">
              ({f === 'all' ? items.length : items.filter(i => f === 'games' ? i.type === 'game' : i.type === 'article').length})
            </span>
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <Link
                href={item.type === 'game' ? `/games/${item.slug}` : `/guides/${item.slug}`}
                className="flex-shrink-0"
              >
                <div className="w-20 h-28 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded mb-2 inline-block"
                      style={{
                        backgroundColor: item.type === 'game' ? 'var(--accent)' : 'var(--success)',
                        color: 'white',
                      }}
                    >
                      {item.type === 'game' ? 'Game' : 'Guide'}
                    </span>
                    {item.game_name && (
                      <p className="text-xs mb-1" style={{ color: 'var(--accent-light)' }}>
                        {item.game_name}
                      </p>
                    )}
                    <Link href={item.type === 'game' ? `/games/${item.slug}` : `/guides/${item.slug}`}>
                      <h3
                        className="font-semibold mb-1 hover:underline"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Saved {formatDate(item.saved_at)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg transition-colors hover:bg-opacity-50"
                    style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-muted)' }}
                    aria-label="Remove from saved"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-lg font-medium mb-2">No saved items</p>
          <p className="text-sm mb-6">
            {filter === 'all'
              ? "You haven't saved any games or guides yet"
              : `No saved ${filter} found`}
          </p>
          <Link
            href={filter === 'articles' ? '/guides' : '/games'}
            className="inline-block px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Browse {filter === 'articles' ? 'Guides' : 'Games'}
          </Link>
        </div>
      )}
    </div>
  )
}