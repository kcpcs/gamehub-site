import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { CodesClient } from '@/components/codes/CodesClient'

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const { game: gameSlug } = await params
  
  try {
    const game = await db.game.findUnique({
      where: { slug: gameSlug },
    })

    if (game) {
      return {
        title: `${game.name} Redeem Codes | GameHub`,
        description: `Get active redeem codes and free rewards for ${game.name} on GameHub. Updated daily with verified codes.`,
        openGraph: {
          title: `${game.name} Redeem Codes`,
          description: `Get active redeem codes and free rewards for ${game.name} on GameHub. Updated daily with verified codes.`,
          type: 'website',
          images: [
            {
              url: game.cover_url,
              width: 1200,
              height: 630,
              alt: `${game.name} Codes`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${game.name} Redeem Codes`,
          description: `Get active redeem codes and free rewards for ${game.name} on GameHub.`,
          images: [game.cover_url],
        },
      }
    }
  } catch {
    // Fall through to default metadata
  }

  // Fallback metadata
  return {
    title: 'Redeem Codes | GameHub',
    description: 'Get active redeem codes and free rewards for your favorite games on GameHub.',
  }
}

async function getGameAndCodes(gameSlug: string) {
  try {
    const game = await db.game.findUnique({
      where: { slug: gameSlug },
      include: {
        codes: {
          orderBy: { created_at: 'desc' },
        },
      },
    })

    if (!game) return { game: null, codes: [] }

    const activeCodes = game.codes.filter(code => code.status === 'active').map(code => ({
      ...code,
      game_slug: game.slug,
      game_name: game.name,
      created_at: code.created_at.toISOString(),
      expires_at: code.expires_at?.toISOString(),
      verified_at: code.verified_at.toISOString(),
      source_url: code.source_url || undefined,
    }))
    const expiredCodes = game.codes.filter(code => code.status === 'expired').map(code => ({
      ...code,
      game_slug: game.slug,
      game_name: game.name,
      created_at: code.created_at.toISOString(),
      expires_at: code.expires_at?.toISOString(),
      verified_at: code.verified_at.toISOString(),
      source_url: code.source_url || undefined,
    }))

    return {
      game: {
        slug: game.slug,
        name: game.name,
        cover_url: game.cover_url,
      },
      codes: {
        active: activeCodes,
        expired: expiredCodes,
      },
    }
  } catch (error) {
    console.error('Error fetching game and codes:', error)
    return { game: null, codes: { active: [], expired: [] } }
  }
}

export default async function CodesPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: gameSlug } = await params
  const { game, codes } = await getGameAndCodes(gameSlug)
  
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).replace(/\u200E/g, '')

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Game not found
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          The game you're looking for doesn't exist or couldn't be loaded.
        </p>
        <a href="/codes" className="inline-block px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          Browse All Codes
        </a>
      </div>
    )
  }

  return (
    <CodesClient 
      game={game}
      codes={codes}
      currentMonthYear={currentMonthYear}
    />
  )
}
