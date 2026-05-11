/**
 * Steam Web API Client
 * 封装 Steam Store API 和 Steam Web API 的常用功能
 *
 * 所需环境变量:
 *   STEAM_API_KEY — 从 https://steamcommunity.com/dev/apikey 获取
 *
 * 部分接口（Store API、搜索）无需 API Key 即可使用
 * 当未配置 API Key 时，需要 Key 的接口会返回空数据
 * 参考文档: https://developer.valvesoftware.com/wiki/Steam_Web_API
 */

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface SteamGameDetails {
  steam_appid: number
  name: string
  type: string
  is_free: boolean
  detailed_description?: string
  short_description?: string
  about_the_game?: string
  header_image?: string
  capsule_image?: string
  website?: string
  developers?: string[]
  publishers?: string[]
  platforms?: { windows: boolean; mac: boolean; linux: boolean }
  categories?: { id: number; description: string }[]
  genres?: { id: string; description: string }[]
  screenshots?: { id: number; path_thumbnail: string; path_full: string }[]
  movies?: { id: number; name: string; thumbnail: string; webm: { max: string } }[]
  release_date?: { coming_soon: boolean; date: string }
  metacritic?: { score: number; url: string }
  recommendations?: { total: number }
  price_overview?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
  }
  content_descriptors?: { ids: number[]; notes: string }
}

export interface SteamSearchResult {
  appid: number
  name: string
  icon?: string
  logo?: string
}

export interface SteamPlayerCount {
  player_count: number
  result: number // 1 = success
}

export interface SteamReviewSummary {
  review_score: number         // 0-9 review score (Steam's internal scale)
  review_score_desc: string    // e.g., "Very Positive"
  total_positive: number
  total_negative: number
  total_reviews: number
  positive_percent: number     // 计算值：0-100
}

export interface SteamNewsItem {
  gid: string
  title: string
  url: string
  author: string
  contents: string
  date: number // Unix timestamp
  feedlabel: string
  feedname: string
}

// ─────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────

const STEAM_API_KEY = process.env.STEAM_API_KEY || ''
const STEAM_STORE_API = 'https://store.steampowered.com/api'
const STEAM_WEB_API = 'https://api.steampowered.com'
const STEAM_STORE_SEARCH = 'https://store.steampowered.com/search/suggest'

function hasApiKey(): boolean {
  return !!STEAM_API_KEY
}

/**
 * 带超时和重试的 fetch 封装
 */
