import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { ApiResponse } from '@/types'

interface AchievementWithProgress {
  id: string
  slug: string
  title: string
  description: string
  icon_url: string | null
  points: number
  category: string | null
  condition: any
  is_active: boolean
  created_at: string
  updated_at: string
  unlocked: boolean
  unlocked_at: string | null
  progress: any
}

export async function GET(_req: NextRequest) {
  const session = await auth()

  try {
    const achievements = await db.achievement.findMany({
      where: { is_active: true },
      orderBy: { points: 'desc' }
    })

    let userAchievements: any[] = []
    if (session?.user?.id) {
      userAchievements = await db.userAchievement.findMany({
        where: { user_id: session.user.id }
      })
    }

    const userAchievementMap = new Map(
      userAchievements.map(ua => [ua.achievement_id, ua])
    )

    const transformed: AchievementWithProgress[] = achievements.map(a => {
      const userAchievement = userAchievementMap.get(a.id)
      return {
        ...a,
        condition: a.condition,
        created_at: a.created_at.toISOString(),
        updated_at: a.updated_at.toISOString(),
        unlocked: !!userAchievement,
        unlocked_at: userAchievement?.unlocked_at?.toISOString() || null,
        progress: userAchievement?.progress || null
      }
    })

    const response: ApiResponse<AchievementWithProgress[]> = {
      success: true,
      data: transformed
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('[GET /api/achievements]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
