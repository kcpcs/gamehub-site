import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getActivitySegments, getEngagementSegments, getPreferenceSegments, getRetentionData, getUserProfile, classifyUser } from '@/lib/analytics/segmentation'

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'activity'
  const days = parseInt(searchParams.get('days') || '30', 10)
  const userId = searchParams.get('user_id')

  try {
    if (userId) {
      const profile = await getUserProfile(userId)
      if (!profile) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: profile })
    }

    switch (type) {
      case 'activity':
        return NextResponse.json({ success: true, data: await getActivitySegments(days) })
      case 'engagement':
        return NextResponse.json({ success: true, data: await getEngagementSegments(days) })
      case 'preference':
        return NextResponse.json({ success: true, data: await getPreferenceSegments() })
      case 'retention':
        return NextResponse.json({ success: true, data: await getRetentionData(days) })
      default:
        return NextResponse.json({ success: true, data: {
          activity: await getActivitySegments(days),
          engagement: await getEngagementSegments(days),
          preference: await getPreferenceSegments(),
          retention: await getRetentionData(days),
        }})
    }
  } catch (err) {
    console.error('[Admin Analytics Segments]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, user_id } = body

    if (action === 'classify' && user_id) {
      await classifyUser(user_id)
      return NextResponse.json({ success: true, message: '用户分类完成' })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('[Admin Analytics Segments]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}