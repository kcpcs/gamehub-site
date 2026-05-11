import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

dotenv.config({ path: '.env.local' })

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const db = new PrismaClient({ adapter })

async function checkDatabase() {
  console.log('📊 GameHub 数据库内容检查')
  console.log('=' .repeat(60))

  const [games, articles, codes, tierLists, comments] = await Promise.all([
    db.game.findMany(),
    db.article.findMany({ include: { game: true } }),
    db.gameCode.findMany({ include: { game: true } }),
    db.tierList.findMany({ include: { entries: true } }),
    db.comment.findMany(),
  ])

  console.log(`🎮 游戏数量: ${games.length}`)
  console.log(`📖 攻略文章: ${articles.length}`)
  console.log(`🎁 兑换码: ${codes.length}`)
  console.log(`📊 Tier List: ${tierLists.length}`)
  console.log(`💬 评论: ${comments.length}`)

  console.log('\n📋 游戏列表:')
  games.forEach((g, i) => {
    console.log(`  ${i + 1}. ${g.name} (攻略: ${g.guide_count || 0})`)
  })

  console.log('\n📋 攻略文章列表:')
  articles.forEach((a, i) => {
    console.log(`  ${i + 1}. ${a.title} (游戏: ${a.game?.name || 'N/A'})`)
    console.log(`     摘要: ${a.excerpt?.substring(0, 50)}...`)
  })

  console.log('\n📋 Tier List列表:')
  tierLists.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.game_id} - ${t.category} (${t.entries.length}个条目)`)
  })

  console.log('\n✅ 数据库检查完成!')

  await db.$disconnect()
}

checkDatabase().catch(console.error)
