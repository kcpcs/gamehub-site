/**
 * 通用数据处理工具
 * 用于正确处理 Prisma 返回的 JSON 字段等数据格式问题
 */

/**
 * 安全解析 JSON 字段
 */
export function safeJsonParse<T = unknown>(value: unknown, defaultValue: T): T {
  if (value === null || value === undefined) {
    return defaultValue
  }
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return defaultValue
    }
  }
  
  if (Array.isArray(value)) {
    return value as unknown as T
  }
  
  return defaultValue
}

/**
 * 处理游戏数据，确保 JSON 字段正确解析
 */
export function processGameData(game: any) {
  const platforms = safeJsonParse<string[]>(game.platforms, [])
  const genres = safeJsonParse<string[]>(game.genres, [])
  const screenshots = safeJsonParse<string[]>(game.screenshots, [])
  const tags = safeJsonParse<string[]>(game.tags, [])
  
  return {
    id: game.id,
    slug: game.slug,
    name: game.name,
    cover_url: game.cover_url,
    cover: { 
      url: game.cover_url, 
      igdb_url: '' 
    },
    platforms: platforms,
    genres: genres,
    screenshots: screenshots,
    tags: tags,
    developer: game.developer || '',
    publisher: game.publisher || '',
    release_date: game.release_date ? new Date(game.release_date).toISOString() : '',
    score_opencritic: game.score_opencritic,
    score_steam_pct: game.score_steam_pct,
    score_community: game.score_community,
    score_review_count: game.score_review_count,
    scores: {
      opencritic: game.score_opencritic || 0,
      steam_positive_pct: game.score_steam_pct || 0,
      community: game.score_community || 0,
      review_count: game.score_review_count || 0
    },
    description: game.description || '',
    guide_count: game.guide_count || 0,
    code_count: game.code_count || 0,
    has_tier_list: game.has_tier_list || false,
    created_at: game.created_at ? new Date(game.created_at).toISOString() : new Date().toISOString(),
    updated_at: game.updated_at ? new Date(game.updated_at).toISOString() : new Date().toISOString(),
  }
}

/**
 * 处理文章数据
 */
export function processArticleData(article: any) {
  const seo_keywords = safeJsonParse<string[]>(article.seo_keywords, [])
  const source_urls = safeJsonParse<string[]>(article.source_urls, [])
  const affiliate_links = safeJsonParse<string[]>(article.affiliate_links, [])
  
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    article_type: article.article_type,
    status: article.status,
    source_type: article.source_type,
    excerpt: article.excerpt,
    content: article.content,
    cover_url: article.cover_url,
    cover_alt: article.cover_alt,
    cover_credit: article.cover_credit,
    read_time: article.read_time || 5,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    seo_keywords: seo_keywords,
    canonical: article.canonical,
    source_urls: source_urls,
    affiliate_links: affiliate_links,
    quality_score: article.quality_score,
    view_count: article.view_count || 0,
    share_count: article.share_count || 0,
    published_at: article.published_at ? new Date(article.published_at).toISOString() : null,
    game_id: article.game_id,
    game: article.game ? processGameData(article.game) : null,
    author_id: article.author_id,
    author: article.author,
    created_at: article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString(),
    updated_at: article.updated_at ? new Date(article.updated_at).toISOString() : new Date().toISOString(),
  }
}

/**
 * 处理兑换码数据
 */
export function processGameCodeData(code: any) {
  return {
    id: code.id,
    code: code.code,
    game_id: code.game_id,
    reward_desc: code.reward_desc,
    status: code.status,
    source: code.source,
    source_url: code.source_url,
    expires_at: code.expires_at ? new Date(code.expires_at).toISOString() : null,
    verified_at: code.verified_at ? new Date(code.verified_at).toISOString() : null,
    submitted_by_id: code.submitted_by_id,
    submitted_by: code.submitted_by,
    created_at: code.created_at ? new Date(code.created_at).toISOString() : new Date().toISOString(),
  }
}