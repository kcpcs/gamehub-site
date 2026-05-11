import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    let result
    switch (action) {
      case 'start':
        result = await db.aIPlayer.updateMany({
          where: { id: { in: ids } },
          data: { status: 'active' },
        })
        break
      case 'stop':
        result = await db.aIPlayer.updateMany({
          where: { id: { in: ids } },
          data: { status: 'inactive' },
        })
        break
      case 'pause':
        result = await db.aIPlayer.updateMany({
          where: { id: { in: ids } },
          data: { status: 'paused' },
        })
        break
      case 'delete':
        result = await db.aIPlayer.deleteMany({
          where: { id: { in: ids } },
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Batch ${action} completed`,
      count: action === 'delete' ? result.count : result.count 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Batch operation failed' }, { status: 500 })
  }
}
