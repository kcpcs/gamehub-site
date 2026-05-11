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

  try {
    if (playerId) {
      const stats = await db.aIStats.findMany({
        where: { player_id: playerId },
        orderBy: { date: 'desc' },
        take: 30,
      })

      return NextResponse.json({ success: true, data: stats })
    }

    const overview = await db.aIPlayer.aggregate({
      _count: { id: true },
      _sum: { total_posts: true, total_comments: true },
      where: { status: 'active' },
    })

    const statusCounts = await db.aIPlayer.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    const totalActivity = await db.aIActivityLog.aggregate({
      _count: { id: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        total_active: overview._count.id,
        total_posts: overview._sum.total_posts || 0,
        total_comments: overview._sum.total_comments || 0,
        total_activities: totalActivity._count.id,
        status_distribution: statusCounts.map(s => ({
          status: s.status,
          count: s._count.id,
        })),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
