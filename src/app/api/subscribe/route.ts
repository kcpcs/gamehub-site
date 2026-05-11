import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateBody, subscribeSchema } from '@/lib/validations'
import type { ApiResponse } from '@/types'

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(req: NextRequest) {
  try {
    const result = await validateBody(req, subscribeSchema)
    if (!result.success) return result.error
    const { email, games } = result.data

    const existing = await db.subscriber.findUnique({ where: { email } })

    if (existing) {
      if (existing.status === 'unsubscribed') {
        await db.subscriber.update({
          where: { email },
          data: { 
            status: 'active',
            games: games ? JSON.stringify(games) : existing.games,
            token: generateToken()
          }
        })
      } else if (games && games.length > 0) {
        const currentGames = existing.games ? JSON.parse(existing.games as string) : []
        const newGames = [...new Set([...currentGames, ...games])]
        await db.subscriber.update({
          where: { email },
          data: { games: JSON.stringify(newGames) }
        })
      }
    } else {
      await db.subscriber.create({
        data: {
          email,
          games: games ? JSON.stringify(games) : '[]',
          token: generateToken()
        }
      })
    }

    const ckApiKey = process.env.CONVERTKIT_API_KEY
    const ckFormId = process.env.CONVERTKIT_FORM_ID

    if (ckApiKey && ckFormId) {
      await fetch(`https://api.convertkit.com/v3/forms/${ckFormId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: ckApiKey, email, fields: { games: games?.join(',') ?? '' } }),
      })
    }

    const response: ApiResponse<{ subscribed: boolean }> = { success: true, data: { subscribed: true } }
    return NextResponse.json(response)
  } catch (err) {
    console.error('[POST /api/subscribe]', err)
    return NextResponse.json({ success: false, error: 'Subscribe failed', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const action = searchParams.get('action')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    const subscriber = await db.subscriber.findFirst({ where: { token } })

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Invalid token', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (action === 'unsubscribe') {
      await db.subscriber.update({
        where: { id: subscriber.id },
        data: { status: 'unsubscribed' }
      })
      return NextResponse.json({ success: true, data: { unsubscribed: true } })
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        email: subscriber.email, 
        games: subscriber.games ? JSON.parse(subscriber.games as string) : [],
        status: subscriber.status 
      } 
    })
  } catch (err) {
    console.error('[GET /api/subscribe]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch subscription', code: 'SERVER_ERROR' }, { status: 500 })
  }
}