'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import type { Game, CodeSource } from '@/types'
import { addToHistory } from '@/components/RecentHistory'
import { LikeButton, ShareButton } from '@/components/LikeShareButtons'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PlatformIcon } from '@/components/PlatformIcon'
import { GameDetailTabs } from '@/components/games/GameDetailTabs'

interface GameGuide {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_url: string
  view_count: number
  created_at: string
  article_type: string
}

interface GameTierList {
  id: string
  slug: string
  title: string
  version: string
  updated_at: string
}

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [tierList, setTierList] = useState<GameTierList | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameRes = await fetch(`/api/games/${slug}`)

        if (gameRes.ok) {
          const gameResponse = await gameRes.json()
          if (gameResponse.success && gameResponse.data) {
            const data = gameResponse.data
            const gameData: Game = {
              ...data,
              cover: { url: data.cover_url },
              screenshots: (data.screenshots as string[]) || [],
              platforms: (data.platforms as string[]) || [],
              genres: (data.genres as string[]) || [],
              tags: (data.tags as string[]) || [],
              scores: data.scores || { opencritic: 0, community: 0, review_count: 0 }
            }
            setGame(gameData)
            addToHistory({
              type: 'game',
              slug: data.slug,
              title: data.name,
              image_url: data.cover_url
            })
          }
        }

        const tierListRes = await fetch(`/api/tier-list/${slug}`)
        if (tierListRes.ok) {
          const tierListData = await tierListRes.json()
          if (tierListData.success && tierListData.data) {
            setTierList(tierListData.data)
          }
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const getScoreColor = (score?: number | null) => {
    if (!score) return 'var(--text-muted)'
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return 'var(--warning)'
    return 'var(--danger)'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading game details...</span>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Game not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The game you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Link
          href="/games"
          className="inline-block px-6 py-3 rounded-lg font-semibold"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          Browse All Games
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Games', href: '/games' },
          { label: game?.name || 'Loading...' }
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={game.cover.url}
              alt={game.name}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-4 mb-2">
                {game.platforms.slice(0, 3).map((platform) => (
                  <span
                    key={platform}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm"
                    style={{ color: 'white' }}
                  >
                    <PlatformIcon platform={platform} size="sm" />
                    {platform}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
              <p className="text-white/80">{game.developer || 'Unknown Developer'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-lg transition-colors hover:scale-105"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                <svg
                  className="w-6 h-6"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: isFavorite ? 'var(--accent-light)' : 'var(--text-secondary)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <ShareButton
                title={game.name}
                description={`Check out ${game.name} on GameHub!`}
              />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {game.scores?.opencritic && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <span className="text-2xl font-bold" style={{ color: getScoreColor(game.scores.opencritic) }}>
                    {game.scores.opencritic}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>OpenCritic</span>
                </div>
              )}
            </div>
          </div>

          <GameDetailTabs 
            gameSlug={game.slug}
            hasGuides={game.guide_count > 0}
            hasCodes={game.code_count > 0}
            hasTierList={game.has_tier_list}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl p-5 sticky top-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Quick Links
            </h2>
            <div className="space-y-3">
              {game.guide_count > 0 && (
                <Link
                  href="/guides"
                  className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Guides</span>
                  <span className="font-bold" style={{ color: 'var(--accent-light)' }}>{game.guide_count}</span>
                </Link>
              )}
              {game.code_count > 0 && (
                <Link
                  href={`/codes/${game.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Redeem Codes</span>
                  <span className="font-bold" style={{ color: 'var(--accent-light)' }}>{game.code_count}</span>
                </Link>
              )}
              {tierList && (
                <Link
                  href={`/tier-list/${game.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Tier List</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    {tierList.version}
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {game.tags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}
                >
                  {tag}
                </span>
              ))}
              {game.tags.length > 8 && (
                <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}>
                  +{game.tags.length - 8}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Platforms
            </h2>
            <div className="flex flex-wrap gap-2">
              {game.platforms.map((platform) => (
                <span
                  key={platform}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}
                >
                  <PlatformIcon platform={platform} size="sm" />
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
