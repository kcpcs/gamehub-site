'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Guide {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_url: string
  view_count: number
  created_at: string
}

interface GameGuideListProps {
  gameSlug: string
}

export function GameGuideList({ gameSlug }: GameGuideListProps) {
  const { t } = useLanguage()
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch(`/api/guides?game_slug=${gameSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setGuides(data.data.articles || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch guides:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [gameSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>{t('no_guides_available')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {guides.map((guide) => (
        <Link
          key={guide.id}
          href={`/guides/${guide.slug}`}
          className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-opacity-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <img
            src={guide.cover_url}
            alt={guide.title}
            className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-1 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
              {guide.title}
            </h4>
            <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {guide.excerpt}
            </p>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {guide.view_count.toLocaleString()} views
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
