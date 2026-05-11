'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'

interface FavoriteButtonProps {
  itemId: string
  itemType: 'game' | 'article' | 'code'
  itemTitle: string
  itemImage?: string
  initialFavorited?: boolean
}

const FAVORITES_KEY = 'gamehub_favorites'

interface FavoriteItem {
  id: string
  type: 'game' | 'article' | 'code'
  title: string
  image?: string
  addedAt: string
}

export function FavoriteButton({
  itemId,
  itemType,
  itemTitle,
  itemImage,
  initialFavorited = false
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const favorites = getFavorites()
    const exists = favorites.some(f => f.id === `${itemType}_${itemId}`)
    setIsFavorited(exists)
  }, [itemId, itemType])

  const getFavorites = (): FavoriteItem[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveFavorites = (favorites: FavoriteItem[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }

  const toggleFavorite = () => {
    if (isLoading) return

    setIsLoading(true)

    const favorites = getFavorites()
    const favoriteKey = `${itemType}_${itemId}`

    if (isFavorited) {
      const updated = favorites.filter(f => f.id !== favoriteKey)
      saveFavorites(updated)
      setIsFavorited(false)
    } else {
      const newFavorite: FavoriteItem = {
        id: favoriteKey,
        type: itemType,
        title: itemTitle,
        image: itemImage,
        addedAt: new Date().toISOString()
      }
      favorites.push(newFavorite)
      saveFavorites(favorites)
      setIsFavorited(true)
    }

    setTimeout(() => setIsLoading(false), 300)
  }

  if (!mounted) {
    return (
      <button
        className="p-3 rounded-xl transition-all duration-300"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        disabled
      >
        <Heart size={20} style={{ color: 'var(--text-muted)' }} />
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="p-3 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
      style={{
        backgroundColor: isFavorited ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
        border: `1px solid ${isFavorited ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
      }}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      ) : (
        <Heart
          size={20}
          fill={isFavorited ? 'currentColor' : 'none'}
          style={{ color: isFavorited ? '#ef4444' : 'var(--text-secondary)' }}
        />
      )}
    </button>
  )
}

export function getFavoritesList(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isFavorited(itemId: string, itemType: 'game' | 'article' | 'code'): boolean {
  const favorites = getFavoritesList()
  return favorites.some(f => f.id === `${itemType}_${itemId}`)
}
