// @ts-nocheck
import { db } from '@/lib/db'

export async function sendDiscordNotification(
  webhookUrl: string,
  message: {
    title: string
    description: string
    url?: string
    color?: number
    fields?: { name: string; value: string; inline?: boolean }[]
    thumbnail?: string
  }
) {
  try {
    const embed = {
      title: message.title,
      description: message.description,
      url: message.url,
      color: message.color || 0x7c3aed,
      fields: message.fields,
      thumbnail: message.thumbnail ? { url: message.thumbnail } : undefined,
      timestamp: new Date().toISOString()
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    return response.ok
  } catch {
    return false
  }
}

export async function notifySubscribers(gameSlug: string, codeData: {
  code: string
  reward: string
  expiresAt?: string
}) {
  try {
    const subscribers = await db.subscriber.findMany({
      where: {
        game_slugs: {
          has: gameSlug
        }
      }
    })

    const results = await Promise.all(
      subscribers
        .filter(s => s.discord_webhook_url)
        .map(async subscriber => {
          const success = await sendDiscordNotification(subscriber.discord_webhook_url!, {
            title: `New Code for ${gameSlug.replace('-', ' ')}`,
            description: `A new redeem code has been added!`,
            color: 0x22c55e,
            fields: [
              { name: 'Code', value: `\`${codeData.code}\``, inline: true },
              { name: 'Reward', value: codeData.reward, inline: true },
              ...(codeData.expiresAt ? [
                { name: 'Expires', value: new Date(codeData.expiresAt).toLocaleDateString(), inline: true }
              ] : [])
            ]
          })
          return { email: subscriber.email, success }
        })
    )

    return results
  } catch (error) {
    console.error('Notify subscribers error:', error)
    return []
  }
}