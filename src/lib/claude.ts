import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.jiekou.ai/anthropic',
})

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeResponse {
  content: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export const MODEL_CONFIG = {
  sonnet: {
    id: process.env.DEFAULT_CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    description: '平衡速度与质量，适合日常开发和内容生成',
  },
  opus: {
    id: process.env.DEFAULT_OPUS_MODEL || 'claude-opus-4-1-20250805',
    name: 'Claude Opus 4',
    description: '最强推理能力，适合复杂任务和架构设计',
  },
  haiku: {
    id: process.env.DEFAULT_HAIKU_MODEL || 'claude-3-5-haiku',
    name: 'Claude Haiku',
    description: '快速响应，适合简单任务和批量处理',
  },
}

export async function createClaudeCompletion(
  messages: ClaudeMessage[],
  systemPrompt?: string,
  maxTokens: number = 4096,
  model: keyof typeof MODEL_CONFIG = 'sonnet'
): Promise<ClaudeResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const modelId = MODEL_CONFIG[model]?.id || MODEL_CONFIG.sonnet.id

  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  })

  const textContent = response.content.find(
    (block) => block.type === 'text'
  )

  return {
    content: textContent?.type === 'text' ? textContent.text : '',
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

export async function generateArticleContent(
  title: string,
  gameName: string,
  articleType: string,
  targetWordCount: number = 1500
): Promise<string> {
  const systemPrompt = `You are an expert gaming content writer for GameHub. You create comprehensive, engaging, and accurate gaming guides, tier lists, codes, and walkthroughs.

Your content should:
- Be well-structured with clear headings (## for main sections, ### for subsections)
- Include practical, actionable information
- Use proper Markdown formatting
- Be informative without unnecessary fluff
- Include relevant game-specific terminology
- Be appropriate for gamers of various skill levels

Generate content that matches the article type specified by the user.`

  const userMessage = `Create a ${articleType} article for ${gameName}.

Title: ${title}
Target word count: approximately ${targetWordCount} words

Please generate comprehensive, well-structured content following the guidelines in the system prompt. Include:
- An engaging introduction
- Main content sections with practical information
- Relevant details, tips, or strategies
- A conclusion with key takeaways

Format your response as clean Markdown content only, without any additional commentary or meta-information.`

  const response = await createClaudeCompletion(
    [
      { role: 'user', content: userMessage },
    ],
    systemPrompt,
    Math.max(targetWordCount * 2, 4096)
  )

  return response.content
}

export async function improveContent(
  originalContent: string,
  instructions: string
): Promise<string> {
  const systemPrompt = `You are an expert gaming content editor. Your task is to improve and refine existing content while maintaining its original structure and key information.`

  const response = await createClaudeCompletion(
    [
      { role: 'user', content: `Original content:\n\n${originalContent}\n\n\nImprovement instructions:\n\n${instructions}` },
    ],
    systemPrompt,
    4096
  )

  return response.content
}

export async function generateTierList(gameName: string, category: string = 'characters'): Promise<string> {
  const systemPrompt = `You are an expert gaming analyst for GameHub. You create balanced, data-informed tier lists that help players make informed decisions about character picks, loadouts, or item choices.

Your tier lists should:
- Use clear, consistent tier definitions (S, A, B, C, D, F)
- Provide specific reasons why each entry belongs in its tier
- Consider both competitive viability and casual play
- Include concrete examples and comparisons
- Be honest about weaknesses without being overly negative
- Update recommendations based on current meta

Format entries as:
- **Entry Name** - Brief explanation of placement

Organize content as Markdown only.`

  const userMessage = `Create a tier list for ${gameName}.

Category: ${category}
Number of entries: 15-20
Approximate word count: 1200 words

Provide:
1. Brief introduction to the tier list criteria
2. Each tier with 2-3 sentences explaining the tier's characteristics
3. Individual entries with placement justifications
4. Brief conclusion about meta trends

Generate well-structured Markdown content only.`

  const response = await createClaudeCompletion(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    4096
  )

  return response.content
}

export async function analyzePatchNotes(gameName: string, version: string, notes: string): Promise<string> {
  const systemPrompt = `You are a gaming news analyst for GameHub. You summarize and analyze patch notes in a way that's accessible and actionable for players.

Your patch note summaries should:
- Lead with the most impactful changes
- Use clear language, avoiding developer jargon when possible
- Explain WHY changes matter for gameplay
- Organize by category (balance, new content, fixes, etc.)
- Highlight buff/nerf implications
- Keep analysis objective and constructive

Format as organized Markdown with clear sections.`

  const userMessage = `Analyze these patch notes for ${gameName} version ${version}:

${notes}

Provide a comprehensive analysis including:
1. Overview of patch significance
2. Key balance changes with gameplay impact
3. New content/features summary
4. Bug fixes and quality of life improvements
5. Notable mentions

Generate well-structured Markdown content only.`

  const response = await createClaudeCompletion(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    4096
  )

  return response.content
}