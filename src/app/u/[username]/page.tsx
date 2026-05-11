'use client'

import { useState, useEffect, use } from 'react'
import type { User, Article } from '@/types'

interface UserProfile {
  id: string
  username: string
  avatar?: string
  bio?: string
  creator_level?: string
  article_count: number
  follower_count: number
  created_at: string
}

interface UserArticles {
  guides: Article[]
  tier_lists: Article[]
  codes: Article[]
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [articles, setArticles] = useState<UserArticles | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'guides' | 'tier_lists' | 'codes'>('guides')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${username}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const response = await res.json()
        if (response.success && response.data) {
          setUser(response.data.user)
          setArticles(response.data.articles)
          setLoading(false)
          return
        }
      } catch {
        // Fallback to mock data
      }

      const mockUser: UserProfile = {
        id: '1',
        username: username,
        avatar: undefined,
        bio: 'Passionate gamer and content creator sharing the best game guides and codes.',
        creator_level: 'verified',
        article_count: 12,
        follower_count: 1250,
        created_at: '2025-01-15T00:00:00Z'
      }

      const mockArticles: UserArticles = {
        guides: [
          {
            id: '1',
            slug: 'elden-ring-complete-guide',
            title: 'Elden Ring Complete Beginner\'s Guide',
            article_type: 'guide',
            status: 'published',
            source_type: 'ai',
            source_urls: [],
            game_id: '1',
            game_slug: 'elden-ring',
            game_name: 'Elden Ring',
            cover: { url: 'https://picsum.photos/seed/elden-guide/800/450', alt: 'Elden Ring Guide' },
            content: '',
            excerpt: 'Master Elden Ring with our comprehensive guide covering all boss fights and secrets.',
            read_time: 25,
            seo: { title: '', description: '', keywords: [] },
            affiliate_links: [],
            view_count: 45000,
            share_count: 1200,
            published_at: '2026-04-15T10:00:00Z',
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            slug: 'cyberpunk-build-guide',
            title: 'Best Cyberpunk 2077 Builds for 2026',
            article_type: 'guide',
            status: 'published',
            source_type: 'ai',
            source_urls: [],
            game_id: '2',
            game_slug: 'cyberpunk-2077',
            game_name: 'Cyberpunk 2077',
            cover: { url: 'https://picsum.photos/seed/cyberpunk-build/800/450', alt: 'Cyberpunk Build Guide' },
            content: '',
            excerpt: 'Discover the most powerful builds for Cyberpunk 2077 in our detailed guide.',
            read_time: 18,
            seo: { title: '', description: '', keywords: [] },
            affiliate_links: [],
            view_count: 32000,
            share_count: 890,
            published_at: '2026-04-10T10:00:00Z',
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        ],
        tier_lists: [],
        codes: []
      }

      setUser(mockUser)
      setArticles(mockArticles)
      setLoading(false)
    }

    fetchUser()
  }, [username])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    )
  }

  const tabContent = {
    guides: articles?.guides || [],
    tier_lists: articles?.tier_lists || [],
    codes: articles?.codes || []
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-sm hover:underline" style={{ color: 'var(--accent-light)' }}>
          ← Back to Home
        </a>
      </div>

      <div className="rounded-xl p-8 mb-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: 'var(--accent)' }}>
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {user.username}
              </h1>
              {user.creator_level === 'verified' && (
                <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                  ✓ Verified
                </span>
              )}
            </div>
            {user.bio && (
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                {user.bio}
              </p>
            )}
            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>{user.article_count}</strong> Articles</span>
              <span><strong style={{ color: 'var(--text-primary)' }}>{user.follower_count}</strong> Followers</span>
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {(['guides', 'tier_lists', 'codes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 font-medium transition-colors relative"
              style={{ 
                color: activeTab === tab ? 'var(--accent-light)' : 'var(--text-secondary)',
              }}
            >
              {tab === 'guides' ? 'Guides' : tab === 'tier_lists' ? 'Tier Lists' : 'Codes'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--accent-light)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabContent[activeTab].length > 0 ? (
          tabContent[activeTab].map((article) => (
            <a
              key={article.id}
              href={`/guides/${article.slug}`}
              className="group rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.cover.url}
                  alt={article.cover.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                {article.game_name && (
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--accent-light)' }}>
                    {article.game_name}
                  </p>
                )}
                <h3 className="font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {article.title}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {article.excerpt}
                </p>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full text-center py-12" style={{ color: 'var(--text-muted)' }}>
            No {activeTab.replace('_', ' ')} yet
          </div>
        )}
      </div>
    </div>
  )
}