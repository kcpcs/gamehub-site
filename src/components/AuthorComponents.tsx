'use client'

import { useState } from 'react'
import { User, Star, Award, Eye, Heart, Calendar, ExternalLink, Coffee, Check } from 'lucide-react'

interface AuthorCardProps {
  name: string
  bio: string
  avatar?: string
  level: number
  reputation: number
  articles: number
  followers: number
  joinDate: string
  socialLinks?: { twitter?: string; youtube?: string; twitch?: string }
}

export function AuthorCard({ name, bio, avatar, level, reputation, articles, followers, joinDate, socialLinks }: AuthorCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const getLevelBadge = () => {
    if (level >= 10) return { label: 'Legendary', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-400' }
    if (level >= 7) return { label: 'Expert', color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' }
    if (level >= 5) return { label: 'Pro', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' }
    if (level >= 3) return { label: 'Journeyman', color: 'from-green-500 to-emerald-500', textColor: 'text-green-400' }
    return { label: 'Beginner', color: 'from-gray-500 to-gray-600', textColor: 'text-gray-400' }
  }

  const levelBadge = getLevelBadge()

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              <User className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${levelBadge.color} shadow-lg`}>
            <Star className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r ${levelBadge.color} bg-clip-text ${levelBadge.textColor}`}>
              Level {level}
            </span>
          </div>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{bio}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <Calendar className="w-4 h-4" />
              Joined {joinDate}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[var(--border)]">
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{articles}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Articles</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{followers.toLocaleString()}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{reputation.toLocaleString()}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reputation</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
            isFollowing
              ? 'bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
              : 'bg-[var(--accent)] text-white hover:opacity-90'
          }`}
        >
          {isFollowing ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Following
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Follow
            </span>
          )}
        </button>
        <button className="p-2.5 rounded-xl hover:bg-[var(--bg-overlay)] transition-all" style={{ color: 'var(--text-secondary)' }}>
          <Coffee className="w-5 h-5" />
        </button>
      </div>

      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="flex gap-2 mt-4">
          {socialLinks.twitter && (
            <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-muted)' }}>
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          )}
          {socialLinks.youtube && (
            <a href={`https://youtube.com/@${socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-muted)' }}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
          {socialLinks.twitch && (
            <a href={`https://twitch.tv/${socialLinks.twitch}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-muted)' }}>
                <path d="M11.571 20.286c-3.127 0-5.657-2.53-5.657-5.657 0-3.127 2.53-5.657 5.657-5.657 3.127 0 5.657 2.53 5.657 5.657 0 3.127-2.53 5.657-5.657 5.657zm0-8.571c-1.618 0-2.914 1.296-2.914 2.914s1.296 2.914 2.914 2.914 2.914-1.296 2.914-2.914-1.296-2.914-2.914-2.914zm9.143 3.571c-.446 0-.804-.357-.804-.804 0-.446.358-.804.804-.804.446 0 .804.358.804.804 0 .447-.358.804-.804.804zm2.286 0c-.446 0-.804-.357-.804-.804 0-.446.358-.804.804-.804.446 0 .804.358.804.804 0 .447-.358.804-.804.804zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm10.5 12c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

interface AuthorStatsProps {
  views: number
  likes: number
  articles: number
}

export function AuthorStats({ views, likes, articles }: AuthorStatsProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {views.toLocaleString()} views
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {likes.toLocaleString()} likes
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {articles} articles
        </span>
      </div>
    </div>
  )
}

interface RelatedArticlesProps {
  articles: { id: string; slug: string; title: string; coverUrl: string; views: number }[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <ExternalLink className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        More from this author
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(article => (
          <a
            key={article.id}
            href={`/guides/${article.slug}`}
            className="flex gap-3 p-4 rounded-xl hover:bg-[var(--bg-overlay)] transition-colors"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img src={article.coverUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h4>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {article.views.toLocaleString()} views
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}