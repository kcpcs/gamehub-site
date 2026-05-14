'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'

interface Achievement {
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

interface AchievementGridProps {
  achievements?: Achievement[]
}

export function AchievementGrid({ achievements: initialAchievements }: AchievementGridProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements || [])
  const [loading, setLoading] = useState(!initialAchievements)
  const { t } = useLanguage()

  useEffect(() => {
    if (!initialAchievements) {
      fetchAchievements()
    }
  }, [initialAchievements])

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      const data = await res.json()
      if (data.success) {
        setAchievements(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch achievements:', err)
    } finally {
      setLoading(false)
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)

  const categories = [...new Set(achievements.map(a => a.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
          <div className="h-32 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            {unlockedCount}/{achievements.length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {t('achievements_unlocked') || 'Achievements Unlocked'}
          </div>
        </div>
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--success)' }}>
            {totalPoints}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {t('total_points') || 'Total Points'}
          </div>
        </div>
        <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--warning)' }}>
            {categories.length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {t('categories') || 'Categories'}
          </div>
        </div>
      </div>

      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category)
        
        return (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )
      })}

      {categories.length === 0 && achievements.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {t('no_achievements') || 'No achievements available'}
          </p>
        </div>
      )}
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-300 ${
        achievement.unlocked ? 'ring-2' : 'opacity-60'
      }`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: achievement.unlocked ? '1px solid var(--success)' : '1px solid var(--border)'
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
            achievement.unlocked ? '' : 'grayscale'
          }`}
          style={{
            backgroundColor: achievement.unlocked ? 'var(--accent)' : 'var(--bg-overlay)'
          }}
        >
          {achievement.icon_url ? (
            <img src={achievement.icon_url} alt={achievement.title} className="w-10 h-10 object-contain" />
          ) : (
            <span>🏆</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {achievement.title}
            </h4>
            <div
              className="px-2 py-1 rounded text-sm font-bold"
              style={{
                backgroundColor: achievement.unlocked ? 'var(--success)' : 'var(--bg-overlay)',
                color: achievement.unlocked ? 'white' : 'var(--text-muted)'
              }}
            >
              {achievement.points} pts
            </div>
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlocked_at && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
