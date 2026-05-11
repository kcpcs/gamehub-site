// ============================================================
// USER TYPES  —  READ-ONLY CONTRACT
// ============================================================

export type MembershipType = 'free' | 'pro' | 'creator'
export type CreatorLevel = 'reader' | 'creator' | 'verified' | 'partner'

export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  membership: MembershipType
  creator_level: CreatorLevel
  points: number          // Redeemable points balance
  earned_usd: number      // Lifetime earnings (cents)
  pending_usd: number     // Unpaid earnings (cents)
  total_views: number
  article_count: number
  preferred_games: string[]   // game slugs
  created_at: string
}

export interface UserPublic
  extends Pick<User, 'id' | 'username' | 'avatar' | 'creator_level' | 'total_views' | 'article_count'> {}

export interface CreatorStats {
  user_id: string
  period: string          // e.g. '2026-05'
  views: number
  earnings_cents: number
  articles_published: number
  top_articles: Array<{ slug: string; title: string; views: number }>
}

export interface PointTransaction {
  id: string
  user_id: string
  amount: number          // positive = earned, negative = redeemed
  reason: string          // e.g. 'code_submitted', 'article_published'
  created_at: string
}
