const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Verifying database schema...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if new tables exist
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `;
    console.log('\n📊 Existing tables:');
    tables.forEach(t => console.log(`  - ${t.name}`));
    
    // Check for our new tables
    const newTables = ['GameRating', 'Notification', 'Achievement', 'UserAchievement', 'CommentVote'];
    console.log('\n🔍 Checking for new tables:');
    for (const table of newTables) {
      const exists = tables.some(t => t.name === table);
      console.log(`  ${table}: ${exists ? '✅' : '❌'}`);
    }
    
    // Check Comment table has vote_score
    console.log('\n🔍 Checking Comment table schema:');
    const commentColumns = await prisma.$queryRaw`
      PRAGMA table_info(Comment)
    `;
    const hasVoteScore = commentColumns.some(c => c.name === 'vote_score');
    console.log(`  vote_score column: ${hasVoteScore ? '✅' : '❌'}`);
    
    console.log('\n🎉 Database schema verification complete!');
    
  } catch (e) {
    console.error('❌ Error verifying database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
