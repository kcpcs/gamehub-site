import type { AIActivityType } from '@prisma/client'

// ─────────────────────────────────────────
// Player Type Definitions
// ─────────────────────────────────────────

export type PlayerType =
  | 'hardcore_gamer'
  | 'casual_player'
  | 'guide_writer'
  | 'code_hunter'
  | 'news_enthusiast'
  | 'community_helper'

// ─────────────────────────────────────────
// Preset Usernames and Avatars by Player Type
// ─────────────────────────────────────────

export const PLAYER_PRESETS: Record<PlayerType, Array<{ username: string; seed: string }>> = {
  hardcore_gamer: [
    { username: 'ProSlayer99', seed: 'ProSlayer99' },
    { username: 'GameBeast_X', seed: 'GameBeast_X' },
    { username: 'RankedMaster', seed: 'RankedMaster' },
    { username: 'NoobSlayer42', seed: 'NoobSlayer42' },
    { username: 'EliteGamer88', seed: 'EliteGamer88' },
    { username: 'DiamondRank', seed: 'DiamondRank' },
    { username: 'SkillzMaster', seed: 'SkillzMaster' },
    { username: 'ClutchPlayer', seed: 'ClutchPlayer' },
    { username: 'GG_EZ_PZ', seed: 'GG_EZ_PZ' },
    { username: 'FPS_Beast', seed: 'FPS_Beast' },
    { username: 'MetaHunter', seed: 'MetaHunter' },
    { username: 'SoloQueueKing', seed: 'SoloQueueKing' },
    { username: 'ProGamer69', seed: 'ProGamer69' },
  ],
  casual_player: [
    { username: 'CozyGamer', seed: 'CozyGamer' },
    { username: 'LazyGamer88', seed: 'LazyGamer88' },
    { username: 'ChillPlayer', seed: 'ChillPlayer' },
    { username: 'GameNerd42', seed: 'GameNerd42' },
    { username: 'HappyGamer', seed: 'HappyGamer' },
    { username: 'RelaxedPlay', seed: 'RelaxedPlay' },
    { username: 'CuteGamerGirl', seed: 'CuteGamerGirl' },
    { username: 'SleepyGamer', seed: 'SleepyGamer' },
    { username: 'LunaPlayz', seed: 'LunaPlayz' },
    { username: 'SunshineGamer', seed: 'SunshineGamer' },
    { username: 'MellowPlayer', seed: 'MellowPlayer' },
    { username: 'CozyGamerBabe', seed: 'CozyGamerBabe' },
    { username: 'GamerMom', seed: 'GamerMom' },
  ],
  guide_writer: [
    { username: 'GuideMaster', seed: 'GuideMaster' },
    { username: 'ProTutorial', seed: 'ProTutorial' },
    { username: 'HowToGamer', seed: 'HowToGamer' },
    { username: 'StrategyNerd', seed: 'StrategyNerd' },
    { username: 'GameProfessor', seed: 'GameProfessor' },
    { username: 'TipsExpert', seed: 'TipsExpert' },
    { username: 'WalkthroughKing', seed: 'WalkthroughKing' },
    { username: 'GameMentor', seed: 'GameMentor' },
    { username: 'TutorialGuru', seed: 'TutorialGuru' },
    { username: 'StrategyGuide', seed: 'StrategyGuide' },
    { username: 'ProGuideMaker', seed: 'ProGuideMaker' },
    { username: 'GameCoach', seed: 'GameCoach' },
    { username: 'ExpertGamer', seed: 'ExpertGamer' },
  ],
  code_hunter: [
    { username: 'CodeHunter_X', seed: 'CodeHunter_X' },
    { username: 'FreebieFinder', seed: 'FreebieFinder' },
    { username: 'RedeemMaster', seed: 'RedeemMaster' },
    { username: 'PromoHunter', seed: 'PromoHunter' },
    { username: 'CodeNinja', seed: 'CodeNinja' },
    { username: 'GiveawayKing', seed: 'GiveawayKing' },
    { username: 'FreeCodeGuy', seed: 'FreeCodeGuy' },
    { username: 'RewardHunter', seed: 'RewardHunter' },
    { username: 'CodeFinder', seed: 'CodeFinder' },
    { username: 'GiftCodePro', seed: 'GiftCodePro' },
    { username: 'FreeStuffPro', seed: 'FreeStuffPro' },
    { username: 'DealHunter', seed: 'DealHunter' },
    { username: 'CodeMaster', seed: 'CodeMaster' },
  ],
  news_enthusiast: [
    { username: 'NewsJunkie', seed: 'NewsJunkie' },
    { username: 'PatchNotesPro', seed: 'PatchNotesPro' },
    { username: 'GameReporter', seed: 'GameReporter' },
    { username: 'EsportsFan', seed: 'EsportsFan' },
    { username: 'LeakHunter', seed: 'LeakHunter' },
    { username: 'GameNewsGuy', seed: 'GameNewsGuy' },
    { username: 'UpdateWatcher', seed: 'UpdateWatcher' },
    { username: 'DevTracker', seed: 'DevTracker' },
    { username: 'RoadmapFan', seed: 'RoadmapFan' },
    { username: 'NewsGeek', seed: 'NewsGeek' },
    { username: 'GamingReporter', seed: 'GamingReporter' },
    { username: 'PatchTracker', seed: 'PatchTracker' },
    { username: 'GameJournalist', seed: 'GameJournalist' },
  ],
  community_helper: [
    { username: 'HelpfulGamer', seed: 'HelpfulGamer' },
    { username: 'CommunityHero', seed: 'CommunityHero' },
    { username: 'NewPlayerHelper', seed: 'NewPlayerHelper' },
    { username: 'FriendlyMod', seed: 'FriendlyMod' },
    { username: 'SupportGuy', seed: 'SupportGuy' },
    { username: 'HelpDeskGamer', seed: 'HelpDeskGamer' },
    { username: 'CommunityHelper', seed: 'CommunityHelper' },
    { username: 'GameAdvisor', seed: 'GameAdvisor' },
    { username: 'NiceGamer', seed: 'NiceGamer' },
    { username: 'SupportHero', seed: 'SupportHero' },
    { username: 'FriendlyHelper', seed: 'FriendlyHelper' },
    { username: 'CommunityNurse', seed: 'CommunityNurse' },
    { username: 'HelpingHand', seed: 'HelpingHand' },
  ],
}

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

