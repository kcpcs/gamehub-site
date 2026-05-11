// @ts-nocheck
import { db } from '@/lib/db'
import { BehaviorEngine, getActivePlayers } from './behavior-engine'
import { ContentInteractor, getArticleContent, getCommentContent } from './content-interactor'
import type { AIPlayer, AIBehaviorConfig, AIActivityType } from '@prisma/client'

const MAX_CONCURRENT_PLAYERS = 10
const MIN_INTERVAL_MS = 5000

let runningPlayers = new Set<string>()
let schedulerInterval: ReturnType<typeof setInterval> | null = null

export interface SchedulerStatus {
  isRunning: boolean
  activePlayerCount: number
  runningPlayerCount: number
  lastRunTime: Date | null
}

export class TaskScheduler {
  private static instance: TaskScheduler
  private isRunning = false
  private lastRunTime: Date | null = null

  private constructor() {}

  static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler()
    }
    return TaskScheduler.instance
  }

  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    await this.runOnce()

    schedulerInterval = setInterval(async () => {
      await this.runOnce()
    }, MIN_INTERVAL_MS)
  }

  stop(): void {
    this.isRunning = false
    if (schedulerInterval) {
      clearInterval(schedulerInterval)
      schedulerInterval = null
    }
    runningPlayers.clear()
  }

  getStatus(): SchedulerStatus {
    return {
      isRunning: this.isRunning,
      activePlayerCount: 0,
      runningPlayerCount: runningPlayers.size,
      lastRunTime: this.lastRunTime,
    }
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

        runningPlayers.add(player.id)
        this.executePlayerAction(player, config).then(() => {
          runningPlayers.delete(player.id)
        }).catch(() => {
          runningPlayers.delete(player.id)
        })
      }
    } catch (error) {
      console.error('Scheduler run error:', error)
    }
  }

  private async executePlayerAction(player: AIPlayer, config: AIBehaviorConfig): Promise<void> {
    const engine = new BehaviorEngine(player, config)
    const decision = engine.decideAction()

    await delay(decision.delay * 1000)

    try {
      switch (decision.action) {
        case 'post':
          await this.executePost(player)
          break
        case 'comment':
          await this.executeComment(player)
          break
        case 'reply':
          await this.executeReply(player)
          break
        case 'like':
          await this.executeLike(player)
          break
        case 'view':
          await this.executeView(player)
          break
      }
    } catch (error) {
      console.error(`Action ${decision.action} failed for ${player.username}:`, error)
    }
  }

  private async executePost(player: AIPlayer): Promise<void> {
    const interactor = new ContentInteractor(player)
    const generated = await interactor.generatePost()

    await db.aIActivityLog.create({
      data: {
        player_id: player.id,
        activity_type: 'post',
        target_type: 'article',
        content: generated.content,
      },
    })

    await db.aIPlayer.update({
      where: { id: player.id },
      data: {
        total_posts: { increment: 1 },
        last_activity_at: new Date(),
      },
    })
  }

  private async executeComment(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetSlug = await engine.getRandomTarget('article')
    
    if (!targetSlug) return

    const articleContent = await getArticleContent(targetSlug)
    if (!articleContent) return

    const interactor = new ContentInteractor(player)
    const generated = await interactor.generateComment(articleContent)

    const typingDelay = engine.getTypingTime(generated.content.length)
    await delay(typingDelay * 1000)

    await db.comment.create({
      data: {
        article_slug: targetSlug,
        author_username: player.username,
        author_avatar: player.avatar,
        content: generated.content,
      },
    })

    await db.aIActivityLog.create({
      data: {
        player_id: player.id,
        activity_type: 'comment',
        target_type: 'article',
        target_id: targetSlug,
        content: generated.content,
      },
    })

    await db.aIPlayer.update({
      where: { id: player.id },
      data: {
        total_comments: { increment: 1 },
        last_activity_at: new Date(),
      },
    })
  }

  private async executeReply(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetId = await engine.getRandomTarget('comment')
    
    if (!targetId) return

    const commentContent = await getCommentContent(targetId)
    if (!commentContent) return

    const interactor = new ContentInteractor(player)
    const generated = await interactor.generateReply(commentContent)

    await db.comment.create({
      data: {
        article_slug: '',
        author_username: player.username,
        author_avatar: player.avatar,
        content: generated.content,
        parent_id: targetId,
      },
    })

    await db.aIActivityLog.create({
      data: {
        player_id: player.id,
        activity_type: 'reply',
        target_type: 'comment',
        target_id: targetId,
        content: generated.content,
      },
    })
  }

  private async executeLike(player: AIPlayer): Promise<void> {
    const engine = new BehaviorEngine(player, player.behavior_config!)
    const targetSlug = await engine.getRandomTarget('article')
    
    if (!targetSlug) return

    const article = await db.article.findUnique({ where: { slug: targetSlug } })
    if (!article) return

    await db.like.create({
      data: {
        user_id: player.id,
        article_id: article.id,
      },
    }).catch(() => {})

    await db.aIActivityLog.create({
      data: {
        player_id: player.id,
        activity_type: 'like',
        target_type: 'article',
        target_id: targetSlug,
      },
    })
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
      },
    })
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function startScheduler(): Promise<void> {
  const scheduler = TaskScheduler.getInstance()
  await scheduler.start()
}

export function stopScheduler(): void {
  const scheduler = TaskScheduler.getInstance()
  scheduler.stop()
}

export function getSchedulerStatus(): SchedulerStatus {
  const scheduler = TaskScheduler.getInstance()
  return scheduler.getStatus()
}
