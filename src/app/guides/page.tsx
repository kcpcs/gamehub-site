import { db } from '@/lib/db'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Clock, Eye, ThumbsUp, Tag, Sparkles } from 'lucide-react'
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
  quality_score: number
  game: {
    id: string
    slug: string
    name: string
    cover_url: string
  } | null
}

const gameCovers: Record<string, string> = {
  'genshin-impact': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=450&fit=crop',
  'valorant': 'https://images.unsplash.com/photo-1632581161548-f53c25988b48?w=800&h=450&fit=crop',
  'league-of-legends': 'https://images.unsplash.com/photo-1551632436-960106b58617?w=800&h=450&fit=crop',
  'apex-legends': 'https://images.unsplash.com/photo-1611605698335-5b81948d5315?w=800&h=450&fit=crop',
  'minecraft': 'https://images.unsplash.com/photo-1622182371017-99b005124524?w=800&h=450&fit=crop',
  'elden-ring': 'https://images.unsplash.com/photo-1649337758657-90740969c504?w=800&h=450&fit=crop',
  'fortnite': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=450&fit=crop',
  'honkai-star-rail': 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=450&fit=crop',
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-green-500/20 text-green-400' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-500/20 text-yellow-400' },
  expert: { label: 'Expert', color: 'bg-red-500/20 text-red-400' },
}

async function getArticles() {
  try {
    const articles = await db.article.findMany({
      where: { status: 'published' },
      include: {
        game: {
          select: { id: true, slug: true, name: true, cover_url: true },
        },
      },
      orderBy: { view_count: 'desc' },
    })
    return articles as ArticleWithGame[]
  } catch {
    return []
  }
}

export default async function GuidesPage() {
  const articles = await getArticles()

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; bg: string }> = {
      guide: { label: 'Guide', bg: 'var(--accent)' },
      tierlist: { label: 'Tier List', bg: 'var(--success)' },
      news: { label: 'News', bg: 'var(--info)' },
      'patch-notes': { label: 'Patch Notes', bg: 'var(--warning)' },
    }
    return badges[type] || { label: type, bg: 'var(--text-muted)' }
  }

  const gameTags = ['All', 'Genshin Impact', 'Valorant', 'League of Legends', 'Apex Legends', 'Minecraft']
  const typeTags = ['All', 'Guide', 'Tier List', 'News', 'Patch Notes']

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Guides' }]} />
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Game Guides
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Master your favorite games with expert guides, tips, and strategies
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {articles.length} guides available
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filter by Game:</span>
            </div>
            {gameTags.map(tag => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tag === 'All'
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30'
                    : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Type:</span>
            </div>
            {typeTags.map(tag => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tag === 'All'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)]'
                    : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
              const badge = getTypeBadge(article.article_type)
              const coverUrl = article.game?.cover_url || gameCovers[article.game?.slug || ''] || getGameCoverUrl(article.title)
              
              return (
                <Link
                  key={article.id}
                  href={`/guides/${article.slug}`}
                  className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={coverUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-semibold uppercase backdrop-blur-sm"
                        style={{ backgroundColor: badge.bg, color: 'white' }}
                      >
                        {badge.label}
                      </span>
                      {article.quality_score >= 90 && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase backdrop-blur-sm bg-yellow-500/90 text-black">
                          Editor's Pick
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      {article.game?.name && (
                        <span className="inline-block text-xs font-medium px-2 py-1 rounded-md mb-2" style={{ backgroundColor: 'rgba(139, 92, 246, 0.9)', color: 'white' }}>
                          {article.game.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.read_time} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.view_count.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <ThumbsUp className="w-4 h-4" />
                        {article.share_count}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(article.published_at)}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyLabels['intermediate']?.color || 'bg-gray-500/20 text-gray-400'}`}>
                        Intermediate
                      </span>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="h-1" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                      <div 
                        className="h-full rounded-b-2xl transition-all duration-1000 group-hover:w-full"
                        style={{ width: `${article.quality_score}%`, backgroundColor: 'var(--accent)' }}
                      />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <Tag className="w-8 h-8" />
            </div>
            <p className="text-lg mb-4">No guides available yet</p>
            <p className="text-sm">Check back later for expert guides!</p>
          </div>
        )}
      </div>
    </div>
  )
}