'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type HistoryItem = {
  id: string
  title: string
  slug: string
  type: 'game' | 'guide'
  image_url?: string
  game_name?: string
  timestamp: number
}

const MAX_HISTORY = 10
const STORAGE_KEY = 'gamehub_recent_history'

export function RecentHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load history', e)
    }
  }

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setHistory([])
    } catch (e) {
      console.error('Failed to clear history', e)
    }
  }

  const removeItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (e) {
      console.error('Failed to update history', e)
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Recently Viewed
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map(item => (
          <div key={item.id} className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-opacity-10" style={{ backgroundColor: 'var(--bg-overlay)' }}>
            {item.image_url && (
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={item.type === 'game' ? `/games/${item.slug}` : `/guides/${item.slug}`}
                className="text-sm font-medium truncate hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{item.type === 'game' ? 'Game' : 'Guide'}</span>
                {item.game_name && <span>• {item.game_name}</span>}
                <span>• {formatTime(item.timestamp)}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                removeItem(item.id)
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let history: HistoryItem[] = stored ? JSON.parse(stored) : []

    const newItem: HistoryItem = {
      ...item,
      id: `${item.type}-${item.slug}`,
      timestamp: Date.now()
    }

    history = history.filter(h => h.id !== newItem.id)
    history.unshift(newItem)
    history = history.slice(0, MAX_HISTORY)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save history', e)
  }
}
