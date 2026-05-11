/**
 * 游戏更新器模块 (CommonJS版本)
 * 检查游戏信息更新
 */

async function runGameUpdater(db, logger) {
  logger.info('开始游戏信息更新检查...');
  
  const stats = {
    totalGames: 0,
    updatedGames: 0,
    newGames: 0
  };

  // 获取所有游戏
  const games = await db.game.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      updated_at: true,
      score_opencritic: true,
      score_community: true
    }
  });

  stats.totalGames = games.length;

  logger.info(`检查 ${games.length} 个游戏的信息...`);

  for (const game of games) {
    const ageMs = new Date() - new Date(game.updated_at);
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    
    // 如果游戏信息超过7天未更新，标记需要更新
    if (ageDays > 7) {
      logger.debug(`游戏 ${game.name} 最近更新于 ${Math.floor(ageDays)} 天前`);
      
      // 在真实环境中，这里会调用外部API更新游戏数据
      // 目前模拟处理：轻微更新修改时间
      await db.game.update({
        where: { id: game.id },
        data: {
          updated_at: new Date()
        }
      });
      
      stats.updatedGames++;
    }
  }

  logger.info(`🎮 游戏更新报告:`);
  logger.info(`   - 总游戏数: ${stats.totalGames}`);
  logger.info(`   - 已更新: ${stats.updatedGames}`);
  logger.info(`   - 新游戏: ${stats.newGames}`);

  return stats;
}

module.exports = { runGameUpdater };
