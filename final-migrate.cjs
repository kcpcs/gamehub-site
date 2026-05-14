const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const ACHIEVEMENTS = [
  {
    slug: 'first-game-rating',
    title: '初次评分',
    description: '为你的第一个游戏提交评分',
    icon_url: null,
    points: 10,
    category: 'engagement',
    condition: JSON.stringify({ type: 'game_ratings', count: 1 })
  },
  {
    slug: 'five-ratings',
    title: '评价收集者',
    description: '为 5 个游戏提交评分',
    icon_url: null,
    points: 25,
    category: 'engagement',
    condition: JSON.stringify({ type: 'game_ratings', count: 5 })
  },
  {
    slug: 'first-comment',
    title: '畅所欲言',
    description: '发表你的第一条评论',
    icon_url: null,
    points: 10,
    category: 'engagement',
    condition: JSON.stringify({ type: 'comments', count: 1 })
  },
  {
    slug: 'ten-comments',
    title: '社区活跃者',
    description: '发表 10 条评论',
    icon_url: null,
    points: 50,
    category: 'engagement',
    condition: JSON.stringify({ type: 'comments', count: 10 })
  },
  {
    slug: 'first-favorite',
    title: '收藏夹',
    description: '收藏你的第一个游戏',
    icon_url: null,
    points: 10,
    category: 'engagement',
    condition: JSON.stringify({ type: 'favorites', count: 1 })
  },
  {
    slug: 'five-favorites',
    title: '游戏爱好者',
    description: '收藏 5 个游戏',
    icon_url: null,
    points: 25,
    category: 'engagement',
    condition: JSON.stringify({ type: 'favorites', count: 5 })
  },
  {
    slug: 'first-article-like',
    title: '点赞达人',
    description: '点赞你的第一篇文章',
    icon_url: null,
    points: 10,
    category: 'engagement',
    condition: JSON.stringify({ type: 'article_likes', count: 1 })
  },
  {
    slug: 'weekly-visitor',
    title: '每周报到',
    description: '连续 7 天访问网站',
    icon_url: null,
    points: 30,
    category: 'loyalty',
    condition: JSON.stringify({ type: 'consecutive_days', count: 7 })
  },
  {
    slug: 'first-code-redeem',
    title: '兑换专家',
    description: '兑换你的第一个游戏代码',
    icon_url: null,
    points: 15,
    category: 'engagement',
    condition: JSON.stringify({ type: 'code_redemptions', count: 1 })
  },
  {
    slug: 'guide-reader',
    title: '攻略达人',
    description: '阅读 5 篇攻略文章',
    icon_url: null,
    points: 20,
    category: 'engagement',
    condition: JSON.stringify({ type: 'articles_read', count: 5, type_filter: 'guide' })
  }
];

async function main() {
  console.log('🔧 Starting migration and seeding...\n');
  
  // Step 1: Create tables
  console.log('Step 1: Creating tables...');
  
  const createStatements = [
    `CREATE TABLE IF NOT EXISTS "GameRating" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "user_id" TEXT NOT NULL,
      "game_id" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "review" TEXT,
      "helpful_count" INTEGER NOT NULL DEFAULT 0,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL
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
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
      "progress" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "CommentVote" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "user_id" TEXT NOT NULL,
      "comment_id" TEXT NOT NULL,
      "value" INTEGER NOT NULL,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const stmt of createStatements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      console.log('  ✅ Table created');
    } catch (e) {
      console.log('  ⏭️  Table may already exist');
    }
  }
  
  // Step 2: Add vote_score to Comment
  console.log('\nStep 2: Adding vote_score to Comment...');
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Comment" ADD COLUMN "vote_score" INTEGER NOT NULL DEFAULT 0`);
    console.log('  ✅ Added vote_score');
  } catch (e) {
    console.log('  ⏭️  vote_score may already exist');
  }
  
  // Step 3: Create indexes
  console.log('\nStep 3: Creating indexes...');
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
      // Ignore
    }
  }
  console.log('  ✅ Indexes ready');
  
  // Step 4: Verify
  console.log('\nStep 4: Verifying database...');
  const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
  const newTables = ['GameRating', 'Notification', 'Achievement', 'UserAchievement', 'CommentVote'];
  
  let allGood = true;
  for (const table of newTables) {
    const exists = tables.some(t => t.name === table);
    console.log(`  ${table}: ${exists ? '✅' : '❌'}`);
    if (!exists) allGood = false;
  }
  
  const commentColumns = await prisma.$queryRaw`PRAGMA table_info(Comment)`;
  const hasVoteScore = commentColumns.some(c => c.name === 'vote_score');
  console.log(`  Comment.vote_score: ${hasVoteScore ? '✅' : '❌'}`);
  
  // Step 5: Seed achievements
  console.log('\nStep 5: Seeding achievements...');
  let created = 0, existing = 0;
  
  for (const achievementData of ACHIEVEMENTS) {
    const found = await prisma.achievement.findUnique({
      where: { slug: achievementData.slug }
    });
    if (found) {
      existing++;
    } else {
      await prisma.achievement.create({ data: achievementData });
      created++;
      console.log(`  ✅ Created: ${achievementData.title}`);
    }
  }
  
  console.log(`\nAchievements: ${created} created, ${existing} existed`);
  
  console.log('\n🎉 Migration and seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