async function steamFetch(url: string, options?: { timeout?: number; retries?: number }): Promise<Response> {
  const { timeout = 10000, retries = 2 } = options ?? {}

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)

      if (response.ok) return response

      // Rate limited — wait and retry
      if (response.status === 429 && attempt < retries) {
        const waitMs = Math.pow(2, attempt) * 1000
        console.warn(`[Steam] Rate limited, waiting ${waitMs}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitMs))
        continue
      }

      throw new Error(`Steam API error: ${response.status} ${response.statusText}`)
    } catch (error) {
      if (attempt >= retries) throw error
      // Network error — retry
      const waitMs = Math.pow(2, attempt) * 500
      await new Promise(resolve => setTimeout(resolve, waitMs))
    }
  }

  throw new Error('[Steam] All retries exhausted')
}

// ─────────────────────────────────────────
// Public API
// ─────────────────────────────────────────

/**
 * 获取 Steam 游戏详情
 * 使用 Steam Store API（无需 API Key）
 *
 * @param appId Steam App ID
 * @param language 语言代码（默认 english）
 * @param countryCode 地区代码（影响价格，默认 US）
 */
export async function getGameDetails(
  appId: number,
  language = 'english',
  countryCode = 'US',
): Promise<SteamGameDetails | null> {
  try {
    const url = `${STEAM_STORE_API}/appdetails?appids=${appId}&l=${language}&cc=${countryCode}`
    const response = await steamFetch(url)
    const data = await response.json() as Record<string, { success: boolean; data: SteamGameDetails }>

    const entry = data[String(appId)]
    if (!entry?.success || !entry.data) {
      return null
    }

    return entry.data
  } catch (error) {
    console.error(`[Steam] getGameDetails(${appId}) error:`, error)
    return null
  }
}

/**
 * 搜索 Steam 游戏
 * 使用 Steam Store 搜索建议接口（无需 API Key）
 *
 * @param query 搜索关键词
 * @param limit 最大返回数量
 */
export async function searchSteamGames(query: string, limit = 10): Promise<SteamSearchResult[]> {
  try {
    // 使用 Store Search Suggest API（返回 HTML，需要解析）
    // 改用 Steam Store API 的 storesearch 端点
    const url = `${STEAM_WEB_API}/IStoreService/GetAppList/v1/?key=${STEAM_API_KEY}&if_modified_since=0&have_description_language=english&include_games=true&include_dlc=false&include_software=false&include_hardware=false&max_results=${limit}`

    // 如果没有 API Key，使用备用的搜索方式
    if (!hasApiKey()) {
      return await searchSteamGamesFallback(query, limit)
    }

    // 使用 ISteamApps/GetAppList 的方式对关键字进行客户端过滤
    // 实际上 Steam 没有很好的官方搜索 API，通常使用 Store 前端接口
    return await searchSteamGamesFallback(query, limit)
  } catch (error) {
    console.error(`[Steam] searchSteamGames("${query}") error:`, error)
    return []
  }
}

/**
 * 备用搜索：通过 Steam Store 的 search/suggest 端点
 * 这是 Steam 商店前端用的接口，不需要 API Key
 */
async function searchSteamGamesFallback(query: string, limit = 10): Promise<SteamSearchResult[]> {
  try {
    const url = `${STEAM_STORE_SEARCH}?term=${encodeURIComponent(query)}&f=games&cc=US&realm=1&l=english&v=24328189&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&max_results=${limit}`
    const response = await steamFetch(url, { timeout: 8000 })
    const html = await response.text()

    // 从 HTML 响应中解析 app IDs 和名称
    const results: SteamSearchResult[] = []
    const appRegex = /data-ds-appid="(\d+)"[^>]*>[\s\S]*?<div class="match_name">(.*?)<\/div>/g
    let match: RegExpExecArray | null

    while ((match = appRegex.exec(html)) !== null && results.length < limit) {
      results.push({
        appid: parseInt(match[1], 10),
        name: match[2].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
      })
    }

    return results
  } catch (error) {
    console.error('[Steam] searchSteamGamesFallback error:', error)
    return []
  }
}

/**
 * 获取当前在线玩家数
 * 使用 ISteamUserStats API（无需 API Key）
 *
 * @param appId Steam App ID
 */
export async function getCurrentPlayers(appId: number): Promise<{ player_count: number }> {
  try {
    const url = `${STEAM_WEB_API}/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`
    const response = await steamFetch(url, { timeout: 5000 })
    const data = await response.json() as { response: SteamPlayerCount }

    if (data.response?.result === 1) {
      return { player_count: data.response.player_count }
    }

    return { player_count: 0 }
  } catch (error) {
    console.error(`[Steam] getCurrentPlayers(${appId}) error:`, error)
    return { player_count: 0 }
  }
}

/**
 * 获取游戏评价摘要
 * 使用 Steam Store Reviews API（无需 API Key）
 *
 * @param appId Steam App ID
 */
export async function getGameReviews(appId: number): Promise<SteamReviewSummary> {
  const empty: SteamReviewSummary = {
    review_score: 0,
    review_score_desc: 'No Reviews',
    total_positive: 0,
    total_negative: 0,
    total_reviews: 0,
    positive_percent: 0,
  }

  try {
    const url = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`
    const response = await steamFetch(url, { timeout: 8000 })
    const data = await response.json() as {
      success: number
      query_summary: {
        review_score: number
        review_score_desc: string
        total_positive: number
        total_negative: number
        total_reviews: number
        num_reviews: number
      }
    }

    if (data.success !== 1 || !data.query_summary) {
      return empty
    }

    const qs = data.query_summary
    const totalReviews = qs.total_positive + qs.total_negative
    const positivePercent = totalReviews > 0
      ? Math.round((qs.total_positive / totalReviews) * 100)
      : 0

    return {
      review_score: qs.review_score,
      review_score_desc: qs.review_score_desc,
      total_positive: qs.total_positive,
      total_negative: qs.total_negative,
      total_reviews: totalReviews,
      positive_percent: positivePercent,
    }
  } catch (error) {
    console.error(`[Steam] getGameReviews(${appId}) error:`, error)
    return empty
  }
}

