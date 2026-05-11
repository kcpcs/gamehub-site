import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, username, password } = body

    if (!email || !username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email, username, and password are required'
      }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await db.user.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existingEmail) {
      return NextResponse.json({
        success: false,
        error: 'Email already registered'
      }, { status: 400 })
    }

    // Check if username already exists
    const existingUsername = await db.user.findFirst({
      where: { username: username }
    })

    if (existingUsername) {
      return NextResponse.json({
        success: false,
        error: 'Username already taken'
      }, { status: 400 })
    }

    // Create user
    const user = await db.user.create({
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
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to register'
    }, { status: 500 })
  }
}
