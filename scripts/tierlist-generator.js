import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

dotenv.config({ path: '.env.local' })

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.JIEKOU_API_KEY
const ANTHROPIC_URL = 'https://api.jiekou.ai/anthropic/v1/messages'

async function generateTierList(gameName, category) {
  console.log(`🎯 正在生成: ${gameName} - ${category} Tier List`)
  
  const systemPrompt = `你是一个专业的游戏数据分析专家，为GameHub游戏攻略网站创作高质量的Tier List排名文章。

创作要求：
- 使用Markdown格式
- 包含清晰的标题结构
- 内容详实、数据准确
- 语言生动有趣，适合游戏玩家阅读
- 不要生成任何元信息或额外说明，只输出文章内容本身

Tier List格式要求：
- S Tier: 版本最强，非Ban必选
- A Tier: 非常强力，泛用性高
- B Tier: 中等强度，特定场景可用
- C Tier: 较弱但仍有出场机会
- D Tier: 弱势，不推荐使用

每个Tier下列出具体角色/武器/装备，并简要说明理由。`

  const userPrompt = `为游戏「${gameName}」创作一份${category} Tier List排名文章。

要求：
1. 包含S、A、B、C、D五个Tier等级
2. 每个Tier列出5-10个条目
3. 每个条目提供简短的排名理由
4. 包含当前版本趋势分析
5. 文章长度约1000字左右
6. 使用Markdown格式输出`

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
        max_tokens: 5000
      })
    })

    const data = await response.json()
    
    if (response.status === 200) {
      const content = data.content?.[0]?.text || ''
      return content.trim()
    } else {
      console.error(`❌ API调用失败: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`❌ 生成失败: ${error.message}`)
    return null
  }
}

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function createTierList(gameId, gameName, category) {
  const content = await generateTierList(gameName, category)
  
  if (!content) return false

  const title = `${gameName} ${category} Tier List`
  const slug = generateSlug(title)

  try {
    const existing = await prisma.tierList.findFirst({
      where: { game_id: gameId, category: category }
    })

    if (existing) {
      console.log(`⚠️ Tier List已存在，跳过: ${title}`)
      return false
    }

    await prisma.tierList.create({
      data: {
        game_id: gameId,
        category: category,
        patch_version: 'latest'
      }
    })

    await prisma.article.create({
      slug,
      title,
      content,
      article_type: 'tierlist',
      status: 'published',
      source_type: 'ai',
      cover_url: `https://picsum.photos/seed/${slug}/800/450`,
      cover_alt: title,
      excerpt: content.substring(0, 200) + '...',
      read_time: Math.ceil(content.split(/\s+/).length / 200),
      seo_title: title,
      seo_description: `${gameName} ${category} Tier List排名分析`,
      game_id: gameId,
      published_at: new Date()
    })

    console.log(`✅ Tier List已创建: ${title}`)
    return true
  } catch (error) {
    console.error(`❌ 创建失败: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 开始生成 Tier List 内容')
  console.log('='.repeat(60))

  if (!ANTHROPIC_API_KEY) {
    console.error('❌ 未配置API Key')
    return
  }

  try {
    const games = await prisma.game.findMany({
      take: 8,
      select: { id: true, name: true }
    })

    const categories = ['character', 'weapon', 'skill']

    let createdCount = 0

    for (const game of games) {
      console.log(`\n🎮 处理游戏: ${game.name}`)
      
      const category = categories[createdCount % categories.length]
      
      const success = await createTierList(game.id, game.name, category)
      if (success) {
        createdCount++
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      if (createdCount >= 6) break
    }

    console.log('\n' + '='.repeat(60))
    console.log(`📝 Tier List 生成完成！`)
    console.log(`✅ 新创建: ${createdCount} 个`)

  } catch (error) {
    console.error('❌ 主流程失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)