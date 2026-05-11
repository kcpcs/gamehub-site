import { NextRequest, NextResponse } from 'next/server'
import { generateArticleContent } from '@/lib/claude'
import { buildPrompt, getTemplateInfo } from '@/lib/prompts'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

interface GenerateRequest {
  title: string
  game_slug: string
  article_type: 'guide' | 'tierlist' | 'codes' | 'best' | 'patch-notes'
  custom_prompt?: string
  target_word_count?: number
}

function verifyInternalToken(req: NextRequest): boolean {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const secretHeader = req.headers.get('INTERNAL_API_SECRET')
  return token === process.env.INTERNAL_API_SECRET || secretHeader === process.env.INTERNAL_API_SECRET
}

export async function POST(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  try {
    const body: GenerateRequest = await req.json()

    if (!body.title || !body.game_slug || !body.article_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, game_slug, article_type', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const game = await db.game.findUnique({
      where: { slug: body.game_slug },
      select: { id: true, name: true },
    })

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const cacheKey = `ai:generate:${body.game_slug}:${body.article_type}:${Date.now()}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const templateInfo = getTemplateInfo(body.article_type)
    const wordCount = body.target_word_count || templateInfo?.estimatedWordCount || 1500

    let content: string

    if (body.custom_prompt) {
      content = await generateArticleContent(
        body.title,
        game.name,
        body.article_type,
        wordCount
      )
    } else {
      const { systemPrompt, userMessage } = buildPrompt(body.article_type, {
        gameName: game.name,
        title: body.title,
        wordCount: wordCount.toString(),
        difficultyLevel: 'all',
        category: 'general',
        entryCount: '10',
        count: '5',
        version: 'latest',
      })

      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: Math.max(wordCount * 2, 4096),
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      })

      const textContent = response.content.find((block) => block.type === 'text')
      content = textContent?.type === 'text' ? textContent.text : ''
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const excerpt = content.split('\n').find(line => line.length > 50)?.slice(0, 200) + '...' || ''

    const result = {
      success: true,
      data: {
        slug,
        title: body.title,
        content,
        excerpt,
        word_count: content.split(/\s+/).length,
        read_time: Math.ceil(content.split(/\s+/).length / 200),
        game_id: game.id,
        game_slug: body.game_slug,
        article_type: body.article_type,
        status: 'draft',
      },
    }

    await redis.set(cacheKey, result, { ex: 3600 })

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error('[POST /api/internal/generate]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to generate content', code: 'GENERATION_ERROR' },
      { status: 500 }
    )
  }
}