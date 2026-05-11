import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const slugs = await prisma.game.findMany({ select: { slug: true } })
  const counts: Record<string, number> = {}
  slugs.forEach(s => counts[s.slug] = (counts[s.slug] || 0) + 1)
  const duplicates = Object.entries(counts).filter(([,v]) => v > 1)
  console.log('Duplicate slugs:', duplicates)
  await prisma.$disconnect()
}

main()