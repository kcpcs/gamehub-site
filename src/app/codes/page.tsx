import { db } from '@/lib/db'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'

interface GameWithCodes {
  id: string
  slug: string
  name: string
  cover_url: string
  code_count: number
}

async function getGamesWithCodes() {
  try {
    const games = await db.game.findMany({
      where: {
        code_count: {
          gt: 0
        }
      },
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true,
        code_count: true
      },
      orderBy: {
        code_count: 'desc'
      }
    })
    return games as GameWithCodes[]
  } catch (error) {
    console.error('Failed to fetch games with codes:', error)
    return []
  }
}

export default async function CodesListPage() {
  const games = await getGamesWithCodes()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Codes' }]} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Redeem Codes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Find active promo codes for your favorite games
        </p>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map(game => (
            <Link
              key={game.id}
              href={`/codes/${game.slug}`}
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={game.cover_url}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-light)' }}>
                    <span>🎁</span>
                    <span>{game.code_count} codes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-lg mb-4">No codes available yet</p>
          <p className="text-sm">Check back later for updates!</p>
        </div>
      )}
    </div>
  )
}
