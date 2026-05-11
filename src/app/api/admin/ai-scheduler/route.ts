import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/admin-auth'
import { startScheduler, stopScheduler, getSchedulerStatus } from '@/lib/ai-player/task-scheduler'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = getSchedulerStatus()
  
  return NextResponse.json({
    success: true,
    data: {
      isRunning: status.isRunning,
      runningPlayerCount: status.runningPlayerCount,
      lastRunTime: status.lastRunTime ? status.lastRunTime.toISOString() : null,
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
    const { action } = body

    if (action === 'start') {
      await startScheduler()
      return NextResponse.json({ success: true, message: 'Scheduler started' })
    }

    if (action === 'stop') {
      stopScheduler()
      return NextResponse.json({ success: true, message: 'Scheduler stopped' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update scheduler' }, { status: 500 })
  }
}
