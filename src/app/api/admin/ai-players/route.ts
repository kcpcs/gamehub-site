import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') as 'active' | 'inactive' | 'paused' | undefined

  const where: Record<string, any> = {}
  if (status) {
    where.status = status
  }

  const [players, total] = await Promise.all([
    db.aIPlayer.findMany({
      where,
      include: {
        behavior_config: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    db.aIPlayer.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: players,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const player = await db.aIPlayer.create({
      data: {
        username: body.username,
        email: body.email,
        avatar: body.avatar,
        age: body.age,
        occupation: body.occupation,
        personality: body.personality || {},
        interests: body.interests || [],
        activity_level: body.activity_level || 0.5,
        behavior_config: {
          create: {
            wake_up_time: body.behavior?.wake_up_time || '08:00',
            sleep_time: body.behavior?.sleep_time || '23:00',
            activity_interval_min: body.behavior?.activity_interval_min || 300,
            activity_interval_max: body.behavior?.activity_interval_max || 1800,
            post_probability: body.behavior?.post_probability || 0.1,
            comment_probability: body.behavior?.comment_probability || 0.3,
            reply_probability: body.behavior?.reply_probability || 0.5,
            typing_speed_min: body.behavior?.typing_speed_min || 30,
            typing_speed_max: body.behavior?.typing_speed_max || 60,
            thinking_time_min: body.behavior?.thinking_time_min || 2,
            thinking_time_max: body.behavior?.thinking_time_max || 10,
          },
        },
      },
      include: { behavior_config: true },
    })

    return NextResponse.json({ success: true, data: player }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create AI player' }, { status: 500 })
  }
}
