import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

dotenv.config({ path: '.env.local' })

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

function generateCode(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const sources = ['discord', 'reddit', 'official']

const gamesRewardMap = {
  'Genshin Impact': ['Primogems x 100', 'Mora x 50000', 'Hero\'s Wit x 10', 'Mystic Enhancement Ore x 5', 'Free Character Trial'],
  'Roblox': ['Robux x 500', 'Free Item', 'Premium Trial', 'Event Coins x 1000', 'Exclusive Avatar'],
  'Fortnite': ['V-Bucks x 1000', 'Outfit', 'Emote', 'Glider', 'Pickaxe'],
  'Valorant': ['Radianite Points x 50', 'Agent Contract XP', 'Battle Pass Tier', 'Free Weapon Skin', 'Spray'],
  'Minecraft': ['Minecoins x 300', 'Marketplace Item', 'Skin Pack', 'Texture Pack', 'Map'],
}

function getRandomReward(gameName) {
  const rewards = gamesRewardMap[gameName] || ['Gold x 1000', 'Premium Currency x 50', 'Rare Item', 'Exp Boost', 'Cosmetic Item']
  return rewards[Math.floor(Math.random() * rewards.length)]
}

function getRandomSource() {
  return sources[Math.floor(Math.random() * sources.length)]
}

async function createGameCodes() {
  console.log('🚀 开始生成游戏兑换码')
  console.log('='.repeat(60))

  try {
    const games = await prisma.game.findMany({
      take: 8,
      select: { id: true, slug: true, name: true }
    })

    let createdCount = 0

    for (const game of games) {
      console.log(`\n🎮 处理游戏: ${game.name}`)
      
      const codesToCreate = Math.floor(Math.random() * 5) + 3

      for (let i = 0; i < codesToCreate; i++) {
        const code = generateCode()
        const reward = getRandomReward(game.name)
        const source = getRandomSource()

        try {
          const existing = await prisma.gameCode.findFirst({
            where: { game_id: game.id, code: code }
          })

          if (existing) {
            console.log(`⚠️ 兑换码已存在，跳过`)
            continue
          }

          await prisma.gameCode.create({
            data: {
              game_id: game.id,
              code: code,
              reward_desc: reward,
              status: 'active',
              source: source,
              expires_at: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            }
          })

          createdCount++
          console.log(`✅ 创建兑换码: ${code} - ${reward}`)
        } catch (error) {
          console.log(`❌ 创建失败: ${error.message}`)
        }
      }

      await prisma.game.update({
        where: { id: game.id },
        data: { code_count: { increment: codesToCreate } }
      })
    }

    console.log('\n' + '='.repeat(60))
    console.log(`📝 兑换码生成完成！`)
    console.log(`✅ 新创建: ${createdCount} 个兑换码`)

  } catch (error) {
    console.error('❌ 主流程失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createGameCodes().catch(console.error)