import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const playerId = searchParams.get('player_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: Record<string, any> = {}
  if (playerId) {
    where.player_id = playerId
  }

  const logs = await db.aIActivityLog.findMany({
    where,
    include: {
      player: {
        select: { username: true },
      },
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  })

  return NextResponse.json({ success: true, data: logs })
}
