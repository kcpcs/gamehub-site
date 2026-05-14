const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
require('dotenv').config()

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const db = new PrismaClient({ adapter })

async function main() {
  console.log('Creating test AI players...')
  
  const testPlayers = [
    {
      username: 'TestPlayer1',
      email: 'test1@gamehub.ai',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestPlayer1',
      age: 25,
      occupation: 'Gamer',
      bio: 'Test player for AI compliance testing',
      region: 'North America',
      personality: JSON.stringify({ tone: 'friendly', traits: ['test', 'player'] }),
      interests: JSON.stringify(['gaming', 'test']),
      activity_level: 0.5,
      status: 'active',
      joined_at_simulated: new Date('2024-01-01'),
      follower_ids: JSON.stringify([]),
    },
    {
      username: 'TestPlayer2',
      email: 'test2@gamehub.ai',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestPlayer2',
      age: 30,
      occupation: 'Content Creator',
      bio: 'Second test player',
      region: 'Europe',
      personality: JSON.stringify({ tone: 'professional', traits: ['test', 'creator'] }),
      interests: JSON.stringify(['gaming', 'content']),
      activity_level: 0.7,
      status: 'active',
      joined_at_simulated: new Date('2024-06-01'),
      follower_ids: JSON.stringify([]),
    },
  ]

  for (const player of testPlayers) {
    try {
      await db.aIPlayer.create({ data: player })
      console.log(`Created: ${player.username}`)
    } catch (e) {
      console.log(`Skipped ${player.username}: ${e.message}`)
    }
  }

  const count = await db.aIPlayer.count()
  console.log(`Total AI players: ${count}`)
  
  await db.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
