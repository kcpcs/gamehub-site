const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();

let prismaInstance = null;

function getPrisma() {
  if (!prismaInstance) {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

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

async function ensureAchievements() {
  const prisma = getPrisma();
  let created = 0;
  let existing = 0;

  for (const achievementData of ACHIEVEMENTS) {
    const existingAchievement = await prisma.achievement.findUnique({
      where: { slug: achievementData.slug }
    });

    if (existingAchievement) {
      existing++;
    } else {
      await prisma.achievement.create({
        data: achievementData
      });
      created++;
      console.log(`✅ Created achievement: ${achievementData.title}`);
    }
  }

  return { created, existing };
}

module.exports = { ensureAchievements, ACHIEVEMENTS };
