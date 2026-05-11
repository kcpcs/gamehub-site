// ============================================================
// GAME TYPES  —  READ-ONLY CONTRACT
// Do NOT modify these interfaces. Both AI systems depend on them.
// ============================================================

export type Platform = 'PC' | 'PS5' | 'PS4' | 'Xbox' | 'Switch' | 'Mobile' | 'iOS' | 'Android'

export type Genre =
  | 'RPG' | 'FPS' | 'Strategy' | 'Indie' | 'MMO' | 'Action'
  | 'Adventure' | 'Sports' | 'Racing' | 'Puzzle' | 'Horror' | 'Simulation'

export interface GameCover {
  url: string          // Cloudflare R2 URL (WebP)
  igdb_url?: string    // Original IGDB URL (fallback)
  width?: number
  height?: number
}

export interface GameScore {
  opencritic?: number | null  // 0-100
  steam_positive_pct?: number | null  // 0-100
  community?: number | null   // 0-100, from user votes
  review_count?: number
}

export interface Game {
  id: string
  slug: string
  name: string
  igdb_id?: number
  steam_appid?: number
  cover: GameCover
  screenshots: string[]   // R2 URLs
  platforms: Platform[]
  genres: Genre[]
  tags: string[]
  developer?: string
  publisher?: string
  release_date?: string   // ISO 8601
  scores: GameScore
  description?: string    // AI-generated summary (≤300 chars)
  guide_count: number
  code_count: number
  has_tier_list: boolean
  last_patch_at?: string  // ISO 8601
  created_at: string
  updated_at: string
}

export interface GameCard
  extends Pick<Game, 'id' | 'slug' | 'name' | 'cover' | 'platforms' | 'genres' | 'scores' | 'guide_count' | 'code_count'> {}

export interface GameFilters {
  platform?: Platform
  genre?: Genre
  tag?: string
  sort?: 'latest' | 'popular' | 'rating' | 'guide_count'
  page?: number
  limit?: number
}
