import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/admin-auth'
import { startScheduler, stopScheduler, getSchedulerStatus, setSchedulerAutoStart, initScheduler } from '@/lib/ai-player/task-scheduler'

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
      activePlayerCount: status.activePlayerCount,
      runningPlayerCount: status.runningPlayerCount,
      lastRunTime: status.lastRunTime ? status.lastRunTime.toISOString() : null,
      autoStartEnabled: status.autoStartEnabled,
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
    const { action, autoStart } = body

    if (action === 'start') {
      await startScheduler()
      return NextResponse.json({ success: true, message: 'Scheduler started' })
    }

    if (action === 'stop') {
      stopScheduler()
      return NextResponse.json({ success: true, message: 'Scheduler stopped' })
    }

    if (action === 'init') {
      await initScheduler()
      return NextResponse.json({ success: true, message: 'Scheduler initialized' })
    }

    if (action === 'setAutoStart' && typeof autoStart === 'boolean') {
      await setSchedulerAutoStart(autoStart)
      return NextResponse.json({ success: true, message: `Auto-start ${autoStart ? 'enabled' : 'disabled'}` })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update scheduler' }, { status: 500 })
  }
}
