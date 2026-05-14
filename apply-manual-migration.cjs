const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔧 Applying manual migration...\n');
  
  // Read our migration SQL
  const sqlPath = path.join(__dirname, 'prisma', 'migrations', 'manual', 'phase4_tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Split into individual statements (split on semicolons, but skip those in strings)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log(`📄 Found ${statements.length} SQL statements to execute\n`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (!statement) continue;
    
    try {
      await prisma.$executeRawUnsafe(statement);
      console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      successCount++;
    } catch (e) {
      // If it's an error about table already existing, we can skip
      if (e.message && (e.message.includes('already exists') || e.message.includes('duplicate column'))) {
        console.log(`⏭️  Statement ${i + 1}/${statements.length} skipped (already applied)`);
        skipCount++;
      } else {
        console.log(`❌ Statement ${i + 1}/${statements.length} failed:`, e.message);
        throw e;
      }
    }
  }
  
  console.log(`\n✅ Migration complete! Applied: ${successCount}, Skipped: ${skipCount}`);
  
  // Verify the changes
  console.log('\n🔍 Verifying database schema...');
  const tables = await prisma.$queryRaw`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `;
  
  const newTables = ['GameRating', 'Notification', 'Achievement', 'UserAchievement', 'CommentVote'];
  console.log('\n✅ New tables:');
  for (const table of newTables) {
    const exists = tables.some(t => t.name === table);
    console.log(`  ${table}: ${exists ? '✅' : '❌'}`);
  }
  
  // Check Comment table
  const commentColumns = await prisma.$queryRaw`
    PRAGMA table_info(Comment)
  `;
  const hasVoteScore = commentColumns.some(c => c.name === 'vote_score');
  console.log(`\n✅ Comment vote_score column: ${hasVoteScore ? '✅' : '❌'}`);
  
}

main()
  .catch((e) => {
    console.error('❌ Error applying migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
