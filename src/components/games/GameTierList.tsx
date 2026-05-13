'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface GameTierListProps {
  gameSlug: string
}

export function GameTierList({ gameSlug }: GameTierListProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTierList = async () => {
      try {
        const response = await fetch(`/api/tierlist/${gameSlug}`)
        if (response.ok) {
          await response.json()
        }
      } catch (error) {
        console.error('Failed to fetch tier list:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTierList()
  }, [gameSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
        Tier list coming soon!
      </p>
      <Link
        href={`/tierlist/${gameSlug}`}
        className="inline-block px-6 py-3 rounded-lg font-semibold"
        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
      >
        View Full Tier List
      </Link>
    </div>
  )
}
