/**
 * 兑换码检查模块 (CommonJS版本)
 * 检测过期兑换码，标记失效代码
 */

async function runCodeChecker(db, logger) {
  logger.info('开始兑换码检查...');
  
  const stats = {
    totalCodes: 0,
    activeCodes: 0,
    expiredCodes: 0,
    markedExpired: 0
  };

  // 获取所有兑换码
  const codes = await db.gameCode.findMany({
    include: {
      game: {
        select: {
          name: true,
          slug: true
        }
      }
    }
  });

  stats.totalCodes = codes.length;

  const now = new Date();
  
  for (const code of codes) {
    if (code.status === 'active') {
      stats.activeCodes++;
      
      // 简单逻辑：创建超过30天的兑换码标记为可能过期
      const ageMs = now - new Date(code.created_at);
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      
      if (ageDays > 30 && !code.verified_at) {
        logger.warn(`⚠️ 兑换码 ${code.code} (${code.game.name}) 已 ${Math.floor(ageDays)} 天，可能过期`);
        
        // 在真实环境中，这里会验证兑换码有效性
        // 目前模拟处理：标记为待验证
        stats.markedExpired++;
      }
    } else {
      stats.expiredCodes++;
    }
  }

  logger.info(`🎁 兑换码检查报告:`);
  logger.info(`   - 总兑换码: ${stats.totalCodes}`);
  logger.info(`   - 活跃兑换码: ${stats.activeCodes}`);
  logger.info(`   - 已过期: ${stats.expiredCodes}`);
  logger.info(`   - 需验证: ${stats.markedExpired}`);

  return stats;
}

module.exports = { runCodeChecker };
