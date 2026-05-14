// @ts-nocheck
import { db } from '@/lib/db'
import { BehaviorEngine, getActivePlayers } from './behavior-engine'
import { ContentInteractor, getArticleContent, getCommentContent } from './content-interactor'
import { RATE_LIMITS, ACTIVITY_RATE_LIMIT_MAP, QUALITY_CONTROL, SCHEDULING, applyJitter } from './config'
import { getGameCoverUrl } from '@/lib/game-images'
import type { AIPlayer, AIBehaviorConfig, AIActivityType, ReviewStatus } from '@prisma/client'

const MAX_CONCURRENT_PLAYERS = 10
const MIN_INTERVAL_MS = 5000
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 30000
const SCHEDULER_STATE_KEY = 'ai_scheduler_state'
const AUTO_PUBLISH_THRESHOLD = 0.85

const runningPlayers = new Set<string>()
let schedulerInterval: ReturnType<typeof setInterval> | null = null
const lastActivityCheck: Map<string, number> = new Map()

export interface SchedulerStatus {
  isRunning: boolean
  activePlayerCount: number
  runningPlayerCount: number
  lastRunTime: Date | null
  autoStartEnabled: boolean
}

interface SchedulerState {
  isRunning: boolean
  lastRunTime: string | null
  lastSavedAt: string
}

async function saveSchedulerState(state: SchedulerState): Promise<void> {
  try {
    await db.systemSetting.upsert({
      where: { key: SCHEDULER_STATE_KEY },
      create: {
        key: SCHEDULER_STATE_KEY,
        value: JSON.stringify(state),
        value_type: 'json',
        group: 'ai_scheduler',
        description: 'AI仿真人调度器状态持久化'
      },
      update: {
        value: JSON.stringify(state),
      }
    })
  } catch (error) {
    console.warn('[TaskScheduler] Failed to save state:', error)
  }
}

async function loadSchedulerState(): Promise<SchedulerState | null> {
  try {
    const setting = await db.systemSetting.findUnique({
      where: { key: SCHEDULER_STATE_KEY }
    })
    if (setting && setting.value) {
      return JSON.parse(setting.value)
    }
  } catch (error) {
    console.warn('[TaskScheduler] Failed to load state:', error)
  }
  return null
}

async function getAutoStartEnabled(): Promise<boolean> {
  try {
    const setting = await db.systemSetting.findUnique({
      where: { key: 'ai_scheduler_auto_start' }
    })
    return setting?.value === 'true'
  } catch {
    return false
  }
}

function checkBannedWordsFuzzy(content: string): string[] {
  const matches: string[] = []
  const lowerContent = content.toLowerCase()
  for (const banned of QUALITY_CONTROL.bannedWords) {
    const bannedLower = banned.toLowerCase()
    const regex = new RegExp(bannedLower.replace(/\s+/g, '\\s*'), 'gi')
    if (regex.test(content)) {
      matches.push(banned)
    } else if (lowerContent.includes(bannedLower)) {
      matches.push(banned)
    }
  }
  return matches
}

interface QualityCheckResult {
  passed: boolean
  reason?: string
  bannedWordsFound: string[]
  confidenceScore: number
}

function checkContentQuality(content: string, confidence: number): QualityCheckResult {
  const bannedWordsFound = checkBannedWordsFuzzy(content)
  
  if (confidence < QUALITY_CONTROL.minConfidenceScore) {
    return {
      passed: false,
      reason: `Confidence ${confidence} below threshold ${QUALITY_CONTROL.minConfidenceScore}`,
      bannedWordsFound: [],
      confidenceScore: confidence
    }
  }

  if (bannedWordsFound.length > 0) {
    return {
      passed: false,
      reason: `Contains banned phrases: ${bannedWordsFound.join(', ')}`,
      bannedWordsFound,
      confidenceScore: confidence
    }
  }

  return {
    passed: true,
    bannedWordsFound: [],
    confidenceScore: confidence
  }
}

