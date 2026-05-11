#!/usr/bin/env node
/**
 * GameHub AI自动化工作流主程序
 * 
 * 功能：
 * - 定时检查游戏更新
 * - 自动生成攻略内容
 * - 监控兑换码过期
 * - 智能内容更新
 */

import { PrismaClient } from '@prisma/client';
import { createLogger } from './logger.js';
import { runContentMonitor } from './content-monitor.js';
import { runCodeChecker } from './code-checker.js';
import { runGameUpdater } from './game-updater.js';

const db = new PrismaClient();
const logger = createLogger('ai-workflow');

class GameHubAIWorkflow {
  constructor() {
    this.isRunning = false;
  }

  async initialize() {
    logger.info('🚀 初始化GameHub AI自动化工作流...');
    await db.$connect();
    logger.info('✅ 数据库连接成功');
  }

  async runFullCycle() {
    if (this.isRunning) {
      logger.warn('工作流已在运行中，跳过本次执行');
      return;
    }

    this.isRunning = true;
    logger.info('='.repeat(60));
    logger.info('📅 开始AI自动化工作流全周期执行');
    logger.info(`⏰ 执行时间: ${new Date().toLocaleString()}`);
    logger.info('='.repeat(60));

    try {
      // 步骤1: 监控内容需求
      logger.info('\n📊 步骤1/3: 内容需求监控...');
      await runContentMonitor(db, logger);

      // 步骤2: 检查兑换码
      logger.info('\n🎁 步骤2/3: 兑换码状态检查...');
      await runCodeChecker(db, logger);

      // 步骤3: 更新游戏信息
      logger.info('\n🎮 步骤3/3: 游戏信息更新...');
      await runGameUpdater(db, logger);

      logger.success('\n✅ AI自动化工作流全周期执行完成！');

    } catch (error) {
      logger.error('❌ 工作流执行失败:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async runMonitorOnly() {
    logger.info('📊 运行内容监控...');
    await runContentMonitor(db, logger);
  }

  async runCodeCheckerOnly() {
    logger.info('🎁 检查兑换码...');
    await runCodeChecker(db, logger);
  }

  async runGameUpdaterOnly() {
    logger.info('🎮 更新游戏信息...');
    await runGameUpdater(db, logger);
  }

  async shutdown() {
    logger.info('👋 正在关闭AI工作流...');
    this.isRunning = false;
    await db.$disconnect();
    logger.info('✅ 已安全关闭');
  }
}

// 主执行流程
async function main() {
  const workflow = new GameHubAIWorkflow();
  
  // 优雅关闭
  process.on('SIGINT', async () => {
    await workflow.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await workflow.shutdown();
    process.exit(0);
  });

  try {
    await workflow.initialize();
    
    // 检查命令行参数
    const args = process.argv.slice(2);
    
    if (args.includes('--run-once')) {
      // 单次执行模式 - 完整循环
      await workflow.runFullCycle();
    } else if (args.includes('--monitor')) {
      // 仅监控模式
      await workflow.runMonitorOnly();
    } else if (args.includes('--check-codes')) {
      // 仅检查兑换码
      await workflow.runCodeCheckerOnly();
    } else if (args.includes('--update-games')) {
      // 仅更新游戏
      await workflow.runGameUpdaterOnly();
    } else {
      // 帮助信息
      console.log(`
GameHub AI 自动化工作流

用法:
  node scripts/ai-workflow.js [选项]

选项:
  --run-once      运行完整工作流一次
  --monitor       仅运行内容监控
  --check-codes   仅检查兑换码状态
  --update-games  仅更新游戏信息

示例:
  npm run ai:run          # 运行完整工作流
  npm run ai:monitor      # 监控内容
  npm run ai:check-codes  # 检查兑换码
  npm run ai:update-games # 更新游戏信息
`);
    }
    
    await workflow.shutdown();
    
  } catch (error) {
    logger.error('启动失败:', error);
    process.exit(1);
  }
}

main().catch(console.error);
