/**
 * 快速测试 IGDB API 连通性
 * 运行: npx tsx src/lib/test-igdb.ts
 */

async function testIGDB() {
  // 加载环境变量
  const { config } = await import('dotenv')
  config({ path: '.env.local' })

  const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || ''
  const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || ''

  console.log('=== IGDB API 连通性测试 ===\n')
  console.log(`Client ID: ${TWITCH_CLIENT_ID.slice(0, 8)}...`)
  console.log(`Client Secret: ${TWITCH_CLIENT_SECRET.slice(0, 8)}...\n`)

  // Step 1: 获取 OAuth Token
  console.log('1. 获取 Twitch OAuth Token...')
  const tokenRes = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })

  if (!tokenRes.ok) {
    console.error('   ❌ Token 获取失败:', await tokenRes.text())
    process.exit(1)
  }

  const tokenData = await tokenRes.json() as { access_token: string; expires_in: number }
  console.log(`   ✅ Token 获取成功! 有效期: ${tokenData.expires_in}秒\n`)

  // Step 2: 搜索游戏
  console.log('2. 搜索游戏: "Genshin Impact"...')
  const searchRes = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'text/plain',
    },
    body: `search "Genshin Impact"; fields name, slug, cover.image_id, platforms.name, genres.name, first_release_date; limit 3;`,
  })

  if (!searchRes.ok) {
    console.error('   ❌ 搜索失败:', await searchRes.text())
    process.exit(1)
  }

  const games = await searchRes.json() as any[]
  console.log(`   ✅ 找到 ${games.length} 个结果:`)
  for (const g of games) {
    console.log(`      - ${g.name} (slug: ${g.slug})`)
    if (g.cover?.image_id) {
      console.log(`        封面: https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`)
    }
  }

  console.log('\n=== 测试完成! IGDB API 工作正常 ===')
}

testIGDB().catch(err => {
  console.error('测试失败:', err)
  process.exit(1)
})
