const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
require('dotenv').config()

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const db = new PrismaClient({ adapter })

async function main() {
  try {
    const count = await db.aIPlayer.count()
    console.log(`Total AI players: ${count}`)
    
    const pendingReviews = await db.aIContentReviewQueue.count({
      where: { status: 'pending' }
    })
    console.log(`Pending reviews: ${pendingReviews}`)
    
    await db.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
