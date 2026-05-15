const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
require('dotenv').config()

async function createAITables() {
  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    })
    const db = new PrismaClient({ adapter })
    
    await db.$connect()
    console.log('Connected to database')
    
    // 创建 AIPlayer 表
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIPlayer" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "email" TEXT NOT NULL UNIQUE,
        "avatar" TEXT,
        "avatar_url" TEXT,
        "age" INTEGER,
        "occupation" TEXT,
        "bio" TEXT,
        "region" TEXT,
        "personality" TEXT NOT NULL DEFAULT '{}',
        "interests" TEXT NOT NULL DEFAULT '[]',
        "activity_level" REAL NOT NULL DEFAULT 0.5,
        "status" TEXT NOT NULL DEFAULT 'inactive',
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "last_activity_at" DATETIME,
        "joined_at_simulated" DATETIME,
        "total_posts" INTEGER NOT NULL DEFAULT 0,
        "total_comments" INTEGER NOT NULL DEFAULT 0,
        "follower_ids" TEXT NOT NULL DEFAULT '[]'
      )
    `
    console.log('Created AIPlayer table')
    
    // 创建 AIBehaviorConfig 表
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIBehaviorConfig" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "player_id" TEXT NOT NULL UNIQUE,
        "wake_up_time" TEXT DEFAULT '08:00',
        "sleep_time" TEXT DEFAULT '23:00',
        "activity_interval_min" INTEGER DEFAULT 300,
        "activity_interval_max" INTEGER DEFAULT 1800,
        "post_probability" REAL DEFAULT 0.1,
        "comment_probability" REAL DEFAULT 0.3,
        "reply_probability" REAL DEFAULT 0.5,
        "typing_speed_min" INTEGER DEFAULT 30,
        "typing_speed_max" INTEGER DEFAULT 60,
        "thinking_time_min" INTEGER DEFAULT 2,
        "thinking_time_max" INTEGER DEFAULT 10,
        "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("player_id") REFERENCES "AIPlayer"("id") ON DELETE CASCADE
      )
    `
    console.log('Created AIBehaviorConfig table')
    
    // 创建 AIActivityLog 表
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIActivityLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "player_id" TEXT NOT NULL,
        "activity_type" TEXT NOT NULL,
        "target_type" TEXT NOT NULL,
        "target_id" TEXT NOT NULL,
        "content" TEXT,
        "success" INTEGER DEFAULT 1,
        "error_message" TEXT,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("player_id") REFERENCES "AIPlayer"("id") ON DELETE CASCADE
      )
    `
    console.log('Created AIActivityLog table')
    
    // 创建 AIContentReviewQueue 表
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIContentReviewQueue" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "ai_player_id" TEXT NOT NULL,
        "action_type" TEXT NOT NULL,
        "target_type" TEXT NOT NULL,
        "target_id" TEXT,
        "generated_content" TEXT NOT NULL,
        "confidence_score" REAL NOT NULL,
        "quality_check_result" TEXT DEFAULT '{}',
        "status" TEXT DEFAULT 'pending',
        "reviewed_by" TEXT,
        "reviewed_at" DATETIME,
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("ai_player_id") REFERENCES "AIPlayer"("id") ON DELETE CASCADE
      )
    `
    console.log('Created AIContentReviewQueue table')
    
    // 创建 AIStats 表
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "AIStats" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "player_id" TEXT NOT NULL,
        "date" DATETIME NOT NULL,
        "posts_count" INTEGER DEFAULT 0,
        "comments_count" INTEGER DEFAULT 0,
        "replies_count" INTEGER DEFAULT 0,
        "likes_count" INTEGER DEFAULT 0,
        "active_minutes" INTEGER DEFAULT 0,
        FOREIGN KEY ("player_id") REFERENCES "AIPlayer"("id") ON DELETE CASCADE,
        UNIQUE ("player_id", "date")
      )
    `
    console.log('Created AIStats table')
    
    // 创建索引
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIPlayer_status_idx" ON "AIPlayer"("status")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIPlayer_created_at_idx" ON "AIPlayer"("created_at")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIActivityLog_player_id_idx" ON "AIActivityLog"("player_id")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIActivityLog_activity_type_idx" ON "AIActivityLog"("activity_type")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIContentReviewQueue_ai_player_id_idx" ON "AIContentReviewQueue"("ai_player_id")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIContentReviewQueue_status_idx" ON "AIContentReviewQueue"("status")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIStats_player_id_idx" ON "AIStats"("player_id")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "AIStats_date_idx" ON "AIStats"("date")`
    
    console.log('Created indexes')
    
    await db.$disconnect()
    console.log('Done!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createAITables()