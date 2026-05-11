import { db } from '@/lib/db'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'

interface GameWithTierList {
  id: string
  slug: string
  name: string
  cover_url: string
}

async function getGamesWithTierLists() {
  try {
    const games = await db.game.findMany({
      where: {
        has_tier_list: true
      },
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    return games as GameWithTierList[]
  } catch (error) {
    console.error('Failed to fetch games with tier lists:', error)
    return []
  }
}

export default async function TierListPage() {
  const games = await getGamesWithTierLists()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Tier Lists' }]} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tier Lists
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Community-voted rankings for characters, weapons, and more
        </p>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.map(game => (
            <Link
              key={game.id}
              href={`/tier-list/${game.slug}`}
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={game.cover_url || `https://picsum.photos/seed/${game.slug}/300/400`}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--accent-light)' }}>
                    <span>📊</span>
                    <span>Tier List</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-lg mb-4">No tier lists available yet</p>
          <p className="text-sm">Check back later for updates!</p>
        </div>
      )}
    </div>
  )
}