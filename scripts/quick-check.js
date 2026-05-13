#!/usr/bin/env node

// 快速检查脚本
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const db = new PrismaClient();

console.log('=== Quick Database Check ===\n');

async function main() {
  // 检查 AI 玩家
  const aiPlayers = await db.aIPlayer.findMany({ include: { behavior_config: true }});
  console.log(`AI Players: ${aiPlayers.length}`);
  
  // 检查文章
  const articles = await db.article.findMany({ take: 5 });
  console.log(`Articles: ${articles.length}`);
  
  // 检查游戏
  const games = await db.game.findMany({ take: 5 });
  console.log(`Games: ${games.length}`);
  
  // 检查评论
  const comments = await db.comment.findMany({ take: 5 });
  console.log(`Comments: ${comments.length}`);
  
  console.log('\n✅ 数据库检查完成！');
  
  if (articles.length === 0) {
    console.log('\n⚠️ 没有文章内容，AI 无法评论。建议先添加一些文章或让 AI 发帖！');
  }
  
  if (games.length === 0) {
    console.log('⚠️ 没有游戏数据，AI 发帖需要关联游戏！');
  }
}

main().catch(console.error).finally(() => db.$disconnect());
