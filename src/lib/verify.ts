import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const games = await prisma.game.findMany()
  const articles = await prisma.article.findMany()
  const codes = await prisma.gameCode.findMany()
  
  console.log('=== Database Statistics ===')
  console.log(`Games: ${games.length}`)
  console.log(`Articles: ${articles.length}`)
  console.log(`Codes: ${codes.length}`)
  console.log('')
  console.log('Games:')
  games.forEach(g => console.log(`  - ${g.name} (${g.slug})`))
  
  await prisma.$disconnect()
}

main()