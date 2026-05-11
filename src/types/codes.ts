// ============================================================
// CODES (Redeem Codes) TYPES  —  READ-ONLY CONTRACT
// ============================================================

export type CodeStatus = 'active' | 'expired' | 'unverified'
export type CodeSource = 'discord' | 'reddit' | 'official' | 'twitter' | 'user'

export interface GameCode {
  id: string
  code: string
  game_id: string
  game_slug: string
  game_name: string
  reward_desc: string     // e.g. "500 Gold + 3 Day XP Boost"
  status: CodeStatus
  source: CodeSource
  source_url?: string     // Original source link
  expires_at?: string     // ISO 8601, null = no expiry
  verified_at: string     // Last verified ISO 8601
  submitted_by?: string   // user id, null = bot auto-detected
  created_at: string
}

export interface CodesPageData {
  game_slug: string
  game_name: string
  game_cover: string
  active_codes: GameCode[]
  expired_codes: GameCode[]
  last_updated: string
  last_checked?: string
}

export interface CodeSubmission {
  code: string
  game_slug: string
  reward_desc: string
  source_url?: string
}
