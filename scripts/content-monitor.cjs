/**
 * 内容监控模块 (CommonJS版本)
 * 分析内容需求和趋势
 */

async function runContentMonitor(db, logger) {
  logger.info('开始内容监控检查...');
  
  const stats = {
    totalArticles: 0,
    totalGames: 0,
    guidesPerGame: {},
    needsContent: []
  };

  // 获取文章统计
  const articleCount = await db.article.count();
  stats.totalArticles = articleCount;

  // 获取游戏统计
  const games = await db.game.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      guide_count: true,
      code_count: true,
      has_tier_list: true
    }
  });
  stats.totalGames = games.length;

  // 分析每个游戏的内容情况
  for (const game of games) {
    const guideCount = await db.article.count({
      where: {
        game_id: game.id,
        status: 'published'
      }
    });

    stats.guidesPerGame[game.slug] = guideCount;

    // 标记需要内容的游戏
    if (guideCount < 3) {
      stats.needsContent.push({
        game: game.name,
        slug: game.slug,
        guides: guideCount
      });
    }
  }

  logger.info(`📊 内容监控报告:`);
  logger.info(`   - 总游戏数: ${stats.totalGames}`);
  logger.info(`   - 总攻略数: ${stats.totalArticles}`);
  logger.info(`   - 需要内容: ${stats.needsContent.length} 个游戏`);

  if (stats.needsContent.length > 0) {
    logger.info('   需要补充内容的游戏:');
    stats.needsContent.forEach(item => {
      logger.info(`     • ${item.game}: ${item.guides} 篇攻略`);
    });
  }

  return stats;
}

module.exports = { runContentMonitor };
