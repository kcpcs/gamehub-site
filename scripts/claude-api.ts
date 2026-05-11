import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || '',
})

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

export async function generateArticle(gameName: string, topic: string): Promise<ArticleContent | null> {
  try {
    const prompt = `You are an expert gaming guide writer for GameHub, a gaming community website.

Write a comprehensive guide article about ${topic} in ${gameName}.

Requirements:
- Title format: "How to ${topic} in ${gameName}"
- Use FAQ format with Q: and A: for common questions
- Include step-by-step instructions
- SEO optimized with relevant keywords
- Write in English
- Content should be 800-1200 words
- Include specific game mechanics, tips, and strategies

Return JSON format:
{
  "title": "How to ${topic} in ${gameName}",
  "content": "Full article content in Markdown format with FAQ sections",
  "excerpt": "Brief 1-2 sentence summary for the article card",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "gameName": "${gameName}"
}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText = msg.content[0].type === 'text' ? msg.content[0].text : ''

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ArticleContent
      }
    } catch {
      console.error('Failed to parse JSON response')
    }

    return null
  } catch (error) {
    console.error('Error generating article:', error)
    return null
  }
}

export async function generateTierList(gameName: string, category: string = 'character'): Promise<TierListContent | null> {
  try {
    const prompt = `You are an expert tier list creator for GameHub, a gaming community website.

Create a tier list for ${category}s in ${gameName}.

Requirements:
- Include S, A, B, C, D tiers
- Each tier should have 2-5 items
- Include brief descriptions for each item
- Use game-specific terminology
- Realistic assessments based on current meta

Return JSON format:
{
  "gameName": "${gameName}",
  "category": "${category}",
  "patchVersion": "Latest",
  "entries": [
    {
      "name": "Character/Item Name",
      "grade": "S",
      "description": "Brief explanation of why this is in this tier"
    }
  ]
}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText = msg.content[0].type === 'text' ? msg.content[0].text : ''

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as TierListContent
      }
    } catch {
      console.error('Failed to parse JSON response')
    }

    return null
  } catch (error) {
    console.error('Error generating tier list:', error)
    return null
  }
}

export async function generateGameDescription(gameName: string, developer: string, releaseYear: number): Promise<string | null> {
  try {
    const prompt = `Write a compelling 100-150 word description for ${gameName} by ${developer}, released in ${releaseYear}.

Focus on:
- What makes the game unique
- Core gameplay mechanics
- Why players love it
- What type of player would enjoy it

Write in English, third person, engaging tone.
Do not use quotes or markdown formatting.
Return just the description text.`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    return msg.content[0].type === 'text' ? msg.content[0].text : null
  } catch (error) {
    console.error('Error generating game description:', error)
    return null
  }
}

export async function improveContent(content: string, focus: 'seo' | 'readability' | 'completeness'): Promise<string | null> {
  try {
    const focusInstructions = {
      seo: 'Improve SEO by adding relevant keywords naturally, improving headings, and adding meta-description-friendly phrases.',
      readability: 'Improve readability by using shorter paragraphs, bullet points, and clearer language.',
      completeness: 'Improve completeness by adding more details, examples, and covering edge cases.'
    }

    const prompt = `${focusInstructions[focus]}

Original content:
${content}

Return the improved version in the same format (Markdown for articles, plain text for descriptions).`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    return msg.content[0].type === 'text' ? msg.content[0].text : null
  } catch (error) {
    console.error('Error improving content:', error)
    return null
  }
}
