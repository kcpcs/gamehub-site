#!/usr/bin/env node
/**
 * AI 仿真人功能测试脚本
 * 验证核心功能是否正常工作
 */

import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaLibSQL({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const db = new PrismaClient({ adapter })

console.log('=' .repeat(60))
console.log('🤖 AI 仿真人功能测试')
console.log('=' .repeat(60))

async function main() {
  console.log('\n📋 测试清单:')
  console.log('  1. 检查数据库结构')
  console.log('  2. 检查现有 AI 玩家')
  console.log('  3. 检查活动日志')
  console.log('  4. 检查种子数据')
  console.log('  5. 验证配置')
  console.log()

  try {
    // 1. 检查数据库结构
    console.log('📊 [1/5] 检查数据库结构...')
    const aiPlayers = await db.aIPlayer.findMany({
      include: { behavior_config: true, _count: { select: { activity_logs: true } } }
    })
    console.log(`   发现 ${aiPlayers.length} 个 AI 玩家\n`)

    // 2. 显示 AI 玩家详情
    console.log('👤 [2/5] AI 玩家列表:')
    if (aiPlayers.length === 0) {
      console.log('   ⚠️  没有发现 AI 玩家，需要先运行 ai-players-init.cjs')
    } else {
      console.log('┌────────────────────┬────────────┬────────────────┬──────────┐')
      console.log('│ Username           │ Status     │ Activity Logs  │ Type     │')
      console.log('├────────────────────┼────────────┼────────────────┼──────────┤')
      
      aiPlayers.forEach(player => {
        const pad = (s: string, n: number) => (s + ' '.repeat(n)).slice(0, n)
        const type = getPlayerType(player.interests)
        console.log(`│ ${pad(player.username, 18)} │ ${pad(player.status, 10)} │ ${pad(String(player._count.activity_logs), 14)} │ ${pad(type, 8)} │`)
      })
      console.log('└────────────────────┴────────────┴────────────────┴──────────┘\n')
    }

    // 3. 检查活动日志
    console.log('📝 [3/5] 活动日志:')
    const recentLogs = await db.aIActivityLog.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: { player: true }
    })
    
    if (recentLogs.length === 0) {
      console.log('   ℹ️  暂无活动记录\n')
    } else {
      console.log(`   最近 ${recentLogs.length} 条记录:\n`)
      recentLogs.forEach(log => {
        const time = new Date(log.created_at).toLocaleString()
        console.log(`   [${time}] ${log.player?.username || '?'} - ${log.activity_type}`)
      })
      console.log()
    }

    // 4. 检查种子数据
    console.log('🎮 [4/5] 检查种子数据:')
    const articles = await db.article.count()
    const games = await db.game.count()
    const comments = await db.comment.count()
    console.log(`   Articles: ${articles}`)
    console.log(`   Games: ${games}`)
    console.log(`   Comments: ${comments}\n`)

    // 5. 功能验证清单
    console.log('✅ [5/5] 功能验证清单:')
    const issues: string[] = []
    
    // 检查是否有 AI 玩家
    if (aiPlayers.length === 0) {
      issues.push('❌ 没有 AI 玩家数据，需要初始化')
    }
    
    // 检查是否有活跃玩家
    const activePlayers = aiPlayers.filter(p => p.status === 'active')
    if (activePlayers.length === 0 && aiPlayers.length > 0) {
      issues.push('⚠️  没有活跃的 AI 玩家')
    }
    
    // 检查行为配置
    const playersWithoutConfig = aiPlayers.filter(p => !p.behavior_config)
    if (playersWithoutConfig.length > 0) {
      issues.push(`⚠️  ${playersWithoutConfig.length} 个玩家缺少行为配置`)
    }
    
    // 检查是否有文章用于互动
    if (articles === 0) {
      issues.push('⚠️  没有文章数据，AI 无法评论')
    }
    
    // 输出检查结果
    if (issues.length === 0) {
      console.log('   ✅ 所有基础检查通过！')
    } else {
      issues.forEach(issue => console.log(`   ${issue}`))
    }
    console.log()

    // 输出使用说明
    console.log('💡 使用说明:')
    console.log('   1. 初始化 AI 玩家: node ai-players-init.cjs')
    console.log('   2. 启动开发服务器: npm run dev')
    console.log('   3. 通过管理面板激活 AI 玩家并启动调度器')
    console.log('   4. 或者使用 API: POST /api/admin/ai-scheduler {"action": "start"}')
    console.log()

  } catch (error) {
    console.error('❌ 测试失败:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

function getPlayerType(interests: any): string {
  try {
    const ints = typeof interests === 'string' ? JSON.parse(interests) : interests
    if (!Array.isArray(ints)) return 'Unknown'
    
    const typeKeywords: Record<string, string[]> = {
      'Hardcore': ['meta', 'competitive', 'DPS', 'speedrun'],
      'Casual': ['casual', 'exploration', 'screenshot'],
      'Guide': ['guide', 'tutorial', 'mechanic'],
      'Code': ['code', 'redeem', 'freebie'],
      'News': ['patch', 'update', 'leak'],
      'Help': ['help', 'troubleshooting', 'FAQ']
    }
    
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(k => ints.some((i: string) => i.toLowerCase().includes(k.toLowerCase())))) {
        return type
      }
    }
  } catch (e) {
    // ignore
  }
  return 'Normal'
}

main().catch(console.error)
