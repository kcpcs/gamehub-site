// ============================================================
// TIER LIST TYPES  —  READ-ONLY CONTRACT
// ============================================================

export type TierGrade = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
export type TierCategory = 'character' | 'weapon' | 'class' | 'skill' | 'item'

export interface TierEntry {
  id: string
  name: string
  image_url: string
  grade: TierGrade
  vote_count: number
  avg_score: number   // 1-5
  description?: string
}

export interface TierList {
  id: string
  game_id: string
  game_slug: string
  game_name: string
  category: TierCategory
  patch_version: string   // e.g. "2.5.1"
  entries: TierEntry[]
  total_votes: number
  is_community: boolean   // true = community voted, false = AI generated
  updated_at: string
}

export interface TierVote {
  tier_list_id: string
  entry_id: string
  grade: TierGrade
}
