const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { ensureAchievements } = require('./prisma/achievements.cjs');
require('dotenv').config();

const logStream = fs.createWriteStream('./test-log.txt', { flags: 'w' });
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  logStream.write(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ') + '\n');
};

async function main() {
  console.log('=== STARTING TEST ===');
  
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  });
  const prisma = new PrismaClient({ adapter });
  
  console.log('Checking tables...');
  const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
  console.log('Tables:', tables.map(t => t.name));
  
  const newTables = ['GameRating', 'Notification', 'Achievement', 'UserAchievement', 'CommentVote'];
  console.log('Creating tables...');
  
  for (const table of newTables) {
    try {
      if (table === 'GameRating') {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "GameRating" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "game_id" TEXT NOT NULL,
          "score" INTEGER NOT NULL,
          "review" TEXT,
          "helpful_count" INTEGER NOT NULL DEFAULT 0,
          "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" DATETIME NOT NULL
        )`);
      } else if (table === 'Notification') {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Notification" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "read" INTEGER NOT NULL DEFAULT 0,
          "action_url" TEXT,
          "data" TEXT,
          "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);
      } else if (table === 'Achievement') {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Achievement" (
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
        )`);
      } else if (table === 'UserAchievement') {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "UserAchievement" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "achievement_id" TEXT NOT NULL,
          "unlocked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "progress" TEXT
        )`);
      } else if (table === 'CommentVote') {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "CommentVote" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "user_id" TEXT NOT NULL,
          "comment_id" TEXT NOT NULL,
          "value" INTEGER NOT NULL,
          "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`);
      }
      console.log(`Created ${table}`);
    } catch (e) {
      console.log(`${table} may already exist:`, e.message);
    }
  }
  
  // Add vote_score
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Comment" ADD COLUMN "vote_score" INTEGER NOT NULL DEFAULT 0`);
    console.log('Added vote_score to Comment');
  } catch (e) {
    console.log('vote_score may already exist');
  }
  
  // Verify
  const tablesAfter = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
  console.log('Final tables:', tablesAfter.map(t => t.name));
  
  // Seed achievements
  console.log('Seeding achievements...');
  const result = await ensureAchievements();
  console.log('Achievement result:', result);
  
  console.log('=== TEST COMPLETE ===');
  await prisma.$disconnect();
  logStream.end();
}

main().catch(e => {
  console.error('ERROR:', e);
  logStream.end();
});