export interface BehaviorConfigDefaults {
  wake_up_time: string
  sleep_time: string
  activity_interval_min: number
  activity_interval_max: number
  post_probability: number
  comment_probability: number
  reply_probability: number
  typing_speed_min: number
  typing_speed_max: number
  thinking_time_min: number
  thinking_time_max: number
}

export interface PersonalityDefaults {
  tone: string
  traits: string[]
  activity_level: number
}

export interface PlayerTypeConfig {
  behavior: BehaviorConfigDefaults
  personality: PersonalityDefaults
  topics: string[]
}

// ─────────────────────────────────────────
// Default Behavior Configs by Player Type
// ─────────────────────────────────────────

export const PLAYER_TYPE_CONFIGS: Record<PlayerType, PlayerTypeConfig> = {
  hardcore_gamer: {
    behavior: {
      wake_up_time: '10:00',
      sleep_time: '02:00',
      activity_interval_min: 180,
      activity_interval_max: 900,
      post_probability: 0.22,
      comment_probability: 0.38,
      reply_probability: 0.30,
      typing_speed_min: 45,
      typing_speed_max: 80,
      thinking_time_min: 2,
      thinking_time_max: 8,
    },
    personality: {
      tone: 'analytical',
      traits: ['competitive', 'detail-oriented', 'knowledgeable', 'direct'],
      activity_level: 0.85,
    },
    topics: [
      'tier lists',
      'meta builds',
      'competitive strategy',
      'character optimization',
      'DPS calculations',
      'endgame content',
      'PvP',
      'speedrunning',
    ],
  },

  casual_player: {
    behavior: {
      wake_up_time: '08:00',
      sleep_time: '23:00',
      activity_interval_min: 600,
      activity_interval_max: 3600,
      post_probability: 0.06,
      comment_probability: 0.30,
      reply_probability: 0.20,
      typing_speed_min: 20,
      typing_speed_max: 45,
      thinking_time_min: 3,
      thinking_time_max: 12,
    },
    personality: {
      tone: 'friendly',
      traits: ['laid-back', 'supportive', 'humorous', 'positive'],
      activity_level: 0.4,
    },
    topics: [
      'casual gaming',
      'cute characters',
      'exploration',
      'events',
      'daily rewards',
      'screenshots',
      'fan art appreciation',
    ],
  },

  guide_writer: {
    behavior: {
      wake_up_time: '08:00',
      sleep_time: '23:00',
      activity_interval_min: 600,
      activity_interval_max: 2400,
      post_probability: 0.28,
      comment_probability: 0.27,
      reply_probability: 0.35,
      typing_speed_min: 35,
      typing_speed_max: 60,
      thinking_time_min: 5,
      thinking_time_max: 15,
    },
    personality: {
      tone: 'formal',
      traits: ['thorough', 'educational', 'patient', 'structured'],
      activity_level: 0.7,
    },
    topics: [
      'beginner guides',
      'advanced tutorials',
      'game mechanics',
      'resource optimization',
      'progression tips',
      'walkthroughs',
      'hidden secrets',
    ],
  },

  code_hunter: {
    behavior: {
      wake_up_time: '06:00',
      sleep_time: '23:00',
      activity_interval_min: 300,
      activity_interval_max: 1800,
      post_probability: 0.18,
      comment_probability: 0.32,
      reply_probability: 0.38,
      typing_speed_min: 38,
      typing_speed_max: 65,
      thinking_time_min: 1,
      thinking_time_max: 5,
    },
    personality: {
      tone: 'casual',
      traits: ['resourceful', 'quick', 'sharing', 'alert'],
      activity_level: 0.7,
    },
    topics: [
      'redeem codes',
      'freebies',
      'limited events',
      'promo tracking',
      'reward optimization',
      'giveaways',
      'daily logins',
    ],
  },

  news_enthusiast: {
    behavior: {
      wake_up_time: '07:00',
      sleep_time: '23:30',
      activity_interval_min: 360,
      activity_interval_max: 1800,
      post_probability: 0.20,
      comment_probability: 0.38,
      reply_probability: 0.30,
      typing_speed_min: 42,
      typing_speed_max: 68,
      thinking_time_min: 2,
      thinking_time_max: 9,
    },
    personality: {
      tone: 'enthusiastic',
      traits: ['observant', 'timely', 'informed', 'speculative'],
      activity_level: 0.7,
    },
    topics: [
      'patch notes',
      'game updates',
      'balance changes',
      'roadmaps',
      'developer news',
      'leaks',
      'upcoming content',
      'esports',
    ],
  },

  community_helper: {
    behavior: {
      wake_up_time: '07:00',
      sleep_time: '23:30',
      activity_interval_min: 300,
      activity_interval_max: 1500,
      post_probability: 0.05,
      comment_probability: 0.25,
      reply_probability: 0.60,
      typing_speed_min: 35,
      typing_speed_max: 60,
      thinking_time_min: 3,
      thinking_time_max: 10,
    },
    personality: {
      tone: 'friendly',
      traits: ['patient', 'empathetic', 'knowledgeable', 'supportive'],
      activity_level: 0.75,
    },
    topics: [
      'troubleshooting',
      'FAQ answers',
      'new player help',
      'community support',
      'game mechanics explanations',
      'team building advice',
    ],
  },
}