/**
 * 获取游戏新闻/更新公告
 * 使用 ISteamNews API（无需 API Key）
 *
 * @param appId Steam App ID
 * @param count 获取条数（默认5）
 * @param maxLength 内容最大长度（默认300字符，0=全部）
 */
export async function getGameNews(
  appId: number,
  count = 5,
  maxLength = 300,
): Promise<SteamNewsItem[]> {
  try {
    const url = `${STEAM_WEB_API}/ISteamNews/GetNewsForApp/v2/?appid=${appId}&count=${count}&maxlength=${maxLength}&format=json`
    const response = await steamFetch(url, { timeout: 8000 })
    const data = await response.json() as {
      appnews?: { appid: number; newsitems: SteamNewsItem[] }
    }

    return data.appnews?.newsitems ?? []
  } catch (error) {
    console.error(`[Steam] getGameNews(${appId}) error:`, error)
    return []
  }
}

/**
 * 获取 Steam 全局热门游戏列表（按在线人数）
 * 需要 API Key
 *
 * @param limit 返回数量
 */
export async function getTopGames(limit = 100): Promise<{ appid: number; concurrent: number }[]> {
  if (!hasApiKey()) {
    console.warn('[Steam] API Key not configured, cannot fetch top games')
    return []
  }

  try {
    // 使用 GetMostPlayedGames 接口 (Valve 非公开但可用)
    const url = `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?key=${STEAM_API_KEY}`
    const response = await steamFetch(url, { timeout: 10000 })
    const data = await response.json() as {
      response?: { ranks: { appid: number; concurrent_in_game: number; peak_in_game: number }[] }
    }

    if (!data.response?.ranks) return []

    return data.response.ranks
      .slice(0, limit)
      .map(r => ({ appid: r.appid, concurrent: r.concurrent_in_game }))
  } catch (error) {
    console.error('[Steam] getTopGames error:', error)
    return []
  }
}

/**
 * 批量获取多个游戏的在线玩家数
 * 串行请求（Steam API 限流较严格）
 *
 * @param appIds Steam App ID 数组
 * @param delayMs 每次请求间隔（默认200ms避免限流）
 */
export async function batchGetPlayerCounts(
  appIds: number[],
  delayMs = 200,
): Promise<Map<number, number>> {
  const results = new Map<number, number>()

  for (const appId of appIds) {
    try {
      const { player_count } = await getCurrentPlayers(appId)
      results.set(appId, player_count)
    } catch {
      results.set(appId, 0)
    }

    // 限流保护
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  return results
}

/**
 * 获取 Steam 游戏的价格信息（支持批量）
 * 使用 Store API（无需 API Key）
 *
 * @param appIds 最多100个 App ID
 * @param countryCode 地区代码
 */
export async function getPrices(
  appIds: number[],
  countryCode = 'US',
): Promise<Map<number, { currency: string; final: number; discount_percent: number; final_formatted: string } | null>> {
  const results = new Map<number, { currency: string; final: number; discount_percent: number; final_formatted: string } | null>()

  // Steam Store API 一次最多查询约100个
  const batch = appIds.slice(0, 100)
  const idsStr = batch.join(',')

  try {
    const url = `${STEAM_STORE_API}/appdetails?appids=${idsStr}&cc=${countryCode}&filters=price_overview`
    const response = await steamFetch(url, { timeout: 15000 })
    const data = await response.json() as Record<string, { success: boolean; data?: { price_overview?: SteamGameDetails['price_overview'] } }>

    for (const appId of batch) {
      const entry = data[String(appId)]
      if (entry?.success && entry.data?.price_overview) {
        const p = entry.data.price_overview
        results.set(appId, {
          currency: p.currency,
          final: p.final / 100, // Convert cents to dollars
          discount_percent: p.discount_percent,
          final_formatted: p.final_formatted,
        })
      } else {
        results.set(appId, null) // Free or unavailable
      }
    }
  } catch (error) {
    console.error('[Steam] getPrices error:', error)
    for (const appId of batch) {
      results.set(appId, null)
    }
  }

  return results
}

// ─────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────

export { hasApiKey as isSteamConfigured }