async function queueForReview(
  player: AIPlayer,
  actionType: AIActivityType,
  targetType: string,
  targetId: string | null,
  generatedContent: string,
  confidence: number,
  qualityResult: QualityCheckResult
): Promise<string> {
  const reviewRecord = await db.aIContentReviewQueue.create({
    data: {
      ai_player_id: player.id,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      generated_content: generatedContent,
      confidence_score: confidence,
      quality_check_result: JSON.stringify({
        passed: qualityResult.passed,
        reason: qualityResult.reason,
        bannedWordsFound: qualityResult.bannedWordsFound
      }),
      status: 'pending' as ReviewStatus
    }
  })
  console.log(`[TaskScheduler] Content queued for review: ${reviewRecord.id} (${actionType})`)
  return reviewRecord.id
}

async function publishFromQueue(reviewId: string, reviewedBy?: string): Promise<boolean> {
  const review = await db.aIContentReviewQueue.findUnique({
    where: { id: reviewId },
    include: { ai_player: true }
  })

  if (!review || review.status !== 'approved') {
    return false
  }

  try {
    await db.$transaction(async (tx) => {
      switch (review.action_type) {
        case 'post':
          await executePostFromReview(tx, review)
          break
        case 'comment':
          await executeCommentFromReview(tx, review)
          break
        case 'reply':
          await executeReplyFromReview(tx, review)
          break
      }

      await tx.aIContentReviewQueue.update({
        where: { id: reviewId },
        data: {
          reviewed_by: reviewedBy,
          reviewed_at: new Date()
        }
      })
    })
    return true
  } catch (error) {
    console.error('[TaskScheduler] Failed to publish from queue:', error)
    return false
  }
}

async function executePostFromReview(tx: any, review: any): Promise<void> {
  const player = review.ai_player
  const targetGame = await tx.game.findFirst({
    where: { articles: { some: {} } },
    select: { id: true, name: true }
  })

  if (!targetGame) return

  const slug = generateSlug(player.username)
  const title = generatePostTitle(review.generated_content)

  const article = await tx.article.create({
    data: {
      slug,
      title,
      article_type: 'guide',
      status: 'published',
      source_type: 'ai',
      game_id: targetGame.id,
      cover_url: player.avatar_url || player.avatar || getGameCoverUrl(title),
      cover_alt: title,
      content: review.generated_content,
      excerpt: review.generated_content.substring(0, 150) + '...',
      read_time: Math.max(1, Math.ceil(review.generated_content.length / 1000)),
      seo_title: title + ' | GameHub',
      seo_description: review.generated_content.substring(0, 160),
      seo_keywords: JSON.stringify(extractKeywords(review.generated_content)),
      quality_score: review.confidence_score,
      ai_generated: true,
      ai_player_id: player.id,
      published_at: new Date(),
    },
  })

  await tx.aIActivityLog.create({
    data: {
      player_id: player.id,
      activity_type: 'post',
      target_type: 'article',
      target_id: article.slug,
      content: review.generated_content,
      success: true,
    },
  })

  await tx.aIPlayer.update({
    where: { id: player.id },
    data: {
      total_posts: { increment: 1 },
      last_activity_at: new Date(),
    },
  })
}

async function executeCommentFromReview(tx: any, review: any): Promise<void> {
  const player = review.ai_player

  await tx.comment.create({
    data: {
      article_slug: review.target_id || '',
      author_username: player.username,
      author_avatar: player.avatar_url || player.avatar,
      content: review.generated_content,
      ai_generated: true,
      ai_player_id: player.id,
    },
  })

  await tx.aIActivityLog.create({
    data: {
      player_id: player.id,
      activity_type: 'comment',
      target_type: 'article',
      target_id: review.target_id,
      content: review.generated_content,
      success: true,
    },
  })

  await tx.aIPlayer.update({
    where: { id: player.id },
    data: {
      total_comments: { increment: 1 },
      last_activity_at: new Date(),
    },
  })
}

