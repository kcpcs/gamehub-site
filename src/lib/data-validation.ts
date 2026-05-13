/**
 * 数据验证和修复工具
 * 确保所有导入的数据符合预期格式
 */

import { db } from '@/lib/db'

/**
 * 验证和修复数据库中的 JSON 字段
 */
export async function validateAndFixDatabase() {
  console.log('=== 开始验证和修复数据库 ===\n')
  
  let fixesApplied = 0
  
  // 检查并修复游戏数据
  const games = await db.game.findMany({
    select: { id: true, platforms: true, genres: true, screenshots: true, tags: true }
  })
  
  console.log(`检查 ${games.length} 个游戏...`)
  
  for (const game of games) {
    let needsUpdate = false
    const updateData: any = {}
    
    // 检查 platforms
    if (typeof game.platforms === 'string') {
      try {
        JSON.parse(game.platforms)
      } catch {
        updateData.platforms = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(game.platforms)) {
      updateData.platforms = '[]'
      needsUpdate = true
    }
    
    // 检查 genres
    if (typeof game.genres === 'string') {
      try {
        JSON.parse(game.genres)
      } catch {
        updateData.genres = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(game.genres)) {
      updateData.genres = '[]'
      needsUpdate = true
    }
    
    // 检查 screenshots
    if (typeof game.screenshots === 'string') {
      try {
        JSON.parse(game.screenshots)
      } catch {
        updateData.screenshots = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(game.screenshots)) {
      updateData.screenshots = '[]'
      needsUpdate = true
    }
    
    // 检查 tags
    if (typeof game.tags === 'string') {
      try {
        JSON.parse(game.tags)
      } catch {
        updateData.tags = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(game.tags)) {
      updateData.tags = '[]'
      needsUpdate = true
    }
    
    if (needsUpdate) {
      await db.game.update({
        where: { id: game.id },
        data: updateData
      })
      fixesApplied++
      console.log(`✅ 修复游戏 ${game.id}`)
    }
  }
  
  // 检查并修复文章数据
  const articles = await db.article.findMany({
    select: { id: true, seo_keywords: true, source_urls: true, affiliate_links: true }
  })
  
  console.log(`\n检查 ${articles.length} 篇文章...`)
  
  for (const article of articles) {
    let needsUpdate = false
    const updateData: any = {}
    
    // 检查 seo_keywords
    if (typeof article.seo_keywords === 'string') {
      try {
        JSON.parse(article.seo_keywords)
      } catch {
        updateData.seo_keywords = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(article.seo_keywords)) {
      updateData.seo_keywords = '[]'
      needsUpdate = true
    }
    
    // 检查 source_urls
    if (typeof article.source_urls === 'string') {
      try {
        JSON.parse(article.source_urls)
      } catch {
        updateData.source_urls = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(article.source_urls)) {
      updateData.source_urls = '[]'
      needsUpdate = true
    }
    
    // 检查 affiliate_links
    if (typeof article.affiliate_links === 'string') {
      try {
        JSON.parse(article.affiliate_links)
      } catch {
        updateData.affiliate_links = '[]'
        needsUpdate = true
      }
    } else if (!Array.isArray(article.affiliate_links)) {
      updateData.affiliate_links = '[]'
      needsUpdate = true
    }
    
    if (needsUpdate) {
      await db.article.update({
        where: { id: article.id },
        data: updateData
      })
      fixesApplied++
      console.log(`✅ 修复文章 ${article.id}`)
    }
  }
  
  console.log(`\n✅ 验证完成！修复了 ${fixesApplied} 条记录`)
  return { fixesApplied }
}

/**
 * 导出数据库数据为可移植格式
 */
export async function exportDatabase() {
  const [games, articles, codes, tierLists] = await Promise.all([
    db.game.findMany(),
    db.article.findMany(),
    db.gameCode.findMany(),
    db.tierList.findMany({ include: { entries: true } })
  ])
  
  return {
    games,
    articles,
    codes,
    tierLists,
    exportedAt: new Date().toISOString()
  }
}