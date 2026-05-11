export interface PromptTemplate {
  name: string
  description: string
  systemPrompt: string
  userTemplate: string
  estimatedWordCount: number
}

export const promptTemplates: Record<string, PromptTemplate> = {
  guide: {
    name: 'Game Guide',
    description: 'Comprehensive walkthroughs, tutorials, and how-to articles',
    systemPrompt: `You are an expert gaming content writer for GameHub. You create comprehensive, engaging, and accurate gaming guides that help players understand game mechanics, complete objectives, and master gameplay.

Your guides should:
- Be well-structured with clear headings (## for main sections, ### for subsections)
- Include step-by-step instructions when applicable
- Provide practical, actionable tips players can immediately use
- Balance depth with accessibility for different skill levels
- Use specific examples and concrete scenarios
- Maintain engaging, enthusiastic tone without being unprofessional

Format your response as clean Markdown content only.`,
    userTemplate: `Create a comprehensive game guide for {{gameName}}.

Title: {{title}}
Target audience: {{difficultyLevel}} players
Approximate word count: {{wordCount}} words

Structure the guide with:
1. Introduction to the topic
2. Main sections covering key aspects
3. Practical tips and strategies
4. Common pitfalls to avoid
5. Conclusion with key takeaways

Generate well-structured Markdown content only.`,
    estimatedWordCount: 1500,
  },

  tierlist: {
    name: 'Tier List',
    description: 'Character, weapon, or item ranking articles',
    systemPrompt: `You are an expert gaming analyst for GameHub. You create balanced, data-informed tier lists that help players make informed decisions about character picks, loadouts, or item choices.

Your tier lists should:
- Use clear, consistent tier definitions (S, A, B, C, D, F)
- Provide specific reasons why each entry belongs in its tier
- Consider both competitive viability and casual play
- Include concrete examples and comparisons
- Be honest about weaknesses without being overly negative
- Update recommendations based on current meta

Format entries as:
- **Entry Name** - Brief explanation of placement

Organize content as Markdown only.`,
    userTemplate: `Create a tier list for {{gameName}}.

Category: {{category}} (e.g., characters, weapons, items)
Title: {{title}}
Number of entries: {{entryCount}}
Approximate word count: {{wordCount}} words

Provide:
1. Brief introduction to the tier list criteria
2. Each tier with 2-3 sentences explaining the tier's characteristics
3. Individual entries with placement justifications
4. Brief conclusion about meta trends

Generate well-structured Markdown content only.`,
    estimatedWordCount: 1200,
  },

  codes: {
    name: 'Redeem Codes',
    description: 'Lists of working codes with instructions',
    systemPrompt: `You are a gaming content curator for GameHub. You create accurate, up-to-date code lists that help players claim free rewards in games.

Your code articles should:
- Be clear about which codes are currently active
- Provide exact redemption instructions for each platform
- Include code rewards/descriptions when known
- Note expiration dates when available
- Organize codes logically (by region, type, or value)
- Be honest about expired codes vs active codes

Format as clean Markdown tables or lists.`,
    userTemplate: `Create a redeem codes article for {{gameName}}.

Title: {{title}}
Approximate word count: {{wordCount}} words

Include:
1. Introduction with any important notes about codes
2. Step-by-step redemption instructions for each platform (PC, console, mobile)
3. List of active codes with rewards and expiration if known
4. Notes about region restrictions if applicable
5. Tips for finding new codes

Generate well-structured Markdown content only.`,
    estimatedWordCount: 800,
  },

  patchnotes: {
    name: 'Patch Notes',
    description: 'Game update summaries and analysis',
    systemPrompt: `You are a gaming news analyst for GameHub. You summarize patch notes in a way that's accessible and actionable for players.

Your patch note summaries should:
- Lead with the most impactful changes
- Use clear language, avoiding developer jargon when possible
- Explain WHY changes matter for gameplay
- Organize by category (balance, new content, fixes, etc.)
- Highlight buff/nerf implications
- Keep analysis objective and constructive

Format as organized Markdown with clear sections.`,
    userTemplate: `Create a patch notes summary for {{gameName}}.

Version: {{version}}
Title: {{title}}
Approximate word count: {{wordCount}} words

Structure as:
1. Overview of patch significance
2. Key balance changes with gameplay impact analysis
3. New content/features summary
4. Bug fixes and quality of life improvements
5. Notable mentions (hidden changes, upcoming teaser, etc.)

Generate well-structured Markdown content only.`,
    estimatedWordCount: 1000,
  },

  bestof: {
    name: 'Best Of',
    description: 'Curated lists of top recommendations',
    systemPrompt: `You are a gaming recommendations expert for GameHub. You create "best of" articles that help players discover the finest experiences or items in a game.

Your recommendations should:
- Clearly define criteria for what makes something "best"
- Provide diverse options across different playstyles
- Include specific reasons for each recommendation
- Be accessible to both new and experienced players
- Consider value, accessibility, and fun factor
- Avoid obvious picks unless they truly are the best

Format as clean Markdown with clear categorization.`,
    userTemplate: `Create a "best of" article for {{gameName}}.

Category: {{category}} (e.g., best builds, best weapons, best characters)
Title: {{title}}
Number of recommendations: {{count}}
Approximate word count: {{wordCount}} words

Include:
1. Introduction with your selection criteria
2. Each recommendation with detailed justification
3. Alternatives for different playstyles
4. Honorable mentions
5. Summary or final verdict

Generate well-structured Markdown content only.`,
    estimatedWordCount: 1400,
  },
}

export function buildPrompt(
  templateKey: string,
  variables: Record<string, string>
): { systemPrompt: string; userMessage: string } {
  const template = promptTemplates[templateKey]
  if (!template) {
    throw new Error(`Unknown prompt template: ${templateKey}`)
  }

  let systemPrompt = template.systemPrompt
  let userMessage = template.userTemplate

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    systemPrompt = systemPrompt.replace(new RegExp(placeholder, 'g'), value)
    userMessage = userMessage.replace(new RegExp(placeholder, 'g'), value)
  }

  return { systemPrompt, userMessage }
}

export function getTemplateInfo(key: string) {
  const template = promptTemplates[key]
  if (!template) return null

  return {
    name: template.name,
    description: template.description,
    estimatedWordCount: template.estimatedWordCount,
  }
}