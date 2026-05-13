/**
 * 数据库验证和修复脚本
 * 运行: node scripts/validate-database.cjs
 */

const { PrismaClient } = require('@prisma/client')
const { PrismaLibsql } = require('@prisma/adapter-libsql')

const adapter = new PrismaLibsql({
  url: 'file:./dev.db'
})
const db = new PrismaClient({ adapter })

async function validateAndFixDatabase() {
  console.log('========================================')
  console.log('   GameHub 数据库验证和修复工具')
  console.log('========================================\n')
  
  let fixesApplied = 0
  const startTime = Date.now()
  
  // 1. 检查数据库连接
  console.log('1. 检查数据库连接...')
  try {
    await db.$connect()
    console.log('✅ 数据库连接正常\n')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    return
  }
  
  // 2. 检查数据计数
  console.log('2. 检查数据统计...')
  const [gameCount, articleCount, codeCount, tierListCount, aiPlayerCount] = await Promise.all([
    db.game.count(),
    db.article.count(),
    db.gameCode.count(),
    db.tierList.count(),
    db.aiPlayer.count()
  ])
  
  console.log(`   游戏: ${gameCount}`)
  console.log(`   文章: ${articleCount}`)
  console.log(`   兑换码: ${codeCount}`)
  console.log(`   排行榜: ${tierListCount}`)
  console.log(`   AI玩家: ${aiPlayerCount}\n`)
  
  // 3. 验证和修复游戏数据
  console.log('3. 验证游戏数据...')
  const games = await db.game.findMany({
    select: { id: true, name: true, platforms: true, genres: true, screenshots: true, tags: true }
  })
  
  let fixedGames = 0
  for (const game of games) {
    let needsUpdate = false
    const updateData = {}
    
    // 验证 platforms
    let validPlatforms = false
    try {
      if (typeof game.platforms === 'string') {
        JSON.parse(game.platforms)
        validPlatforms = true
      } else if (Array.isArray(game.platforms)) {
        validPlatforms = true
      }
    } catch { validPlatforms = false }
    
    if (!validPlatforms) {
      updateData.platforms = '[]'
      needsUpdate = true
    }
    
    // 验证 genres
    let validGenres = false
    try {
      if (typeof game.genres === 'string') {
        JSON.parse(game.genres)
        validGenres = true
      } else if (Array.isArray(game.genres)) {
        validGenres = true
      }
    } catch { validGenres = false }
    
    if (!validGenres) {
      updateData.genres = '[]'
      needsUpdate = true
    }
    
    // 验证 screenshots
    let validScreenshots = false
    try {
      if (typeof game.screenshots === 'string') {
        JSON.parse(game.screenshots)
        validScreenshots = true
      } else if (Array.isArray(game.screenshots)) {
        validScreenshots = true
      }
    } catch { validScreenshots = false }
    
    if (!validScreenshots) {
      updateData.screenshots = '[]'
      needsUpdate = true
    }
    
    // 验证 tags
    let validTags = false
    try {
      if (typeof game.tags === 'string') {
        JSON.parse(game.tags)
        validTags = true
      } else if (Array.isArray(game.tags)) {
        validTags = true
      }
    } catch { validTags = false }
    
    if (!validTags) {
      updateData.tags = '[]'
      needsUpdate = true
    }
    
    if (needsUpdate) {
      await db.game.update({
        where: { id: game.id },
        data: updateData
      })
      fixedGames++
      console.log(`   🔧 修复游戏: ${game.name}`)
    }
  }
  
  if (fixedGames > 0) {
    fixesApplied += fixedGames
    console.log(`   ✅ 修复了 ${fixedGames} 个游戏\n`)
  } else {
    console.log('   ✅ 所有游戏数据正常\n')
  }
  
  // 4. 验证和修复文章数据
  console.log('4. 验证文章数据...')
  const articles = await db.article.findMany({
    select: { id: true, title: true, seo_keywords: true, source_urls: true, affiliate_links: true }
  })
  
  let fixedArticles = 0
  for (const article of articles) {
    let needsUpdate = false
    const updateData = {}
    
    // 验证 seo_keywords
    let validKeywords = false
    try {
      if (typeof article.seo_keywords === 'string') {
        JSON.parse(article.seo_keywords)
        validKeywords = true
      } else if (Array.isArray(article.seo_keywords)) {
        validKeywords = true
      }
    } catch { validKeywords = false }
    
    if (!validKeywords) {
      updateData.seo_keywords = '[]'
      needsUpdate = true
    }
    
    // 验证 source_urls
    let validSourceUrls = false
    try {
      if (typeof article.source_urls === 'string') {
        JSON.parse(article.source_urls)
        validSourceUrls = true
      } else if (Array.isArray(article.source_urls)) {
        validSourceUrls = true
      }
    } catch { validSourceUrls = false }
    
    if (!validSourceUrls) {
      updateData.source_urls = '[]'
      needsUpdate = true
    }
    
    // 验证 affiliate_links
    let validAffiliateLinks = false
    try {
      if (typeof article.affiliate_links === 'string') {
        JSON.parse(article.affiliate_links)
        validAffiliateLinks = true
      } else if (Array.isArray(article.affiliate_links)) {
        validAffiliateLinks = true
      }
    } catch { validAffiliateLinks = false }
    
    if (!validAffiliateLinks) {
      updateData.affiliate_links = '[]'
      needsUpdate = true
    }
    
    if (needsUpdate) {
      await db.article.update({
        where: { id: article.id },
        data: updateData
      })
      fixedArticles++
      console.log(`   🔧 修复文章: ${article.title}`)
    }
  }
  
  if (fixedArticles > 0) {
    fixesApplied += fixedArticles
    console.log(`   ✅ 修复了 ${fixedArticles} 篇文章\n`)
  } else {
    console.log('   ✅ 所有文章数据正常\n')
  }
  
  // 5. 验证AI玩家数据
  console.log('5. 验证AI玩家数据...')
  const aiPlayers = await db.aiPlayer.findMany({
    select: { id: true, username: true, personality: true, interests: true }
  })
  
  let fixedAiPlayers = 0
  for (const player of aiPlayers) {
    let needsUpdate = false
    const updateData = {}
    
    // 验证 personality
    let validPersonality = false
    try {
      if (typeof player.personality === 'string') {
        JSON.parse(player.personality)
        validPersonality = true
      } else if (typeof player.personality === 'object') {
        validPersonality = true
      }
    } catch { validPersonality = false }
    
    if (!validPersonality) {
      updateData.personality = '{}'
      needsUpdate = true
    }
    
    // 验证 interests
    let validInterests = false
    try {
      if (typeof player.interests === 'string') {
        JSON.parse(player.interests)
        validInterests = true
      } else if (Array.isArray(player.interests)) {
        validInterests = true
      }
    } catch { validInterests = false }
    
    if (!validInterests) {
      updateData.interests = '[]'
      needsUpdate = true
    }
    
    if (needsUpdate) {
      await db.aiPlayer.update({
        where: { id: player.id },
        data: updateData
      })
      fixedAiPlayers++
      console.log(`   🔧 修复AI玩家: ${player.username}`)
    }
  }
  
  if (fixedAiPlayers > 0) {
    fixesApplied += fixedAiPlayers
    console.log(`   ✅ 修复了 ${fixedAiPlayers} 个AI玩家\n`)
  } else {
    console.log('   ✅ 所有AI玩家数据正常\n')
  }
  
  // 总结
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  
  console.log('========================================')
  console.log('   验证完成!')
  console.log('========================================')
  console.log(`   总修复数: ${fixesApplied}`)
  console.log(`   耗时: ${duration.toFixed(2)}秒`)
  
  if (fixesApplied === 0) {
    console.log('\n   🎉 数据库状态完美!')
  } else {
    console.log('\n   ✅ 数据库已修复，可以正常使用!')
  }
  console.log('========================================\n')
  
  await db.$disconnect()
}

validateAndFixDatabase().catch(console.error)