async function executeReplyFromReview(tx: any, review: any): Promise<void> {
  const player = review.ai_player

  await tx.comment.create({
    data: {
      article_slug: '',
      author_username: player.username,
      author_avatar: player.avatar_url || player.avatar,
      content: review.generated_content,
      parent_id: review.target_id,
      ai_generated: true,
      ai_player_id: player.id,
    },
  })

  await tx.aIActivityLog.create({
    data: {
      player_id: player.id,
      activity_type: 'reply',
      target_type: 'comment',
      target_id: review.target_id,
      content: review.generated_content,
      success: true,
    },
  })
}

export class TaskScheduler {
  private static instance: TaskScheduler
  private isRunning = false
  private lastRunTime: Date | null = null
  private autoStartEnabled = false

  private constructor() {}

  static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler()
    }
    return TaskScheduler.instance
  }

  async init(): Promise<void> {
    try {
      this.autoStartEnabled = await getAutoStartEnabled()
      const savedState = await loadSchedulerState()
      if (savedState && savedState.isRunning && this.autoStartEnabled) {
        console.log('[TaskScheduler] Auto-starting scheduler from saved state...')
        await this.start()
      }
    } catch (error) {
      console.warn('[TaskScheduler] Init failed:', error)
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    console.log('[TaskScheduler] Starting scheduler...')
    await this.saveState()
    await this.runOnce()

    schedulerInterval = setInterval(async () => {
      await this.runOnce()
    }, MIN_INTERVAL_MS)

    console.log('[TaskScheduler] Scheduler started with tick interval:', MIN_INTERVAL_MS, 'ms')
  }

  stop(): void {
    this.isRunning = false
    if (schedulerInterval) {
      clearInterval(schedulerInterval)
      schedulerInterval = null
    }
    runningPlayers.clear()
    this.saveState()
    console.log('[TaskScheduler] Scheduler stopped')
  }

  async setAutoStart(enabled: boolean): Promise<void> {
    this.autoStartEnabled = enabled
    try {
      await db.systemSetting.upsert({
        where: { key: 'ai_scheduler_auto_start' },
        create: {
          key: 'ai_scheduler_auto_start',
          value: String(enabled),
          value_type: 'boolean',
          group: 'ai_scheduler',
          description: 'AI仿真人调度器是否自动启动'
        },
        update: {
          value: String(enabled)
        }
      })
    } catch (error) {
      console.warn('[TaskScheduler] Failed to set auto-start:', error)
    }
  }

  getStatus(): SchedulerStatus {
    return {
      isRunning: this.isRunning,
      activePlayerCount: runningPlayers.size,
      runningPlayerCount: runningPlayers.size,
      lastRunTime: this.lastRunTime,
      autoStartEnabled: this.autoStartEnabled,
    }
  }

  private async saveState(): Promise<void> {
    const state: SchedulerState = {
      isRunning: this.isRunning,
      lastRunTime: this.lastRunTime?.toISOString() || null,
      lastSavedAt: new Date().toISOString()
    }
    await saveSchedulerState(state)
  }

  private async runOnce(): Promise<void> {
    if (!this.isRunning) return

    try {
      const players = await getActivePlayers()
      this.lastRunTime = new Date()

      for (const { player, config } of players) {
        if (runningPlayers.size >= MAX_CONCURRENT_PLAYERS) break
        if (runningPlayers.has(player.id)) continue

        const engine = new BehaviorEngine(player, config)
        if (!engine.isActiveTime()) continue

        const interval = engine.getRandomInterval()
        const lastActivity = lastActivityCheck.get(player.id) || 0
        if (Date.now() - lastActivity < interval) continue

        runningPlayers.add(player.id)
        lastActivityCheck.set(player.id, Date.now())

        this.executePlayerAction(player, config).then(() => {
          runningPlayers.delete(player.id)
        }).catch(() => {
          runningPlayers.delete(player.id)
        })
      }
    } catch (error) {
      console.error('[TaskScheduler] Scheduler run error:', error)
    }
  }

  private async checkRateLimit(playerId: string, activityType: AIActivityType): Promise<boolean> {
    const limitKey = ACTIVITY_RATE_LIMIT_MAP[activityType]
    if (!limitKey) return true

    const limit = RATE_LIMITS[limitKey]
    const windowStart = Date.now() - limit.windowMs

    const recentCount = await db.aIActivityLog.count({
      where: {
        player_id: playerId,
        activity_type: activityType,
        created_at: { gte: new Date(windowStart) },
      },
    })

    if (recentCount >= limit.maxActions) {
      console.log(`[TaskScheduler] Rate limit reached for player ${playerId}: ${activityType} (${recentCount}/${limit.maxActions})`)
      return false
    }

    return true
  }

  private async executePlayerAction(player: AIPlayer, config: AIBehaviorConfig): Promise<void> {
    const engine = new BehaviorEngine(player, config)
    const decision = engine.decideAction()

    const delayWithJitter = applyJitter(decision.delay * 1000)
    await delay(delayWithJitter)

    try {
      if (!(await this.checkRateLimit(player.id, decision.action))) {
        return
      }

      let success = false
      let retries = 0

      while (!success && retries < MAX_RETRIES) {
        try {
          switch (decision.action) {
            case 'post':
              await this.executePost(player)
              success = true
              break
            case 'comment':
              await this.executeComment(player)
              success = true
              break
            case 'reply':
              await this.executeReply(player)
              success = true
              break
            case 'like':
              await this.executeLike(player)
              success = true
              break
            case 'view':
              await this.executeView(player)
              success = true
              break
            default:
              console.warn(`[TaskScheduler] Unknown action type: ${decision.action}`)
              return
          }
        } catch (error) {
          retries++
          console.error(`[TaskScheduler] Action ${decision.action} failed (attempt ${retries}/${MAX_RETRIES}):`, error)
          if (retries < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS)
          }
        }
      }
    } catch (error) {
      console.error(`[TaskScheduler] Action ${decision.action} failed for ${player.username}:`, error)
    }
  }

  private async executePost(player: AIPlayer): Promise<void> {
    const interactor = new ContentInteractor(player)
    const generated = await interactor.generatePost()

    const qualityCheck = checkContentQuality(generated.content, generated.confidence)
    
    if (!qualityCheck.passed || generated.confidence < AUTO_PUBLISH_THRESHOLD) {
      await queueForReview(
        player,
        'post',
        'article',
        null,
        generated.content,
        generated.confidence,
        qualityCheck
      )
      return
    }

    const targetGame = await this.selectGameByInterests(player)
    if (!targetGame) {
      console.log('[TaskScheduler] No suitable game found for post')
      return
    }

    const slug = generateSlug(player.username)
    const title = this.generatePostTitle(generated.content)

    await db.$transaction(async (tx) => {
      const article = await tx.article.create({
        data: {
          slug,
          title,
          article_type: 'guide',
          status: 'published',
          source_type: 'ai',
          game_id: targetGame.id,
          cover_url: player.avatar_url || player.avatar || getGameCoverUrl(title),
          cover_alt: title,
          content: generated.content,
          excerpt: generated.content.substring(0, 150) + '...',
          read_time: Math.max(1, Math.ceil(generated.content.length / 1000)),
          seo_title: title + ' | GameHub',
          seo_description: generated.content.substring(0, 160),
          seo_keywords: JSON.stringify(this.extractKeywords(generated.content)),
          quality_score: generated.confidence,
          ai_generated: true,
          ai_player_id: player.id,
          published_at: new Date(),
        },
      })

      await tx.aIActivityLog.create({
        data: {
          player_id: player.id,
          activity_type: 'post',
          target_type: 'article',
          target_id: article.slug,
          content: generated.content,
          success: true,
        },
      })

      await tx.aIPlayer.update({
        where: { id: player.id },
        data: {
          total_posts: { increment: 1 },
          last_activity_at: new Date(),
        },
      })

      console.log(`[TaskScheduler] Post created: "${title}" by ${player.username}`)
    })

    await this.updateDailyStats(player.id, 'post', 5)
  }

  private async executeComment(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetSlug = await engine.getRandomTarget('article')

    if (!targetSlug) {
      console.log('[TaskScheduler] No target article found for comment')
      return
    }

    const articleContent = await getArticleContent(targetSlug)
    if (!articleContent) return

    const interactor = new ContentInteractor(player)
    const generated = await interactor.generateComment(articleContent)

    const qualityCheck = checkContentQuality(generated.content, generated.confidence)
    
    if (!qualityCheck.passed || generated.confidence < AUTO_PUBLISH_THRESHOLD) {
      await queueForReview(
        player,
        'comment',
        'article',
        targetSlug,
        generated.content,
        generated.confidence,
        qualityCheck
      )
      return
    }

    const typingDelay = engine.getTypingTime(generated.content.length)
    await delay(typingDelay * 1000)

    await db.$transaction(async (tx) => {
      await tx.comment.create({
        data: {
          article_slug: targetSlug,
          author_username: player.username,
          author_avatar: player.avatar_url || player.avatar,
          content: generated.content,
          ai_generated: true,
          ai_player_id: player.id,
        },
      })

      await tx.aIActivityLog.create({
        data: {
          player_id: player.id,
          activity_type: 'comment',
          target_type: 'article',
          target_id: targetSlug,
          content: generated.content,
          success: true,
        },
      })

      await tx.aIPlayer.update({
        where: { id: player.id },
        data: {
          total_comments: { increment: 1 },
          last_activity_at: new Date(),
        },
      })

      await tx.article.update({
        where: { slug: targetSlug },
        data: { updated_at: new Date() },
      }).catch(() => {})
    })

    await this.updateDailyStats(player.id, 'comment', 2)
  }

  private async executeReply(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetId = await engine.getRandomTarget('comment')

    if (!targetId) {
      console.log('[TaskScheduler] No target comment found for reply')
      return
    }

    const parentComment = await db.comment.findUnique({
      where: { id: targetId },
      select: { content: true, article_slug: true },
    })
    if (!parentComment || !parentComment.article_slug) return

    const interactor = new ContentInteractor(player)
    const generated = await interactor.generateReply(parentComment.content, undefined, parentComment.article_slug)

    const qualityCheck = checkContentQuality(generated.content, generated.confidence)
    
    if (!qualityCheck.passed || generated.confidence < AUTO_PUBLISH_THRESHOLD) {
      await queueForReview(
        player,
        'reply',
        'comment',
        targetId,
        generated.content,
        generated.confidence,
        qualityCheck
      )
      return
    }

    await db.$transaction(async (tx) => {
      await tx.comment.create({
        data: {
          article_slug: parentComment.article_slug,
          author_username: player.username,
          author_avatar: player.avatar_url || player.avatar,
          content: generated.content,
          parent_id: targetId,
          ai_generated: true,
          ai_player_id: player.id,
        },
      })

      await tx.aIActivityLog.create({
        data: {
          player_id: player.id,
          activity_type: 'reply',
          target_type: 'comment',
          target_id: targetId,
          content: generated.content,
          success: true,
        },
      })
    })

    await this.updateDailyStats(player.id, 'reply', 1)
  }

  private async executeLike(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetSlug = await engine.getRandomTarget('article')

    if (!targetSlug) return

    const article = await db.article.findUnique({ where: { slug: targetSlug } })
    if (!article) return

    await db.$transaction(async (tx) => {
      await tx.like.create({
        data: {
          user_id: player.id,
          article_id: article.id,
        },
      }).catch(() => {})

      await tx.aIActivityLog.create({
        data: {
          player_id: player.id,
          activity_type: 'like',
          target_type: 'article',
          target_id: targetSlug,
          success: true,
        },
      })
    })

    await this.updateDailyStats(player.id, 'like', 1)
  }

  private async executeView(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetSlug = await engine.getRandomTarget('article')

    if (!targetSlug) return

    await db.aIActivityLog.create({
      data: {
        player_id: player.id,
        activity_type: 'view',
        target_type: 'article',
        target_id: targetSlug,
        success: true,
      },
    })

    await this.updateDailyStats(player.id, 'view', 1)
  }

  private async selectGameByInterests(player: AIPlayer): Promise<{ id: string; name: string } | null> {
    try {
      const interests = typeof player.interests === 'string'
        ? JSON.parse(player.interests)
        : player.interests

      if (!Array.isArray(interests) || interests.length === 0) {
        return await db.game.findFirst({
          where: { articles: { some: {} } },
          select: { id: true, name: true },
        })
      }

      const randomInterest = interests[Math.floor(Math.random() * interests.length)]
      const game = await db.game.findFirst({
        where: {
          OR: [
            { name: { contains: randomInterest } },
            { tags: { contains: randomInterest } },
          ],
        },
        select: { id: true, name: true },
      })

      return game || await db.game.findFirst({
        where: { articles: { some: {} } },
        select: { id: true, name: true },
      })
    } catch {
      return await db.game.findFirst({
        where: { articles: { some: {} } },
        select: { id: true, name: true },
      })
    }
  }

  private generatePostTitle(content: string): string {
    const firstLine = content.split('\n')[0].trim()
    const title = firstLine.replace(/^[#*]+/, '').trim()
    return title.length > 10 ? title : `My thoughts on gaming: ${title}`
  }

  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
    const freq: Record<string, number> = {}
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  private async updateDailyStats(
    playerId: string,
    activityType: AIActivityType,
    activityMinutes: number = 1
  ): Promise<void> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayStart = new Date(today)
      const todayEnd = new Date(today)
      todayEnd.setHours(23, 59, 59, 999)

      const todayLogs = await db.aIActivityLog.count({
        where: {
          player_id: playerId,
          created_at: { gte: todayStart, lte: todayEnd },
        },
      })

      const todayPosts = await db.aIActivityLog.count({
        where: {
          player_id: playerId,
          activity_type: 'post',
          created_at: { gte: todayStart, lte: todayEnd },
        },
      })

      const todayComments = await db.aIActivityLog.count({
        where: {
          player_id: playerId,
          activity_type: 'comment',
          created_at: { gte: todayStart, lte: todayEnd },
        },
      })

      const todayReplies = await db.aIActivityLog.count({
        where: {
          player_id: playerId,
          activity_type: 'reply',
          created_at: { gte: todayStart, lte: todayEnd },
        },
      })

      const todayLikes = await db.aIActivityLog.count({
        where: {
          player_id: playerId,
          activity_type: 'like',
          created_at: { gte: todayStart, lte: todayEnd },
        },
      })

      await db.aIStats.upsert({
        where: {
          player_id_date: {
            player_id: playerId,
            date: today,
          },
        },
        create: {
          player_id: playerId,
          date: today,
          posts_count: todayPosts,
          comments_count: todayComments,
          replies_count: todayReplies,
          likes_count: todayLikes,
          active_minutes: activityMinutes,
        },
        update: {
          posts_count: todayPosts,
          comments_count: todayComments,
          replies_count: todayReplies,
          likes_count: todayLikes,
          active_minutes: { increment: activityMinutes },
        },
      })
    } catch (error) {
      console.error('[TaskScheduler] Failed to update daily stats:', error)
    }
  }
}

function generateSlug(username: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ai-post-${username.toLowerCase()}-${timestamp}-${random}`
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function startScheduler(): Promise<void> {
  const scheduler = TaskScheduler.getInstance()
  await scheduler.start()
}

export async function initScheduler(): Promise<void> {
  const scheduler = TaskScheduler.getInstance()
  await scheduler.init()
}

export async function setSchedulerAutoStart(enabled: boolean): Promise<void> {
  const scheduler = TaskScheduler.getInstance()
  await scheduler.setAutoStart(enabled)
}

export function stopScheduler(): void {
  const scheduler = TaskScheduler.getInstance()
  scheduler.stop()
}

export function getSchedulerStatus(): SchedulerStatus {
  const scheduler = TaskScheduler.getInstance()
  return scheduler.getStatus()
}

export { publishFromQueue }
