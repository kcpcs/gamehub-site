// TRAE AI 模型支持 - 兼容模式
// 同时支持：Claude API 和 TRAE 内置国产模型
// 注意：建议优先使用 TRAE 内置国产模型（完全免费）

import Anthropic from '@anthropic-ai/sdk'

// 检查是否配置了 Claude API（仅在需要时才初始化
let anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[AI] Claude API 未配置，使用 TRAE 内置模型')
    return null
  }
  
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.jiekou.ai/anthropic',
    })
  }
  return anthropic
}

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeResponse {
  content: string
  model: string
  usage: {
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens?: number
  }
}

// 原 Claude 模型配置（保留兼容性）
export const CLAUDE_MODEL_CONFIG = {
  sonnet: {
    id: process.env.DEFAULT_CLAUDE_MODEL || 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4',
    description: '平衡速度与质量，适合日常开发和内容生成',
  },
  opus: {
    id: process.env.DEFAULT_OPUS_MODEL || 'claude-opus-4-7',
    name: 'Claude Opus 4',
    description: '最强推理能力，适合复杂任务和架构设计',
  },
  haiku: {
    id: process.env.DEFAULT_HAIKU_MODEL || 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku',
    description: '快速响应，适合简单任务和批量处理',
  },
}

// 国产模型配置（优先使用）
export const INTERNAL_MODEL_CONFIG = {
  doubao_code: {
    id: 'doubao-seed-2.0-code',
    name: 'Doubao-Seed-2.0-Code',
    description: '代码专家 - TRAE内置免费',
  },
  deepseek_pro: {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek-V4-Pro',
    description: '推理王者 - TRAE内置免费',
  },
  glm_5_1: {
    id: 'glm-5.1',
    name: 'GLM-5.1',
    description: '综合平衡 - TRAE内置免费',
  },
  deepseek_flash: {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek-V4-Flash',
    description: '极速响应 - TRAE内置免费',
  },
  kimi_2_6: {
    id: 'kimi-k2.6',
    name: 'Kimi-K2.6',
    description: '长文本专家 - TRAE内置免费',
  },
}

// 默认使用内置模型，只有在配置了 API Key 时才使用 Claude
export const USE_INTERNAL_MODELS = !process.env.ANTHROPIC_API_KEY || process.env.FORCE_INTERNAL_MODELS

// 兼容接口 - 根据配置决定使用哪种模型
export const getModelConfig = () => {
  if (USE_INTERNAL_MODELS) {
    return INTERNAL_MODEL_CONFIG
  }
  return CLAUDE_MODEL_CONFIG
}

// 模型配置（向后兼容
export const MODEL_CONFIG = USE_INTERNAL_MODELS ? INTERNAL_MODEL_CONFIG : CLAUDE_MODEL_CONFIG

export async function createClaudeCompletion(
  messages: ClaudeMessage[],
  systemPrompt?: string,
  maxTokens: number = 4096,
  model: keyof typeof MODEL_CONFIG = 'sonnet',
  cacheControl?: { type: 'ephemeral' }
): Promise<ClaudeResponse> {
  
  // 如果使用内置模型模式，返回提示信息
  if (USE_INTERNAL_MODELS) {
    console.log('[AI] 使用 TRAE 内置模型模式')
    console.log('[AI] 请在 TRAE SOLO 对话框中选择对应模型')
    
    // 兼容返回 - 实际工作由 TRAE SOLO 内置模型完成
    return {
      content: 'TRAE_INTERNAL_MODEL_MODE',
      model: model,
      usage: {
        input_tokens: 0,
        output_tokens: 0,
      },
    }
  }

  // 否则使用 Claude API（仅在配置了 API Key 时）
  const client = getAnthropicClient()
  if (!client) {
    throw new Error('ANTHROPIC_API_KEY is not configured for Claude API')
  }

  const modelId = MODEL_CONFIG[model]?.id || (MODEL_CONFIG as any).sonnet?.id || 'claude-sonnet-4-6'

  const response = await client.messages.create({
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
    model: modelId,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_read_input_tokens: response.usage.cache_read_input_tokens ?? undefined,
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