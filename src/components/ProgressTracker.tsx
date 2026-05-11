'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Target, Trophy, Calendar } from 'lucide-react'

interface GameProgress {
  gameId: string
  gameName: string
  gameImage?: string
  milestones: Milestone[]
  startedAt: string
  lastPlayedAt: string
  totalPlaytime?: number
}

interface Milestone {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: string
}

interface ProgressTrackerProps {
  gameId: string
  gameName: string
  gameImage?: string
  milestones?: Omit<Milestone, 'id' | 'completed' | 'completedAt'>[]
}

const PROGRESS_KEY = 'gamehub_progress'

const DEFAULT_MILESTONES = [
  { title: 'Started Playing', description: 'Begin your journey' },
  { title: 'First 10 Hours', description: 'Get comfortable with the game' },
  { title: 'Main Story 25%', description: 'Quarter way through' },
  { title: 'Main Story 50%', description: 'Halfway there!' },
  { title: 'Main Story 75%', description: 'Almost complete' },
  { title: 'Main Story Complete', description: 'Finished the main story' },
  { title: '100% Completion', description: 'Everything done!' }
]

export function ProgressTracker({
  gameId,
  gameName,
  gameImage,
  milestones = DEFAULT_MILESTONES
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState<GameProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadProgress()
  }, [gameId])

  const loadProgress = () => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) {
      initializeProgress()
      return
    }

    try {
      const allProgress: GameProgress[] = JSON.parse(stored)
      const gameProgress = allProgress.find(p => p.gameId === gameId)
      if (gameProgress) {
        setProgress(gameProgress)
      } else {
        initializeProgress()
      }
    } catch {
      initializeProgress()
    }
  }

  const initializeProgress = () => {
    const initialMilestones: Milestone[] = milestones.map((m, i) => ({
      id: `milestone_${i}`,
      title: m.title,
      description: m.description,
      completed: i === 0
    }))

    const newProgress: GameProgress = {
      gameId,
      gameName,
      gameImage,
      milestones: initialMilestones,
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString()
    }

    saveProgress(newProgress)
    setProgress(newProgress)
  }

  const saveProgress = (newProgress: GameProgress) => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(PROGRESS_KEY)
      const allProgress: GameProgress[] = stored ? JSON.parse(stored) : []

      const index = allProgress.findIndex(p => p.gameId === gameId)
      if (index > -1) {
        allProgress[index] = newProgress
      } else {
        allProgress.push(newProgress)
      }

      localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
    } catch {
      console.error('Failed to save progress')
    }
  }

  const toggleMilestone = (milestoneId: string) => {
    if (!progress) return

    const updatedMilestones = progress.milestones.map(m => {
      if (m.id === milestoneId) {
        const newCompleted = !m.completed
        return {
          ...m,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : undefined
        }
      }
      return m
    })

    const updatedProgress: GameProgress = {
      ...progress,
      milestones: updatedMilestones,
      lastPlayedAt: new Date().toISOString()
    }

    saveProgress(updatedProgress)
    setProgress(updatedProgress)
  }

  const completionPercentage = progress
    ? Math.round((progress.milestones.filter(m => m.completed).length / progress.milestones.length) * 100)
    : 0

  const completedCount = progress?.milestones.filter(m => m.completed).length || 0
  const totalCount = progress?.milestones.length || 0

  if (!mounted || !progress) {
    return (
      <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Your Progress</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{gameName}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-light)' }}>
            {completionPercentage}%
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {completedCount}/{totalCount} milestones
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${completionPercentage}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-light))'
            }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {progress.milestones.map((milestone, index) => (
          <button
            key={milestone.id}
            onClick={() => toggleMilestone(milestone.id)}
            className="w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.01]"
            style={{
              backgroundColor: milestone.completed ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${milestone.completed ? 'rgba(34, 197, 94, 0.3)' : 'var(--border)'}`
            }}
          >
            <div className="mt-0.5">
              {milestone.completed ? (
                <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
              ) : (
                <Circle size={22} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
            <div className="flex-1">
              <p
                className="font-medium"
                style={{
                  color: milestone.completed ? '#22c55e' : 'var(--text-primary)',
                  textDecoration: milestone.completed ? 'none' : 'none'
                }}
              >
                {milestone.title}
              </p>
              {milestone.description && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {milestone.description}
                </p>
              )}
            </div>
            {milestone.completed && milestone.completedAt && (
              <span className="text-xs" style={{ color: '#22c55e' }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>Started {new Date(progress.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
            <Trophy size={14} style={{ color: '#eab308' }} />
            <span className="text-sm font-medium" style={{ color: '#eab308' }}>Completed!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function getGameProgress(gameId: string): GameProgress | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return null

    const allProgress: GameProgress[] = JSON.parse(stored)
    return allProgress.find(p => p.gameId === gameId) || null
  } catch {
    return null
  }
}
