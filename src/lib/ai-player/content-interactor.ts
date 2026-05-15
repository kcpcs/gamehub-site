// @ts-nocheck
import { createClaudeCompletion } from '@/lib/claude'
import { db } from '@/lib/db'
import type { AIPlayer } from '@prisma/client'

export interface ContentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  summary: string
  tone: string
}

export interface GeneratedContent {
  content: string
  confidence: number
}

const AI_EXPOSURE_PATTERNS = [
  /\bas an (artificial intelligence|AI|language model)\b/i,
  /\bChatGPT\b/i, /\bClaude\b/i, /\bGPT[- ]?\d/i,
  /\bI (don't|cannot|can't) have (personal|real|actual) (experience|opinions)\b/i,
  /\bas a (large )?language model\b/i, /\bI am (an )?AI\b/i,
  /\bI hope this (message|comment|post) finds you well\b/i,
  /\bIt is important to (note|remember|consider)\b/i,
]

const REPETITIVE_PATTENS = [
  /(\b\w+\b)\s+\1\s+\1/i,
  /(.{20,})\1{2,}/,
]

function calculateQualityScore(content: string, minLen: number, maxLen: number): number {
  if (!content || content.length < minLen) return 0.3
  if (content.length > maxLen * 1.5) return 0.5
  let score = 0.7

  const len = content.length
  const idealMin = minLen * 0.8
  const idealMax = maxLen * 1.1
  if (len >= idealMin && len <= idealMax) score += 0.1

  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0)
  if (sentences.length >= 2) score += 0.05
  if (sentences.length >= 3) score += 0.02

  const avgSentenceLen = sentences.reduce((sum, s) => sum + s.trim().length, 0) / Math.max(sentences.length, 1)
  if (avgSentenceLen > 10 && avgSentenceLen < 200) score += 0.03

  for (const pattern of AI_EXPOSURE_PATTERNS) {
    if (pattern.test(content)) {
      score -= 0.25
      break
    }
  }

  for (const pattern of REPETITIVE_PATTENS) {
    if (pattern.test(content)) {
      score -= 0.15
      break
    }
  }

  const capsRatio = (content.match(/[A-Z]/g) || []).length / Math.max(content.length, 1)
  if (capsRatio > 0.3 && content.length > 20) score -= 0.1

  return Math.max(0.1, Math.min(0.99, Math.round(score * 100) / 100))
}

export class ContentInteractor {
  private player: AIPlayer

  constructor(player: AIPlayer) {
    this.player = player
  }

  async analyzeContent(text: string): Promise<ContentAnalysis> {
    const systemPrompt = `
      You are a content analysis AI. Analyze the given text and provide:
      1. Sentiment: positive, negative, or neutral
      2. Topics: list of key topics discussed
      3. Summary: brief summary of the content
      4. Tone: the tone of the content (e.g., formal, casual, humorous, angry)

      Format your response as JSON with these keys: sentiment, topics, summary, tone.
    `

    const response = await createClaudeCompletion(
      [{ role: 'user', content: text }],
      systemPrompt,
      512
    )

    try {
      return JSON.parse(response.content)
    } catch {
      return {
        sentiment: 'neutral',
        topics: [],
        summary: text.substring(0, 100),
        tone: 'neutral',
      }
    }
  }

  async generateReply(context: string, parentContent?: string, articleSlug?: string): Promise<GeneratedContent> {
    const tone = this.getTone()
    const interests = this.getInterests()
    const personality = this.getPersonalityDescription()

    const conversationHistory = articleSlug ? await this.getConversationHistory(articleSlug) : []

    let systemPrompt = `
      You are ${this.player.username}, a ${this.player.occupation || 'gamer'} aged ${this.player.age || 'unknown'}.
      Personality: ${personality}
      Interests: ${interests.join(', ')}
      Tone: ${tone}

      Generate a natural, human-like reply to the given context.
      The reply should be:
      - Consistent with your personality and interests
      - Relevant to the context
      - Not too long (1-3 sentences)
      - Sound natural, not robotic
      - Use appropriate emojis if fitting your tone
      - Avoid formal language unless your tone is professional
    `

    if (conversationHistory.length > 0) {
      systemPrompt += `
        Previous conversation (for context):
        ${conversationHistory.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}
      `
    }

    systemPrompt += `
      Only output the reply text, no extra formatting.
    `

    const userMessage = parentContent
      ? `Parent comment: ${parentContent}\n\nNew comment: ${context}\n\nYour reply:`
      : `Context: ${context}\n\nYour reply:`

    const response = await createClaudeCompletion(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      512,
      'sonnet',
      { type: 'ephemeral' }
    )

    return {
      content: response.content.trim(),
      confidence: calculateQualityScore(response.content.trim(), 5, 300),
    }
  }