// ─────────────────────────────────────────
// Activity Scheduling Constants
// ─────────────────────────────────────────

export interface SchedulingConstants {
  /** Minimum ms between any two actions for a single player */
  minIntervalMs: number
  /** Maximum ms between any two actions for a single player */
  maxIntervalMs: number
  /** How often the scheduler tick runs (ms) */
  schedulerTickMs: number
  /** Maximum number of players that can be active simultaneously */
  maxConcurrentPlayers: number
  /** Time (ms) to wait before retrying a failed action */
  retryDelayMs: number
  /** Maximum retry attempts for a single action */
  maxRetries: number
  /** Jitter factor (0-1) applied to intervals for more natural timing */
  jitterFactor: number
}

export const SCHEDULING: SchedulingConstants = {
  minIntervalMs: 5_000,
  maxIntervalMs: 600_000,
  schedulerTickMs: 5_000,
  maxConcurrentPlayers: 10,
  retryDelayMs: 30_000,
  maxRetries: 2,
  jitterFactor: 0.3,
}

// ─────────────────────────────────────────
// Content Generation Prompts
// ─────────────────────────────────────────

export interface ContentPromptTemplate {
  system: string
  user: string
  maxTokens: number
}

export const CONTENT_PROMPTS: Record<string, ContentPromptTemplate> = {
  post: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a short forum post about gaming topics you're interested in.
The post should be:
- 3-5 sentences long
- Personal and conversational
- Relevant to gaming or your interests
- Include a question or discussion point to encourage replies
- Sound natural and authentic
- Use appropriate emojis if fitting your tone

Only output the post content, no title or extra formatting.`,
    user: 'Write a post about one of your interests: {interests}. Make it engaging!',
    maxTokens: 1024,
  },

  comment: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a natural comment on the given article excerpt.
The comment should be:
- 1-3 sentences long
- Relevant to the article content
- Express an opinion or ask a question
- Sound like a real user commenting
- Use appropriate emojis if fitting your tone

Only output the comment text, no extra formatting.`,
    user: 'Article excerpt: {article_content}\n\nYour comment:',
    maxTokens: 512,
  },

  reply: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a natural, human-like reply to the given context.
