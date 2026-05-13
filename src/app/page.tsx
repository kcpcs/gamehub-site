import type { Metadata } from 'next'
import Link from 'next/link'
import { GameCard } from '@/components/games/GameCard'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { SkeletonCard, SkeletonGameCard, SkeletonBanner } from '@/components/Skeleton'
import { Search, Sparkles, BookOpen, Gift, Trophy, TrendingUp, Star, Zap, Gamepad2, Users, Clock } from 'lucide-react'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { t } from '@/lib/i18n'
import { JsonLdScript, getWebsiteSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd'

// 使用客户端组件来处理语言
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'GameHub — Ultimate Gaming Guide Hub',
  description: 'Discover the best game guides, tier lists, redeem codes, and walkthroughs for your favorite games. Updated daily.',
  openGraph: {
    title: 'GameHub - Ultimate Gaming Guide Hub',
    description: 'Live redeem codes, AI-powered tier lists, walkthroughs and patch notes - updated in real time.',
    images: [
      {
        url: 'https://picsum.photos/seed/gamehub/1200/630',
        width: 1200,
        height: 630,
        alt: 'GameHub - Ultimate Gaming Guide Hub',
      },
    ],
  },
}

export const revalidate = 60

async function getFeaturedGames() {
  try {
    const games = await db.game.findMany({
      take: 6,
      orderBy: { guide_count: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true,
        platforms: true,
        genres: true,
        score_opencritic: true,
        score_steam_pct: true,
        score_community: true,
        score_review_count: true,
        guide_count: true,
        code_count: true,
        has_tier_list: true,
        created_at: true,
        updated_at: true,
      },
    })
    return games.map(game => {
      // 正确处理 JSON 字段
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
      
      return {
        id: game.id,
        slug: game.slug,
        name: game.name,
        cover: { url: game.cover_url, igdb_url: '' },
        scores: {
          opencritic: game.score_opencritic,
          community: game.score_community,
          steam_positive_pct: game.score_steam_pct,
          review_count: game.score_review_count,
        },
        platforms: platforms,
        genres: genres,
        screenshots: [],
        tags: [],
        has_tier_list: game.has_tier_list || false,
        created_at: game.created_at?.toISOString() || new Date().toISOString(),
        updated_at: game.updated_at?.toISOString() || new Date().toISOString(),
        guide_count: game.guide_count,
        code_count: game.code_count,
      }
    })
  } catch (error) {
    console.error('Error fetching featured games:', error)
    return []
  }
}

async function getStats() {
  try {
    const [gameCount, articleCount, codeCount] = await Promise.all([
      db.game.count(),
      db.article.count(),
      db.gameCode.count(),
    ])
    return {
      games: gameCount,
      articles: articleCount,
      codes: codeCount,
    }
  } catch {
    return { games: 0, articles: 0, codes: 0 }
  }
}

async function getLatestGuides() {
  try {
    const cacheKey = 'latest_guides'
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const articles = await db.article.findMany({
      take: 3,
      where: { status: 'published' },
      orderBy: { published_at: 'desc' },
      include: {
        game: true,
      },
    })

    const guides = articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      cover_url: article.cover_url,
      game_name: article.game?.name || '',
      game_slug: article.game?.slug || '',
      read_time: article.read_time,
      view_count: article.view_count,
    }))

    await redis.set(cacheKey, JSON.stringify(guides), { ex: 300 })
    return guides
  } catch {
    return []
  }
}

async function getTrendingGames() {
  try {
    const games = await db.game.findMany({
      take: 5,
      orderBy: { guide_count: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true,
        guide_count: true,
      },
    })
    return games.map(game => ({
      id: game.id,
      slug: game.slug,
      name: game.name,
      cover_url: game.cover_url,
      cover: { url: game.cover_url, igdb_url: '' },
      guide_count: game.guide_count,
    }))
  } catch (error) {
    console.error('Error fetching trending games:', error)
    return []
  }
}

export default async function Home() {
  const [featuredGames, stats, latestGuides, trendingGames] = await Promise.all([
    getFeaturedGames(),
    getStats(),
    getLatestGuides(),
    getTrendingGames(),
  ])

  return (
    <>
      <JsonLdScript data={getWebsiteSchema()} />
      <HomeContent
        featuredGames={featuredGames}
        stats={stats}
        latestGuides={latestGuides}
        trendingGames={trendingGames}
      />
    </>
  )
}
