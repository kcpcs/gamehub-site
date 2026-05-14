const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { ensureAchievements } = require('./prisma/achievements.cjs');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧪 Starting full test...\n');
  
  console.log('1️⃣  Checking database tables:');
  const tables = await prisma.$queryRaw`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `;
  console.log('   Tables:', tables.map(t => t.name).join(', '));
  
  const newTables = ['GameRating', 'Notification', 'Achievement', 'UserAchievement', 'CommentVote'];
  let allTablesExist = true;
  
  console.log('\n2️⃣  Verifying new tables:');
  for (const table of newTables) {
    const exists = tables.some(t => t.name === table);
    console.log(`   ${table}: ${exists ? '✅' : '❌'}`);
    if (!exists) allTablesExist = false;
  }
  
  if (!allTablesExist) {
    console.log('\n3️⃣  Creating tables manually...');
    const createStatements = [
      `CREATE TABLE IF NOT EXISTS "GameRating" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "game_id" TEXT NOT NULL,
        "score" INTEGER NOT NULL,
        "review" TEXT,
        "helpful_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME NOT NULL,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "read" INTEGER NOT NULL DEFAULT 0,
        "action_url" TEXT,
        "data" TEXT,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS "Achievement" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon_url" TEXT,
        "points" INTEGER NOT NULL DEFAULT 10,
        "category" TEXT,
        "condition" TEXT NOT NULL,
        "is_active" INTEGER NOT NULL DEFAULT 1,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "UserAchievement" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "achievement_id" TEXT NOT NULL,
        "unlocked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "progress" TEXT,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS "CommentVote" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "comment_id" TEXT NOT NULL,
        "value" INTEGER NOT NULL,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
        FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE
      )`
    ];
    
    for (const stmt of createStatements) {
      try {
        await prisma.$executeRawUnsafe(stmt);
        console.log('   ✅ Table created');
      } catch (e) {
        console.log('   ⏭️  Table may already exist');
      }
    }
    
    // Add vote_score to Comment
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Comment" ADD COLUMN "vote_score" INTEGER NOT NULL DEFAULT 0
      `);
      console.log('   ✅ Added vote_score to Comment');
    } catch (e) {
      console.log('   ⏭️  vote_score may already exist');
    }
  }
  
  // Create indexes
  console.log('\n4️⃣  Creating indexes...');
  const indexStatements = [
    `CREATE UNIQUE INDEX IF NOT EXISTS "GameRating_user_id_game_id_key" ON "GameRating"("user_id", "game_id")`,
    `CREATE INDEX IF NOT EXISTS "GameRating_game_id_idx" ON "GameRating"("game_id")`,
    `CREATE INDEX IF NOT EXISTS "GameRating_score_idx" ON "GameRating"("score")`,
    `CREATE INDEX IF NOT EXISTS "Notification_user_id_idx" ON "Notification"("user_id")`,
    `CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read")`,
    `CREATE INDEX IF NOT EXISTS "Notification_created_at_idx" ON "Notification"("created_at")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "UserAchievement_user_id_achievement_id_key" ON "UserAchievement"("user_id", "achievement_id")`,
    `CREATE INDEX IF NOT EXISTS "UserAchievement_user_id_idx" ON "UserAchievement"("user_id")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "CommentVote_user_id_comment_id_key" ON "CommentVote"("user_id", "comment_id")`,
    `CREATE INDEX IF NOT EXISTS "CommentVote_comment_id_idx" ON "CommentVote"("comment_id")`
  ];
  
  for (const stmt of indexStatements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (e) {
      // Skip errors about indexes already existing
    }
  }
  console.log('   ✅ Indexes created');
  
  // Verify again
  const tablesAfter = await prisma.$queryRaw`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `;
  console.log('\n5️⃣  Final verification:');
  for (const table of newTables) {
    const exists = tablesAfter.some(t => t.name === table);
    console.log(`   ${table}: ${exists ? '✅' : '❌'}`);
  }
  
  // Check Comment table
  const commentColumns = await prisma.$queryRaw`
    PRAGMA table_info(Comment)
  `;
  const hasVoteScore = commentColumns.some(c => c.name === 'vote_score');
  console.log(`   Comment.vote_score: ${hasVoteScore ? '✅' : '❌'}`);
  
  // Seed achievements
  console.log('\n6️⃣  Seeding achievements...');
  const result = await ensureAchievements();
  console.log(`   ✅ Created: ${result.created}, Existed: ${result.existed}`);
  
  console.log('\n🎉 All tests passed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