The reply should be:
- Consistent with your personality and interests
- Relevant to the context
- Not too long (1-3 sentences)
- Sound natural, not robotic
- Use appropriate emojis if fitting your tone
- Avoid formal language unless your tone is professional

Only output the reply text, no extra formatting.`,
    user: 'Parent comment: {parent_content}\n\nYour reply:',
    maxTokens: 512,
  },

  guide_post: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a helpful gaming guide snippet or tip.
The content should be:
- 5-8 sentences with clear structure
- Include actionable advice
- Reference specific game mechanics where relevant
- Be informative and well-organized
- Use bullet points or numbered steps if appropriate

Only output the guide content, no meta commentary.`,
    user: 'Write a helpful tip or mini-guide about: {topic}',
    maxTokens: 1536,
  },

  code_share: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a comment sharing or verifying a game redeem code.
The comment should be:
- Brief (1-2 sentences)
- Include confirmation whether the code worked
- Mention what reward it gives if known
- Sound natural and helpful

Only output the comment text, no extra formatting.`,
    user: 'Context about the code: {context}\n\nYour comment:',
    maxTokens: 256,
  },

  news_discussion: {
    system: `You are {username}, a {occupation} aged {age}.
Personality: {personality_description}
Interests: {interests}
Tone: {tone}

Generate a comment discussing a game update or news article.
The comment should be:
- 2-4 sentences
- Share your opinion on the changes
- Speculate on impact or ask what others think
- Reference specific details from the news

