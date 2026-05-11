const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const db = new PrismaClient({ adapter });

async function checkDatabase() {
  console.log('🚀 检查数据库内容...\n');
  
  try {
    const gameCount = await db.game.count();
    const games = await db.game.findMany({ select: { id: true, name: true, slug: true } });
    console.log(`🎮 游戏数量: ${gameCount}`);
    games.forEach((g, i) => console.log(`  ${i+1}. ${g.name} (${g.slug})`));
    
    console.log('\n');
    
    const articleCount = await db.article.count();
    const articles = await db.article.findMany({ 
      select: { id: true, title: true, slug: true } 
    });
    console.log(`📚 攻略数量: ${articleCount}`);
    articles.forEach((a, i) => console.log(`  ${i+1}. ${a.title} (${a.slug})`));
    
    console.log('\n');
    
    const codeCount = await db.gameCode.count();
    const codes = await db.gameCode.findMany({ 
      include: { game: { select: { name: true } } } 
    });
    console.log(`🎁 兑换码数量: ${codeCount}`);
    codes.forEach((c, i) => console.log(`  ${i+1}. ${c.code} - ${c.game.name}`));
    
    console.log('\n');
    
    const tierListCount = await db.tierList.count();
    const tierLists = await db.tierList.findMany({ 
      include: { game: { select: { name: true } } } 
    });
    console.log(`📊 Tier List数量: ${tierListCount}`);
    tierLists.forEach((t, i) => console.log(`  ${i+1}. ${t.game.name}`));
    
    console.log('\n✅ 数据库检查完成!');
    
  } catch (error) {
    console.error('❌ 检查数据库时出错:', error);
  } finally {
    await db.$disconnect();
  }
}

checkDatabase();
