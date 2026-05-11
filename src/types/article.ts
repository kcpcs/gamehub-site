// ============================================================
// ARTICLE TYPES  —  READ-ONLY CONTRACT
// Do NOT modify these interfaces.
// ============================================================

export type ArticleType = 'guide' | 'news' | 'codes' | 'tierlist' | 'best' | 'patch-notes'
export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived'
export type SourceType = 'ai' | 'ugc' | 'aggregated'

export interface ArticleAuthor {
  id: string
  username: string
  avatar?: string
  level: 'reader' | 'creator' | 'verified' | 'partner'
}

export interface ArticleSEO {
  title: string         // ≤60 chars
  description: string   // ≤155 chars
  keywords: string[]
  canonical?: string
}

export interface ArticleCover {
  url: string           // R2 URL (WebP, 1200×630)
  alt: string
  credit?: string       // e.g. "Image: IGDB"
}

export interface Article {
  id: string
  slug: string
  title: string
  article_type: ArticleType
  status: ArticleStatus
  source_type: SourceType
  source_urls: string[]   // Data provenance (compliance)
  game_id?: string
  game_slug?: string
  game_name?: string
  author?: ArticleAuthor  // null = AI generated
  cover: ArticleCover
  content: string         // Markdown
  excerpt: string         // ≤200 chars, auto-generated
  read_time: number       // minutes
  seo: ArticleSEO
  affiliate_links: AffiliateLink[]
  quality_score?: number  // 0-100, AI-assigned
  view_count: number
  share_count: number
  published_at?: string   // ISO 8601
  updated_at: string
  created_at: string
}

export interface ArticleCard
  extends Pick<Article, 'id' | 'slug' | 'title' | 'article_type' | 'cover' | 'excerpt' | 'read_time' | 'game_slug' | 'game_name' | 'author' | 'published_at' | 'view_count'> {}

export interface AffiliateLink {
  partner: string         // e.g. 'green-man-gaming'
  label: string           // e.g. 'Buy on Green Man Gaming'
  url: string             // Internal redirect: /go/[partner]/[id]
  price?: string          // e.g. '$29.99'
  discount?: string       // e.g. '20% OFF'
}

export interface ArticleFilters {
  game_slug?: string
  article_type?: ArticleType
  sort?: 'latest' | 'popular' | 'updated'
  page?: number
  limit?: number
}
