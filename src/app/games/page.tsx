import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { GamesClient } from '@/components/games/GamesClient'
import { Breadcrumb } from '@/components/Breadcrumb'
import type { Platform, Genre } from '@/types'

export const metadata: Metadata = {
  title: 'All Games | GameHub',
  description: 'Browse our complete collection of games with guides, redeem codes, and tier lists. Find all your favorite games in one place.',
  openGraph: {
    title: 'All Games | GameHub',
    description: 'Browse our complete collection of games with guides, redeem codes, and tier lists.',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/games/1200/630',
        width: 1200,
        height: 630,
        alt: 'All Games - GameHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Games | GameHub',
    description: 'Browse our complete collection of games with guides, redeem codes, and tier lists.',
    images: ['https://picsum.photos/seed/games/1200/630'],
  },
}

async function getInitialGames() {
  try {
    const games = await db.game.findMany({
      take: 24,
      orderBy: { guide_count: 'desc' },
    })
    return games.map(game => {
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
        created_at: game.created_at?.toISOString() || new Date().toISOString(),
        updated_at: game.updated_at?.toISOString() || new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return []
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

export default async function GamesPage() {
  const initialGames = await getInitialGames()
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Games' }]} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Game Library
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse games with guides, codes, and tier lists
        </p>
      </div>
      <GamesClient initialGames={initialGames} />
    </div>
  )
}
