import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, game_slugs, discord_webhook_url } = body

    if (!email || !Array.isArray(game_slugs) || game_slugs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingSubscriber = await db.subscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      const currentGames: string[] = existingSubscriber.games 
        ? JSON.parse(existingSubscriber.games as string) 
        : []
      const mergedGames = [...new Set([...currentGames, ...game_slugs])]

      await db.subscriber.update({
        where: { email },
        data: {
          games: JSON.stringify(mergedGames),
          status: 'active',
        }
      })
    } else {
      await db.subscriber.create({
        data: {
          email,
          games: JSON.stringify(game_slugs),
          token: Math.random().toString(36).substring(2, 15),
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Discord subscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
