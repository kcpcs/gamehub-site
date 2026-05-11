/**
 * IGDB API Client
 * 基于 Twitch OAuth2 认证的 IGDB v4 API 封装
 *
 * 所需环境变量:
 *   TWITCH_CLIENT_ID     — Twitch Developer Console 获取
 *   TWITCH_CLIENT_SECRET — Twitch Developer Console 获取
 *
 * 当未配置环境变量时，自动降级为 Mock 模式（返回空数据）
 * 参考文档: https://api-docs.igdb.com/
 */

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface IGDBGame {
  id: number
  name: string
  slug: string
  summary?: string
  storyline?: string
  cover?: { id: number; image_id: string; url: string }
  screenshots?: { id: number; image_id: string; url: string }[]
  platforms?: { id: number; name: string; abbreviation?: string }[]
  genres?: { id: number; name: string; slug: string }[]
  themes?: { id: number; name: string; slug: string }[]
  involved_companies?: {
    id: number
    company: { id: number; name: string }
    developer: boolean
    publisher: boolean
  }[]
  first_release_date?: number // Unix timestamp
  total_rating?: number
  total_rating_count?: number
  aggregated_rating?: number
  aggregated_rating_count?: number
  external_games?: { category: number; uid: string }[] // category 1 = Steam
  websites?: { category: number; url: string }[]
  similar_games?: number[]
}

export interface IGDBImportResult {
  igdb_id: number
  name: string
  slug: string
  cover_url: string
  screenshots: string[]
  platforms: string[]
  genres: string[]
  tags: string[]
  developer?: string
  publisher?: string
  release_date?: string
  steam_appid?: number
  score_opencritic?: number
  description?: string
}

// ─────────────────────────────────────────
// Configuration & Token Management
// ─────────────────────────────────────────

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || ''
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || ''
const IGDB_BASE_URL = 'https://api.igdb.com/v4'
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'

// IGDB image URL builder
const IGDB_IMAGE_BASE = 'https://images.igdb.com/igdb/image/upload'

type ImageSize = 't_thumb' | 't_cover_small' | 't_cover_big' | 't_1080p' | 't_720p' | 't_screenshot_big' | 't_screenshot_huge'

function igdbImageUrl(imageId: string, size: ImageSize = 't_cover_big'): string {
  return `${IGDB_IMAGE_BASE}/${size}/${imageId}.jpg`
}

// Token cache (in-memory, server-side singleton)
let cachedToken: { access_token: string; expires_at: number } | null = null

function isConfigured(): boolean {
  return !!(TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET)
}

/**
 * 获取 Twitch OAuth2 访问令牌（Client Credentials 模式）
 * 令牌缓存在内存中，过期前 5 分钟自动刷新
 */