Only output the comment text, no extra formatting.`,
    user: 'News/update content: {article_content}\n\nYour reaction:',
    maxTokens: 512,
  },
}

// ─────────────────────────────────────────
// Rate Limiting Rules
// ─────────────────────────────────────────

export interface RateLimitRule {
  /** Maximum actions allowed in the time window */
  maxActions: number
  /** Time window in milliseconds */
  windowMs: number
}

export interface RateLimits {
  /** Max posts per player per hour */
  postsPerHour: RateLimitRule
  /** Max comments per player per day */
  commentsPerDay: RateLimitRule
  /** Max replies per player per hour */
  repliesPerHour: RateLimitRule
  /** Max likes per player per hour */
  likesPerHour: RateLimitRule
  /** Max total actions per player per day */
  totalActionsPerDay: RateLimitRule
  /** Max actions per player per minute (burst protection) */
  burstPerMinute: RateLimitRule
}

export const RATE_LIMITS: RateLimits = {
  postsPerHour: {
    maxActions: 2,
    windowMs: 60 * 60 * 1000,
  },
  commentsPerDay: {
    maxActions: 15,
    windowMs: 24 * 60 * 60 * 1000,
  },
  repliesPerHour: {
    maxActions: 5,
    windowMs: 60 * 60 * 1000,
  },
  likesPerHour: {
    maxActions: 10,
    windowMs: 60 * 60 * 1000,
  },
  totalActionsPerDay: {
    maxActions: 50,
    windowMs: 24 * 60 * 60 * 1000,
  },
  burstPerMinute: {
    maxActions: 3,
    windowMs: 60 * 1000,
  },
}

/** Maps activity types to their corresponding rate limit key */
export const ACTIVITY_RATE_LIMIT_MAP: Record<AIActivityType, keyof RateLimits> = {
  post: 'postsPerHour',
  comment: 'commentsPerDay',
  reply: 'repliesPerHour',
  like: 'likesPerHour',
  view: 'totalActionsPerDay',
  share: 'totalActionsPerDay',
}

// ─────────────────────────────────────────
// Quality Control Settings
// ─────────────────────────────────────────

export interface QualityControlSettings {
  /** Minimum character length for a post */
  minPostLength: number
  /** Maximum character length for a post */
  maxPostLength: number
  /** Minimum character length for a comment */
  minCommentLength: number
  /** Maximum character length for a comment */
  maxCommentLength: number
  /** Minimum character length for a reply */
  minReplyLength: number
  /** Maximum character length for a reply */
  maxReplyLength: number
  /** Minimum confidence score (0-1) required to publish content */
  minConfidenceScore: number
  /** Words/phrases that should never appear in generated content */
  bannedWords: string[]
  /** Patterns that indicate AI-generated text (to filter out) */
  aiDetectionPatterns: string[]
  /** Maximum consecutive posts by the same player before forced cooldown */
  maxConsecutiveActions: number
  /** Cooldown (ms) after hitting maxConsecutiveActions */
  consecutiveActionCooldownMs: number
  /** Whether to check for duplicate content before posting */
  deduplicationEnabled: boolean
  /** Similarity threshold (0-1) for deduplication; above this is considered duplicate */
  deduplicationThreshold: number
}

export const QUALITY_CONTROL: QualityControlSettings = {
  minPostLength: 50,
  maxPostLength: 2000,
  minCommentLength: 10,
  maxCommentLength: 500,
  minReplyLength: 5,
  maxReplyLength: 300,
  minConfidenceScore: 0.7,
  bannedWords: [
    'as an ai',
    'as a language model',
    'i cannot',
    'i\'m an ai',
    'openai',
    'chatgpt',
    'claude',
    'anthropic',
    'large language model',
    'LLM',
    'my training data',
    'i was trained',
    'my knowledge cutoff',
    'i don\'t have personal',
    'i\'m not able to',
    'as an artificial',
    'language model',
    'neural network',
  ],
  aiDetectionPatterns: [
    'As an AI',
    'I\'m happy to help',
    'I hope this helps!',
    'Let me know if you have any other questions',
    'Feel free to ask',
    'I\'d be happy to',
    'Great question!',
    'That\'s a great point',
    'Absolutely!',
    'Certainly!',
  ],
  maxConsecutiveActions: 5,
  consecutiveActionCooldownMs: 15 * 60 * 1000,
  deduplicationEnabled: true,
  deduplicationThreshold: 0.85,
}

// ─────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────

/**
 * Returns the default config for a given player type.
 */
export function getDefaultConfigForType(type: PlayerType): PlayerTypeConfig {
  return PLAYER_TYPE_CONFIGS[type]
}

/**
 * Checks if content passes quality control checks.
 * Returns an object with pass/fail status and reason.
 */
export function validateContent(
  content: string,
  actionType: AIActivityType,
  confidence: number
): { valid: boolean; reason?: string } {
  if (confidence < QUALITY_CONTROL.minConfidenceScore) {
    return { valid: false, reason: `Confidence ${confidence} below threshold ${QUALITY_CONTROL.minConfidenceScore}` }
  }

  const minLength =
    actionType === 'post'
      ? QUALITY_CONTROL.minPostLength
      : actionType === 'comment'
        ? QUALITY_CONTROL.minCommentLength
        : QUALITY_CONTROL.minReplyLength

  const maxLength =
    actionType === 'post'
      ? QUALITY_CONTROL.maxPostLength
      : actionType === 'comment'
        ? QUALITY_CONTROL.maxCommentLength
        : QUALITY_CONTROL.maxReplyLength

  if (content.length < minLength) {
    return { valid: false, reason: `Content too short (${content.length} < ${minLength})` }
  }

  if (content.length > maxLength) {
    return { valid: false, reason: `Content too long (${content.length} > ${maxLength})` }
  }

  const lowerContent = content.toLowerCase()
  for (const banned of QUALITY_CONTROL.bannedWords) {
    if (lowerContent.includes(banned.toLowerCase())) {
      return { valid: false, reason: `Contains banned phrase: "${banned}"` }
    }
  }

  for (const pattern of QUALITY_CONTROL.aiDetectionPatterns) {
    if (content.includes(pattern)) {
      return { valid: false, reason: `Matches AI detection pattern: "${pattern}"` }
    }
  }

  return { valid: true }
}

/**
 * Applies jitter to a time interval for more natural timing.
 */
export function applyJitter(intervalMs: number): number {
  const jitter = (Math.random() * 2 - 1) * SCHEDULING.jitterFactor * intervalMs
  return Math.max(SCHEDULING.minIntervalMs, intervalMs + jitter)
}

/**
 * Determines the content prompt template to use based on player type and action.
 */
export function getPromptForAction(
  actionType: AIActivityType,
  playerType?: PlayerType
): ContentPromptTemplate {
  if (actionType === 'post' && playerType === 'guide_writer') {
    return CONTENT_PROMPTS.guide_post
  }
  if (actionType === 'comment' && playerType === 'code_hunter') {
    return CONTENT_PROMPTS.code_share
  }
  if (actionType === 'comment' && playerType === 'news_enthusiast') {
    return CONTENT_PROMPTS.news_discussion
  }
  if (actionType in CONTENT_PROMPTS) {
    return CONTENT_PROMPTS[actionType]
  }
  return CONTENT_PROMPTS.comment
}
