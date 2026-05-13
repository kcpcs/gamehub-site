import Link from 'next/link'
import { getGameCoverUrl } from '@/lib/game-images'

interface ArticleWithGame {
  id: string
  slug: string
  title: string
  article_type: string
  excerpt: string
  read_time: number
  view_count: number
  share_count: number
  published_at: Date | null
  game?: {
    id: string
    slug: string
    name: string
    cover_url: string
  } | null
}

interface RelatedArticlesProps {
  currentSlug: string
  gameId?: string | null
  articles: ArticleWithGame[]
}

export function RelatedArticles({ currentSlug, articles }: RelatedArticlesProps) {
  const related = articles
    .filter(a => a.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Related Guides
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map(article => (
          <Link
            key={article.id}
            href={`/guides/${article.slug}`}
            className="group block p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="aspect-video rounded-lg overflow-hidden mb-3">
              <img
                src={article.game?.cover_url || getGameCoverUrl(article.game?.name || article.title)}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-light)' }}>
              {article.game?.name}
            </p>
            <h4 className="font-semibold line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h4>
            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
