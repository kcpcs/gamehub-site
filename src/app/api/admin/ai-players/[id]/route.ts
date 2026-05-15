import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const player = await db.aIPlayer.findUnique({
    where: { id },
    include: {
      behavior_config: true,
      activity_logs: {
        orderBy: { created_at: 'desc' },
        take: 20,
      },
    },
  })

  if (!player) {
    return NextResponse.json({ error: 'AI player not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: player })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    const updateData: Record<string, any> = {}
    if (body.username !== undefined) updateData.username = body.username
    if (body.email !== undefined) updateData.email = body.email
    if (body.avatar !== undefined) updateData.avatar = body.avatar
    if (body.age !== undefined) updateData.age = body.age
    if (body.occupation !== undefined) updateData.occupation = body.occupation
    if (body.personality !== undefined) updateData.personality = body.personality
    if (body.interests !== undefined) updateData.interests = body.interests
    if (body.activity_level !== undefined) updateData.activity_level = body.activity_level
    if (body.status !== undefined) updateData.status = body.status

    if (body.behavior) {
      updateData.behavior_config = {
        upsert: {
          create: {
            wake_up_time: body.behavior.wake_up_time || '08:00',
            sleep_time: body.behavior.sleep_time || '00:00',
            activity_interval_min: body.behavior.activity_interval_min || 30,
            activity_interval_max: body.behavior.activity_interval_max || 120,
            post_probability: body.behavior.post_probability || 0.3,
            comment_probability: body.behavior.comment_probability || 0.5,
            reply_probability: body.behavior.reply_probability || 0.3,
            typing_speed_min: body.behavior.typing_speed_min || 3,
            typing_speed_max: body.behavior.typing_speed_max || 8,
            thinking_time_min: body.behavior.thinking_time_min || 2,
            thinking_time_max: body.behavior.thinking_time_max || 10,
          },
          update: {
            wake_up_time: body.behavior.wake_up_time,
            sleep_time: body.behavior.sleep_time,
            activity_interval_min: body.behavior.activity_interval_min,
            activity_interval_max: body.behavior.activity_interval_max,
            post_probability: body.behavior.post_probability,
            comment_probability: body.behavior.comment_probability,
            reply_probability: body.behavior.reply_probability,
            typing_speed_min: body.behavior.typing_speed_min,
            typing_speed_max: body.behavior.typing_speed_max,
            thinking_time_min: body.behavior.thinking_time_min,
            thinking_time_max: body.behavior.thinking_time_max,
          },
        },
      }
    }

    const player = await db.aIPlayer.update({
      where: { id },
      data: updateData,
      include: { behavior_config: true },
    })

    return NextResponse.json({ success: true, data: player })
  } catch (error) {
    console.error('Error updating AI player:', error)
    return NextResponse.json({ error: 'Failed to update AI player' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await db.aIPlayer.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'AI player deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete AI player' }, { status: 500 })
  }
}