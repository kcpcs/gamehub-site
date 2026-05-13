const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const adapter = new PrismaLibSql({
  url: 'file:./dev.db'
})
const db = new PrismaClient({ adapter })

async function checkDatabase() {
  console.log('=== 检查数据库数据 ===\n')
  
  try {
    // 检查游戏数据
    const games = await db.game.findMany({ take: 2 })
    console.log('📊 游戏数据检查:')
    games.forEach(game => {
      console.log(`- ${game.name}`)
      console.log(`  platforms:`, game.platforms, typeof game.platforms)
      console.log(`  genres:`, game.genres, typeof game.genres)
      console.log(`  cover_url:`, game.cover_url)
    })
    
    // 检查文章数据
    const articles = await db.article.findMany({ take: 2 })
    console.log('\n📝 文章数据检查:')
    articles.forEach(article => {
      console.log(`- ${article.title}`)
      console.log(`  game_id:`, article.game_id)
      console.log(`  seo_keywords:`, article.seo_keywords, typeof article.seo_keywords)
    })
    
    console.log('\n✅ 数据库检查完成！')
  } catch (error) {
    console.error('❌ 检查出错:', error)
  }
  
  await db.$disconnect()
}

checkDatabase().catch(console.error)