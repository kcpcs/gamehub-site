import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'
import { sendEmail } from '@/lib/mailer'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.email = { contains: search, mode: 'insensitive' }
    }

    const subscribers = await db.subscriber.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 100
    })

    const formattedSubscribers = subscribers.map(s => ({
      ...s,
      games: s.games ? JSON.parse(s.games as string) : []
    }))

    const response: ApiResponse<typeof formattedSubscribers> = { success: true, data: formattedSubscribers }
    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/admin/subscribers]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing subscriber ID', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    await db.subscriber.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error('[DELETE /api/admin/subscribers]', err)
    return NextResponse.json({ success: false, error: 'Failed to delete subscriber', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'notify') {
      const { subject, body, subscriberId } = await req.json() as { subject: string; body: string; subscriberId?: string }

      if (!subject || !body) {
        return NextResponse.json(
          { success: false, error: 'Subject and body are required', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }

      let subscribers: { email: string; id: string }[]

      if (subscriberId) {
        const subscriber = await db.subscriber.findUnique({ where: { id: subscriberId } })
        if (!subscriber) {
          return NextResponse.json(
            { success: false, error: 'Subscriber not found', code: 'NOT_FOUND' },
            { status: 404 }
          )
        }
        subscribers = [{ email: subscriber.email, id: subscriber.id }]
      } else {
        subscribers = await db.subscriber.findMany({
          where: { status: 'active' },
          select: { email: true, id: true }
        })
      }

      const htmlBody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0d1117; }
            .container { background: #161b22; border-radius: 12px; padding: 30px; border: 1px solid #30363d; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 20px; }
            h1 { color: #e6edf3; font-size: 20px; margin-bottom: 16px; }
            p { color: #8b949e; font-size: 14px; line-height: 1.6; }
            .unsubscribe { color: #8b949e; font-size: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #30363d; }
            .unsubscribe a { color: #8b949e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎮 GameHub</div>
            <h1>${subject}</h1>
            <p>${body.replace(/\n/g, '<br>')}</p>
            <div class="unsubscribe">
              <p>To unsubscribe from our emails, click <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gamehub.pro'}/unsubscribe">here</a>.</p>
            </div>
          </div>
        </body>
        </html>
      `

      for (const subscriber of subscribers) {
        await sendEmail({
          to: subscriber.email,
          subject: `GameHub - ${subject}`,
          html: htmlBody,
          text: body
        })
      }

      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  } catch (err) {
    console.error('[POST /api/admin/subscribers]', err)
    return NextResponse.json({ success: false, error: 'Failed to send notification', code: 'SERVER_ERROR' }, { status: 500 })
  }
}