async function getAccessToken(): Promise<string> {
  // 检查缓存的 token 是否仍有效（提前 5 分钟刷新）
  if (cachedToken && Date.now() < cachedToken.expires_at - 5 * 60 * 1000) {
    return cachedToken.access_token
  }

  const response = await fetch(TWITCH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Twitch OAuth failed (${response.status}): ${errText}`)
  }

  const data = await response.json() as { access_token: string; expires_in: number; token_type: string }

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  console.log('[IGDB] OAuth token acquired, expires in', data.expires_in, 'seconds')
  return cachedToken.access_token
}

/**
 * 向 IGDB API 发送 POST 请求（IGDB 使用 Apicalypse 查询语法）
 */
async function igdbFetch<T>(endpoint: string, body: string): Promise<T[]> {
  const token = await getAccessToken()

  const response = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`IGDB API error (${response.status}) on /${endpoint}: ${errText}`)
  }

  return response.json() as Promise<T[]>
}

// ─────────────────────────────────────────
// Platform & Genre mapping
// ─────────────────────────────────────────

const PLATFORM_MAP: Record<number, string> = {
  6: 'PC',        // PC (Windows)
  14: 'PC',       // Mac
  3: 'PC',        // Linux
  48: 'PS4',
  167: 'PS5',
  49: 'Xbox',     // Xbox One
  169: 'Xbox',    // Xbox Series X|S
  130: 'Switch',
  34: 'Android',
  39: 'iOS',
  55: 'Mobile',   // Mobile
}

const GENRE_MAP: Record<number, string> = {
  12: 'RPG',
  5: 'FPS',       // Shooter → FPS
  15: 'Strategy',
  32: 'Indie',
  36: 'MMO',      // MOBA → MMO
  31: 'Adventure',
  14: 'Sports',
  10: 'Racing',
  9: 'Puzzle',
  33: 'Horror',   // (not official IGDB, mapped from theme)
  13: 'Simulation',
  4: 'Action',    // Fighting → Action
  2: 'Action',    // Point-and-click → Adventure... keep Action
  8: 'Action',    // Platform
  11: 'Action',   // Real Time Strategy → Strategy already covered
  16: 'Action',   // Turn-based strategy
  24: 'Action',   // Tactical
  25: 'Action',   // Hack and slash
  26: 'Action',   // Quiz/Trivia
  34: 'Action',   // Visual Novel
  35: 'Action',   // Card & Board Game
}

function mapPlatforms(platforms?: { id: number; name: string; abbreviation?: string }[]): string[] {
  if (!platforms) return []
  const mapped = new Set<string>()
  for (const p of platforms) {
    const name = PLATFORM_MAP[p.id]
    if (name) mapped.add(name)
  }
  return Array.from(mapped)
}

function mapGenres(genres?: { id: number; name: string; slug: string }[]): string[] {
  if (!genres) return []
  const mapped = new Set<string>()
  for (const g of genres) {
    const name = GENRE_MAP[g.id]
    if (name) mapped.add(name)
  }
  return Array.from(mapped)
}

function extractTags(game: IGDBGame): string[] {
  const tags: string[] = []
  if (game.themes) {
    for (const t of game.themes) {
      tags.push(t.name.toLowerCase())
    }
  }
  return tags.slice(0, 10)
}

function extractSteamAppId(game: IGDBGame): number | undefined {
  if (!game.external_games) return undefined
  // category 1 = Steam
  const steam = game.external_games.find(eg => eg.category === 1)
  return steam ? parseInt(steam.uid, 10) || undefined : undefined
}

function extractDeveloper(game: IGDBGame): string | undefined {
  if (!game.involved_companies) return undefined
  const dev = game.involved_companies.find(ic => ic.developer)
  return dev?.company?.name
}

function extractPublisher(game: IGDBGame): string | undefined {
  if (!game.involved_companies) return undefined
  const pub = game.involved_companies.find(ic => ic.publisher)
  return pub?.company?.name
}

// ─────────────────────────────────────────
// Public API
// ─────────────────────────────────────────

/**
 * 搜索游戏
 * @param query 搜索关键词
 * @param limit 返回数量（默认20，最大50）
 */
export async function searchGames(query: string, limit = 20): Promise<IGDBGame[]> {
  if (!isConfigured()) {
    console.warn('[IGDB] Not configured, returning empty results')
    return []
  }

  try {
    const results = await igdbFetch<IGDBGame>('games', `
      search "${query.replace(/"/g, '\\"')}";
      fields name, slug, summary, cover.image_id, cover.url,
             platforms.name, platforms.abbreviation,
             genres.name, genres.slug,
             themes.name, themes.slug,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             first_release_date, total_rating, total_rating_count,
             aggregated_rating, external_games.category, external_games.uid,
             screenshots.image_id, screenshots.url;
      where version_parent = null;
      limit ${Math.min(limit, 50)};
    `)
    return results
  } catch (error) {
    console.error('[IGDB] searchGames error:', error)
    return []
  }
}

/**
 * 通过 IGDB ID 获取游戏详情
 */
export async function getGameById(id: number): Promise<IGDBGame | null> {
  if (!isConfigured()) {
    console.warn('[IGDB] Not configured, returning null')
    return null
  }

  try {
    const results = await igdbFetch<IGDBGame>('games', `
      fields name, slug, summary, storyline,
             cover.image_id, cover.url,
             screenshots.image_id, screenshots.url,
             platforms.id, platforms.name, platforms.abbreviation,
             genres.id, genres.name, genres.slug,
             themes.id, themes.name, themes.slug,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             first_release_date, total_rating, total_rating_count,
             aggregated_rating, aggregated_rating_count,
             external_games.category, external_games.uid,
             websites.category, websites.url,
             similar_games;
      where id = ${id};
      limit 1;
    `)
    return results[0] ?? null
  } catch (error) {
    console.error('[IGDB] getGameById error:', error)
    return null
  }
}

/**
 * 通过 slug 获取游戏
 */
export async function getGamesBySlug(slug: string): Promise<IGDBGame | null> {
  if (!isConfigured()) {
    console.warn('[IGDB] Not configured, returning null')
    return null
  }

  try {
    const results = await igdbFetch<IGDBGame>('games', `
      fields name, slug, summary, storyline,
             cover.image_id, cover.url,
             screenshots.image_id, screenshots.url,
             platforms.id, platforms.name, platforms.abbreviation,
             genres.id, genres.name, genres.slug,
             themes.id, themes.name, themes.slug,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             first_release_date, total_rating, total_rating_count,
             aggregated_rating, aggregated_rating_count,
             external_games.category, external_games.uid,
             websites.category, websites.url;
      where slug = "${slug.replace(/"/g, '\\"')}";
      limit 1;
    `)
    return results[0] ?? null
  } catch (error) {
    console.error('[IGDB] getGamesBySlug error:', error)
    return null
  }
}

/**
 * 批量导入热门游戏
 * 获取 IGDB 上评分最高/最热门的游戏，转换为数据库导入格式
 *
 * @param limit 导入数量（默认50，最大500）
 * @param offset 偏移量，用于分页
 * @param minRating 最低评分门槛（0-100）
 */
export async function importPopularGames(
  limit = 50,
  offset = 0,
  minRating = 60,
): Promise<IGDBImportResult[]> {
  if (!isConfigured()) {
    console.warn('[IGDB] Not configured, returning empty results')
    return []
  }

  const batchSize = Math.min(limit, 500)

  try {
    const games = await igdbFetch<IGDBGame>('games', `
      fields name, slug, summary,
             cover.image_id, cover.url,
             screenshots.image_id, screenshots.url,
             platforms.id, platforms.name, platforms.abbreviation,
             genres.id, genres.name, genres.slug,
             themes.id, themes.name, themes.slug,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             first_release_date, total_rating, total_rating_count,
             aggregated_rating, aggregated_rating_count,
             external_games.category, external_games.uid;
      where total_rating >= ${minRating}
        & total_rating_count >= 5
        & version_parent = null
        & cover != null;
      sort total_rating_count desc;
      limit ${batchSize};
      offset ${offset};
    `)

    console.log(`[IGDB] Fetched ${games.length} games (offset=${offset})`)

    return games.map(game => ({
      igdb_id: game.id,
      name: game.name,
      slug: game.slug,
      cover_url: game.cover?.image_id
        ? igdbImageUrl(game.cover.image_id, 't_cover_big')
        : '',
      screenshots: (game.screenshots ?? [])
        .slice(0, 6)
        .map(s => igdbImageUrl(s.image_id, 't_screenshot_big')),
      platforms: mapPlatforms(game.platforms),
      genres: mapGenres(game.genres),
      tags: extractTags(game),
      developer: extractDeveloper(game),
      publisher: extractPublisher(game),
      release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000).toISOString()
        : undefined,
      steam_appid: extractSteamAppId(game),
      score_opencritic: game.aggregated_rating
        ? Math.round(game.aggregated_rating)
        : undefined,
      description: game.summary?.slice(0, 300),
    }))
  } catch (error) {
    console.error('[IGDB] importPopularGames error:', error)
    return []
  }
}

/**
 * 获取即将发售的游戏
 * @param limit 返回数量
 * @param daysAhead 未来多少天内
 */
export async function getUpcomingGames(limit = 20, daysAhead = 90): Promise<IGDBGame[]> {
  if (!isConfigured()) return []

  const now = Math.floor(Date.now() / 1000)
  const futureDate = now + daysAhead * 24 * 60 * 60

  try {
    return await igdbFetch<IGDBGame>('games', `
      fields name, slug, summary,
             cover.image_id, cover.url,
             platforms.id, platforms.name, platforms.abbreviation,
             genres.id, genres.name, genres.slug,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             first_release_date, external_games.category, external_games.uid;
      where first_release_date >= ${now}
        & first_release_date <= ${futureDate}
        & version_parent = null
        & cover != null
        & hypes > 5;
      sort first_release_date asc;
      limit ${Math.min(limit, 50)};
    `)
  } catch (error) {
    console.error('[IGDB] getUpcomingGames error:', error)
    return []
  }
}

/**
 * 获取最近更新/有补丁的游戏
 * @param limit 返回数量
 */
export async function getRecentlyUpdatedGames(limit = 20): Promise<IGDBGame[]> {
  if (!isConfigured()) return []

  try {
    return await igdbFetch<IGDBGame>('games', `
      fields name, slug, summary,
             cover.image_id, cover.url,
             platforms.id, platforms.name,
             genres.id, genres.name, genres.slug,
             first_release_date, total_rating, total_rating_count,
             external_games.category, external_games.uid;
      where version_parent = null & cover != null;
      sort updated_at desc;
      limit ${Math.min(limit, 50)};
    `)
  } catch (error) {
    console.error('[IGDB] getRecentlyUpdatedGames error:', error)
    return []
  }
}

// ─────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────

export { igdbImageUrl, isConfigured as isIGDBConfigured, mapPlatforms, mapGenres }
