// 简单的数据库测试脚本
import { db } from './src/lib/db'

async function testDB() {
  try {
    console.log('Testing database connection...')
    
    // 测试各个表
    const gameCount = await db.game.count()
    const articleCount = await db.article.count()
    const codeCount = await db.gameCode.count()
    const userCount = await db.user.count()
    
    console.log('\n📊 Database Stats:')
    console.log(`Games: ${gameCount}`)
    console.log(`Articles: ${articleCount}`)
    console.log(`Codes: ${codeCount}`)
    console.log(`Users: ${userCount}`)
    
    if (gameCount > 0) {
      const games = await db.game.findMany({ take: 3 })
      console.log('\n🎮 Sample Games:')
      games.forEach(g => console.log(`- ${g.name}`))
    }
    
    console.log('\n✅ Database is working!')
  } catch (error) {
    console.error('❌ Database error:', error)
  }
}

testDB().finally(async () => {
  await db.$disconnect()
})
