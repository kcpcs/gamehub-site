import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { TierListClient } from '@/components/tierlist/TierListClient'
import { Breadcrumb } from '@/components/Breadcrumb'

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game: gameSlug } = await params
  
  try {
    const game = await db.game.findUnique({
      where: { slug: gameSlug },
    })

    if (game) {
      return {
        title: `${game.name} Tier List | GameHub`,
        description: `Community-voted tier list for ${game.name}. Find the best characters, weapons, and more rankings.`,
        openGraph: {
          title: `${game.name} Tier List`,
          description: `Community-voted tier list for ${game.name}. Find the best characters, weapons, and more rankings.`,
          type: 'website',
          images: [
            {
              url: game.cover_url,
              width: 1200,
              height: 630,
              alt: `${game.name} Tier List`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${game.name} Tier List`,
          description: `Community-voted tier list for ${game.name}. Find the best characters, weapons, and more rankings.`,
          images: [game.cover_url],
        },
      }
    }
  } catch {
    // Fall through to default metadata
  }

  // Fallback metadata
  return {
    title: 'Tier List | GameHub',
    description: 'Community-voted tier lists for your favorite games on GameHub.',
  }
}

async function getGame(gameSlug: string) {
  try {
    const game = await db.game.findUnique({
      where: { slug: gameSlug },
    })
    if (!game) return null

    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      cover_url: game.cover_url,
    }
  } catch (error) {
    console.error('Error fetching game:', error)
    return null
  }
}

export default async function TierListPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: gameSlug } = await params
  const game = await getGame(gameSlug)
  
  if (!game) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Game not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The game you're looking for doesn't exist or couldn't be loaded.
        </p>
        <a href="/tier-list" className="inline-block px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          Browse All Tier Lists
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        <a href="/" className="hover:text-[var(--accent-light)]">Home</a>
        <span>/</span>
        <a href="/games" className="hover:text-[var(--accent-light)]">Games</a>
        <span>/</span>
        <a href={`/games/${game.slug}`} className="hover:text-[var(--accent-light)]">
          {game.name}
        </a>
        <span>/</span>
        <span>Tier List</span>
      </nav>
      
      <TierListClient game={game} />
    </div>
  )
}
