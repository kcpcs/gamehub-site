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

async function generateArticle(gameName, articleType, title) {
  console.log(`🎯 正在生成: ${gameName} - ${title}`)
  
  const systemPrompt = `你是一个专业的游戏内容创作者，为GameHub游戏攻略网站创作高质量的游戏攻略文章。

创作要求：
- 使用Markdown格式
- 包含清晰的标题结构（## 主标题，### 子标题）
- 内容详实、实用、有深度
- 语言生动有趣，适合游戏玩家阅读
- 包含具体的游戏术语和技巧
- 不要生成任何元信息或额外说明，只输出文章内容本身

根据文章类型创作相应内容：
- guide: 详细的游戏指南和教程
- tierlist: 角色/武器/装备排名列表
- news: 游戏新闻和更新报道
- codes: 兑换码列表和使用指南`

  const userPrompt = `为游戏「${gameName}」创作一篇${articleType === 'guide' ? '游戏攻略' : articleType === 'tierlist' ? 'Tier List排名' : articleType === 'news' ? '新闻报道' : '兑换码指南'}文章。

标题：${title}

要求：
1. 文章长度约800字左右
2. 结构清晰，包含引言、主要章节和结论
3. 内容实用，包含具体的游戏技巧和策略
4. 使用Markdown格式输出
5. 不要包含任何额外的元信息或注释`

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
        max_tokens: 4000
      })
    })

    const data = await response.json()
    
    if (response.status === 200) {
      const content = data.content?.[0]?.text || ''
      return content.trim()
    } else {
      console.error(`❌ API调用失败: ${response.status} - ${JSON.stringify(data)}`)
      return null
    }
  } catch (error) {
    console.error(`❌ 生成失败: ${error.message}`)
    return null
  }
}

async function createArticleInDB(articleData) {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleData.slug }
    })

    if (existingArticle) {
      console.log(`⚠️ 文章已存在，跳过: ${articleData.slug}`)
      return false
    }

    const created = await prisma.article.create({
      data: articleData
    })
    
    console.log(`✅ 文章已创建: ${created.slug}`)
    return true
  } catch (error) {
    console.error(`❌ 创建文章失败: ${error.message}`)
    return false
  }
}

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('🚀 开始批量生成游戏攻略文章')
  console.log('='.repeat(60))

  if (!ANTHROPIC_API_KEY) {
    console.error('❌ 未配置API Key')
    return
  }

  try {
    const games = await prisma.game.findMany({
      take: 5,
      select: { id: true, slug: true, name: true }
    })

    console.log(`📊 找到 ${games.length} 个游戏`)

    const articleTemplates = [
      { type: 'guide', prefix: '新手入门指南' },
      { type: 'guide', prefix: '进阶攻略' },
      { type: 'tierlist', prefix: '角色强度排名' },
    ]

    let createdCount = 0
    let skippedCount = 0

    for (const game of games) {
      console.log(`\n🎮 处理游戏: ${game.name}`)

      const template = articleTemplates[createdCount % articleTemplates.length]
      const title = `${game.name} ${template.prefix}`
      const slug = generateSlug(title)

      const content = await generateArticle(game.name, template.type, title)
      
      if (content) {
        const success = await createArticleInDB({
          slug,
          title,
          content,
          article_type: template.type,
          status: 'published',
          source_type: 'ai',
          cover_url: `https://picsum.photos/seed/${slug}/800/450`,
          cover_alt: title,
          excerpt: content.substring(0, 200) + '...',
          read_time: Math.ceil(content.split(/\s+/).length / 200),
          seo_title: title,
          seo_description: content.substring(0, 160),
          game_id: game.id,
          published_at: new Date()
        })

        if (success) {
          createdCount++
        } else {
          skippedCount++
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (createdCount >= 5) break
    }

    console.log('\n' + '='.repeat(60))
    console.log(`📝 生成完成！`)
    console.log(`✅ 新创建: ${createdCount} 篇`)
    console.log(`⚠️ 跳过: ${skippedCount} 篇`)

  } catch (error) {
    console.error('❌ 主流程失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)