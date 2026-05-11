const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter });

async function main() {
  const games = await db.game.findMany({ 
    select: { slug: true, name: true, developer: true, score_opencritic: true, cover_url: true },
    orderBy: { name: 'asc' } 
  });
  for (const g of games) {
    const hasImg = g.cover_url && !g.cover_url.includes('picsum') ? 'OK' : 'BAD';
    console.log(`${g.slug} | ${g.name} | ${g.developer || 'N/A'} | score:${g.score_opencritic || 'N/A'} | img:${hasImg}`);
  }
  console.log('---');
  console.log('Total games:', games.length);
  
  const articles = await db.article.count();
  const codes = await db.gameCode.count();
  console.log('Total articles:', articles);
  console.log('Total codes:', codes);
}

main().finally(() => db.$disconnect());
