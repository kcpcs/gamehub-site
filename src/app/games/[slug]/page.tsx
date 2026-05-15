import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { GameDetailClient } from '@/components/games/GameDetailClient'
import { Breadcrumb } from '@/components/Breadcrumb'
import { JsonLdScript, getVideoGameSchema } from '@/components/seo/JsonLd'
import type { Platform, Genre } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const game = await db.game.findUnique({
      where: { slug },
    })

    if (game) {
      return {
        title: `${game.name} | GameHub`,
        description: game.description || `Find guides, codes, and tier lists for ${game.name} on GameHub.`,
        openGraph: {
          title: game.name,
          description: game.description || `Find guides, codes, and tier lists for ${game.name} on GameHub.`,
          type: 'website',
          images: [
            {
              url: game.cover_url,
              width: 1200,
              height: 630,
              alt: game.name,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: game.name,
          description: game.description || `Find guides, codes, and tier lists for ${game.name} on GameHub.`,
          images: [game.cover_url],
        },
      }
    }
  } catch {
    // Fall through to default metadata
  }

  // Fallback metadata
  return {
    title: 'Game Details | GameHub',
    description: 'Find guides, codes, and tier lists for your favorite games on GameHub.',
  }
}

async function getGame(slug: string) {
  try {
    const game = await db.game.findUnique({
      where: { slug },
    })
    if (!game) return null

    let platforms: string[] = []
    let genres: string[] = []
    
    try {
      platforms = typeof game.platforms === 'string' 
        ? JSON.parse(game.platforms) 
        : Array.isArray(game.platforms) 
          ? game.platforms 
          : []
    } catch {
      platforms = []
    }
    
    try {
      genres = typeof game.genres === 'string' 
        ? JSON.parse(game.genres) 
        : Array.isArray(game.genres) 
          ? game.genres 
          : []
    } catch {
      genres = []
    }

    const validPlatforms = platforms.filter((p): p is Platform => 
      ['PC', 'PS5', 'PS4', 'Xbox', 'Switch', 'Mobile', 'iOS', 'Android'].includes(p)
    )
    
    const validGenres = genres.filter((g): g is Genre => 
      ['RPG', 'FPS', 'Strategy', 'Indie', 'MMO', 'Action', 'Adventure', 'Sports', 'Racing', 'Puzzle', 'Horror', 'Simulation'].includes(g)
    )

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      cover: { url: game.cover_url, igdb_url: '' },
      screenshots: safeJsonParse(game.screenshots, []),
      platforms: validPlatforms,
      genres: validGenres,
      tags: safeJsonParse(game.tags, []),
      developer: game.developer || '',
      publisher: game.publisher || '',
      release_date: game.release_date?.toISOString() || '',
      scores: {
        opencritic: game.score_opencritic,
        steam_positive_pct: game.score_steam_pct,
        community: game.score_community,
        review_count: game.score_review_count,
      },
      score_opencritic: game.score_opencritic,
      score_steam_pct: game.score_steam_pct,
      score_community: game.score_community,
      score_review_count: game.score_review_count,
      description: game.description || '',
      guide_count: game.guide_count || 0,
      code_count: game.code_count || 0,
      has_tier_list: game.has_tier_list || false,
      created_at: game.created_at?.toISOString() || '',
      updated_at: game.updated_at?.toISOString() || '',
    }
  } catch (error) {
    console.error('Error fetching game:', error)
    return null
  }
}

function safeJsonParse<T = any>(value: any, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return defaultValue
    }
  }
  if (Array.isArray(value) || typeof value === 'object') {
    return value
  }
  return defaultValue
}

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = await getGame(slug)
  
  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Game not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The game you're looking for doesn't exist or couldn't be loaded.
        </p>
        <a href="/games" className="inline-block px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          Browse All Games
        </a>
      </div>
    )
  }

  return (
    <>
      <JsonLdScript data={getVideoGameSchema({
        name: game.name,
        slug: game.slug,
        description: game.description,
        image: game.cover?.url,
        genres: game.genres,
        platforms: game.platforms,
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: game.release_date,
      })} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Breadcrumb items={[
            { label: 'Games', href: '/games' },
            { label: game.name }
          ]} />
        </div>
        <GameDetailClient game={game} />
      </div>
    </>
  )
}
