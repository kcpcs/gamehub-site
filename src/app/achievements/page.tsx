import { Metadata } from 'next'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { AchievementGrid } from '@/components/AchievementGrid'
import { Breadcrumb } from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Achievements | GameHub',
  description: 'View your achievements and progress on GameHub'
}

export default async function AchievementsPage() {
  const session = await auth()
  
  let achievements: any[] = []
  
  try {
    const dbAchievements = await db.achievement.findMany({
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

    achievements = dbAchievements.map(a => {
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
  } catch (err) {
    console.error('Failed to fetch achievements:', err)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Achievements' }
        ]} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Achievements
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Unlock achievements by using GameHub features and contributing to the community
        </p>
      </div>

      <AchievementGrid achievements={achievements} />
    </div>
  )
}
