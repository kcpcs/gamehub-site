// @ts-nocheck
import { db } from '@/lib/db'
import type { AIPlayer, AIBehaviorConfig, AIActivityType } from '@prisma/client'

export interface BehaviorDecision {
  action: AIActivityType
  targetType: string
  targetId?: string
  content?: string
  delay: number
}

export class BehaviorEngine {
  private player: AIPlayer
  private config: AIBehaviorConfig

  constructor(player: AIPlayer, config: AIBehaviorConfig) {
    this.player = player
    this.config = config
  }

  isActiveTime(): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const [wakeHour, wakeMinute] = this.config.wake_up_time.split(':').map(Number)
    const [sleepHour, sleepMinute] = this.config.sleep_time.split(':').map(Number)

    const currentTotal = currentHour * 60 + currentMinute
    const wakeTotal = wakeHour * 60 + wakeMinute
    const sleepTotal = sleepHour * 60 + sleepMinute

    if (wakeTotal < sleepTotal) {
      return currentTotal >= wakeTotal && currentTotal < sleepTotal
    } else {
      return currentTotal >= wakeTotal || currentTotal < sleepTotal
    }
  }

  getRandomInterval(): number {
    const min = this.config.activity_interval_min
    const max = this.config.activity_interval_max
    return Math.random() * (max - min) + min
  }

  getThinkingTime(): number {
    const min = this.config.thinking_time_min
    const max = this.config.thinking_time_max
    return Math.random() * (max - min) + min
  }

  getTypingTime(contentLength: number): number {
    const minSpeed = this.config.typing_speed_min
    const maxSpeed = this.config.typing_speed_max
    const avgSpeed = (minSpeed + maxSpeed) / 2
    return contentLength / avgSpeed + (Math.random() - 0.5) * 2
  }

  decideAction(): BehaviorDecision {
    const rand = Math.random()
    let cumulative = 0

    cumulative += this.config.post_probability
    if (rand < cumulative) {
      return {
        action: 'post',
        targetType: 'article',
        delay: this.getThinkingTime(),
      }
    }

    cumulative += this.config.comment_probability
    if (rand < cumulative) {
      return {
        action: 'comment',
        targetType: 'article',
        delay: this.getThinkingTime(),
      }
    }

    cumulative += this.config.reply_probability
    if (rand < cumulative) {
      return {
        action: 'reply',
        targetType: 'comment',
        delay: this.getThinkingTime(),
      }
    }

    const likeOrView = Math.random()
    if (likeOrView < 0.4) {
      return {
        action: 'like',
        targetType: 'article',
        delay: 0.5 + Math.random() * 1,
      }
    }

    return {
      action: 'view',
      targetType: 'article',
      delay: 2 + Math.random() * 5,
    }
  }

  async getRandomTarget(targetType: string): Promise<string | null> {
    try {
      const interests = this.getInterests()

      if (targetType === 'article') {
        let articles

        if (interests.length > 0) {
          const randomInterest = interests[Math.floor(Math.random() * interests.length)]
          articles = await db.article.findMany({
            where: {
              status: 'published',
              OR: [
                { title: { contains: randomInterest } },
                { content: { contains: randomInterest } },
                { game: { name: { contains: randomInterest } } },
              ],
            },
            take: 50,
            select: { slug: true, view_count: true },
            orderBy: { view_count: 'desc' },
          })
        }

        if (!articles || articles.length === 0) {
          articles = await db.article.findMany({
            where: { status: 'published' },
            take: 50,
            select: { slug: true, view_count: true },
            orderBy: { view_count: 'desc' },
          })
        }

        if (articles.length === 0) return null
        return articles[Math.floor(Math.random() * articles.length)].slug
      }

      if (targetType === 'comment') {
        const comments = await db.comment.findMany({
          take: 50,
          select: { id: true, created_at: true },
          orderBy: { created_at: 'desc' },
        })
        if (comments.length === 0) return null
        return comments[Math.floor(Math.random() * comments.length)].id
      }

      return null
    } catch {
      return null
    }
  }

  getPersonalityTone(): string {
    const personality = typeof this.player.personality === 'string'
      ? JSON.parse(this.player.personality)
      : this.player.personality

    return personality.tone || 'friendly'
  }

  getInterests(): string[] {
    return typeof this.player.interests === 'string'
      ? JSON.parse(this.player.interests)
      : this.player.interests
  }
}

export async function getActivePlayers(): Promise<Array<{ player: AIPlayer; config: AIBehaviorConfig }>> {
  const players = await db.aIPlayer.findMany({
    where: { status: 'active' },
    include: { behavior_config: true },
  })

  return players
    .filter(p => p.behavior_config)
    .map(p => ({
      player: p,
      config: p.behavior_config!,
    }))
}
