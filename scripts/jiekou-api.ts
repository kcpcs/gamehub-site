import fetch from 'node-fetch'

interface ArticleContent {
  title: string
  content: string
  excerpt: string
  seoKeywords: string[]
  gameName: string
}

interface TierListContent {
  gameName: string
  category: string
  patchVersion: string
  entries: {
    name: string
    grade: string
    description: string
  }[]
}

const JIEKOU_API_URL = process.env.JIEKOU_API_URL || 'https://api.jiekou.ai/v1/chat/completions'
const JIEKOU_API_KEY = process.env.JIEKOU_API_KEY || ''

export async function generateArticle(gameName: string, topic: string): Promise<ArticleContent | null> {
  try {
    const prompt = `你是一位专业的游戏攻略作者。请为游戏《${gameName}》撰写一篇关于「${topic}」的详细攻略文章。

要求：
1. 标题格式：《${gameName}》${topic}全攻略
2. 使用Markdown格式，包含清晰的标题层级
3. 内容长度800-1200字
4. 包含实用技巧和具体步骤
5. 语言专业但易懂

请用JSON格式返回：
{
  "title": "文章标题",
  "content": "完整文章内容（Markdown）",
  "excerpt": "文章摘要（1-2句话）",
  "seoKeywords": ["关键词1", "关键词2", "关键词3"],
  "gameName": "${gameName}"
}`

    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.7
      })
    })

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('API响应格式错误:', data)
      return null
    }

    const responseText = data.choices[0].message.content!
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ArticleContent
      }
    } catch {
      console.error('JSON解析失败')
    }

    return {
      title: `${gameName} ${topic}攻略`,
      content: responseText,
      excerpt: responseText.substring(0, 150) + '...',
      seoKeywords: [gameName, topic, '攻略', '技巧', '指南'],
      gameName
    }

  } catch (error) {
    console.error('生成文章失败:', error)
    return null
  }
}

export async function generateTierList(gameName: string, category: string = 'character'): Promise<TierListContent | null> {
  try {
    const prompt = `你是一位专业的游戏Tier List分析师。请为游戏《${gameName}》的${category}生成一份详细的Tier List。

要求：
1. 使用S、A、B、C、D五个等级
2. 每个等级列出2-5个角色/物品
3. 为每个条目提供简短说明
4. 基于当前游戏版本的平衡性

请用JSON格式返回：
{
  "gameName": "${gameName}",
  "category": "${category}",
  "patchVersion": "最新版本",
  "entries": [
    {"name": "名称", "grade": "S", "description": "理由"}
  ]
}`

    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.5
      })
    })

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('API响应格式错误:', data)
      return null
    }

    const responseText = data.choices[0].message.content!
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as TierListContent
      }
    } catch {
      console.error('JSON解析失败')
    }

    return null

  } catch (error) {
    console.error('生成Tier List失败:', error)
    return null
  }
}

export async function generateGameDescription(gameName: string, developer: string | null | undefined, releaseYear: number): Promise<string | null> {
  try {
    const prompt = `Write a compelling 100-150 word description for ${gameName} by ${developer || 'unknown'}, released in ${releaseYear}.

Focus on:
- What makes the game unique
- Core gameplay mechanics
- Why players love it
- What type of player would enjoy it

Write in English, third person, engaging tone.
Do not use quotes or markdown formatting.
Return just the description text.`

    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('API响应格式错误:', data)
      return null
    }

    return data.choices[0].message.content!.trim()

  } catch (error) {
    console.error('生成游戏描述失败:', error)
    return null
  }
}

export async function testJiekouConnection(): Promise<boolean> {
  try {
    const response = await fetch(JIEKOU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JIEKOU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        messages: [
          {
            role: 'user',
            content: '请回复"连接成功"四个字'
          }
        ],
        max_tokens: 100
      })
    })

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    
    if (data.choices?.[0]?.message?.content?.includes('连接成功')) {
      console.log('✅ jiekou.ai连接成功')
      return true
    }
    
    console.error('❌ jiekou.ai连接失败:', data)
    return false

  } catch (error) {
    console.error('❌ jiekou.ai连接失败:', error)
    return false
  }
}
