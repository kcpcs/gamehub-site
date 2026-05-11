import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Check if user exists
    let user = await db.user.findFirst({
      where: { email: email.toLowerCase() }
    })

    // If user doesn't exist, create a placeholder user for demo
    if (!user) {
      const username = email.split('@')[0]
      user = await db.user.create({
        data: {
          email: email.toLowerCase(),
          username: username,
          password_hash: 'demo_password',
          avatar: null,
          membership: 'free',
          creator_level: 'reader',
          points: 100,
          earned_cents: 0,
          pending_cents: 0,
          total_views: 0,
          article_count: 0,
        }
      })
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        membership: user.membership,
        points: user.points
      }
    })
  } catch (err) {
    console.error('[POST /api/auth/login]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to login'
    }, { status: 500 })
  }
}