  async generatePost(): Promise<GeneratedContent> {
    const tone = this.getTone()
    const interests = this.getInterests()
    const personality = this.getPersonalityDescription()

    const systemPrompt = `
      You are ${this.player.username}, a ${this.player.occupation || 'gamer'} aged ${this.player.age || 'unknown'}.
      Personality: ${personality}
      Interests: ${interests.join(', ')}
      Tone: ${tone}

      Generate a short forum post or comment about gaming topics you're interested in.
      The post should be:
      - 3-5 sentences long
      - Personal and conversational
      - Relevant to gaming or your interests
      - Include a question or discussion point to encourage replies
      - Sound natural and authentic
      - Use appropriate emojis if fitting your tone

      Only output the post content, no title or extra formatting.
    `

    const userMessage = `Write a post about one of your interests: ${interests.join(', ')}. Make it engaging!`

    const response = await createClaudeCompletion(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      1024
    )

    return {
      content: response.content.trim(),
      confidence: calculateQualityScore(response.content.trim(), 50, 2000),
    }
  }

  async generateComment(articleContent: string): Promise<GeneratedContent> {
    const tone = this.getTone()
    const interests = this.getInterests()
    const personality = this.getPersonalityDescription()

    const systemPrompt = `
      You are ${this.player.username}, a ${this.player.occupation || 'gamer'} aged ${this.player.age || 'unknown'}.
      Personality: ${personality}
      Interests: ${interests.join(', ')}
      Tone: ${tone}

      Generate a natural comment on the given article excerpt.
      The comment should be:
      - 1-3 sentences long
      - Relevant to the article content
      - Express an opinion or ask a question
      - Sound like a real user commenting
      - Use appropriate emojis if fitting your tone

      Only output the comment text, no extra formatting.
    `

    const userMessage = `Article excerpt: ${articleContent.substring(0, 500)}...\n\nYour comment:`

    const response = await createClaudeCompletion(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      512,
      'sonnet',
      { type: 'ephemeral' }
    )

    return {
      content: response.content.trim(),
      confidence: calculateQualityScore(response.content.trim(), 10, 500),
    }
  }

  private async getConversationHistory(articleSlug: string): Promise<string[]> {
    try {
      const comments = await db.comment.findMany({
        where: { article_slug: articleSlug },
        select: {
          author_username: true,
          content: true,
          created_at: true,
        },
        orderBy: { created_at: 'asc' },
        take: 10,
      })

      return comments.map(
        (c) =>
          `${c.author_username}: ${c.content.substring(0, 100)}${c.content.length > 100 ? '...' : ''}`
      )
    } catch {
      return []
    }
  }

  private getTone(): string {
    const personality = typeof this.player.personality === 'string'
      ? JSON.parse(this.player.personality)
      : this.player.personality

    return personality.tone || 'friendly'
  }

  private getInterests(): string[] {
    return typeof this.player.interests === 'string' 
      ? JSON.parse(this.player.interests) 
      : this.player.interests
  }

  private getPersonalityDescription(): string {
    const personality = typeof this.player.personality === 'string' 
      ? JSON.parse(this.player.personality) 
      : this.player.personality
    
    const traits: string[] = []
    if (personality.introversion !== undefined) {
      traits.push(personality.introversion > 0.6 ? 'introverted' : 'extroverted')
    }
    if (personality.agreeableness !== undefined) {
      traits.push(personality.agreeableness > 0.6 ? 'agreeable' : 'opinionated')
    }
    if (personality.conscientiousness !== undefined) {
      traits.push(personality.conscientiousness > 0.6 ? 'thoughtful' : 'spontaneous')
    }
    if (personality.neuroticism !== undefined) {
      traits.push(personality.neuroticism > 0.6 ? 'emotional' : 'calm')
    }
    if (personality.openness !== undefined) {
      traits.push(personality.openness > 0.6 ? 'creative' : 'practical')
    }

    return traits.length > 0 ? traits.join(', ') : 'friendly'
  }
}

export async function getArticleContent(slug: string): Promise<string | null> {
  const article = await db.article.findUnique({
    where: { slug },
    select: { content: true, title: true },
  })

  return article ? `${article.title}\n\n${article.content}` : null
}

export async function getCommentContent(commentId: string): Promise<string | null> {
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { content: true },
  })

  return comment?.content || null
}
