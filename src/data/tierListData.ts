import type { TierEntry, TierGrade } from '@/types'
import { getCharactersByGame } from './gameCharacters'

const tierGrades: TierGrade[] = ['S', 'A', 'B', 'C', 'D', 'F']

const generateDefaultTierEntries = (gameSlug: string): TierEntry[] => {
  const characters = getCharactersByGame(gameSlug)
  if (characters.length === 0) return []

  const tierSize = Math.ceil(characters.length / tierGrades.length)
  const entries: TierEntry[] = []

  characters.forEach((character, index) => {
    const tierIndex = Math.min(Math.floor(index / tierSize), tierGrades.length - 1)
    const grade = tierGrades[tierIndex]
    
    const baseScore = {
      'S': 95 + Math.random() * 5,
      'A': 85 + Math.random() * 10,
      'B': 75 + Math.random() * 10,
      'C': 65 + Math.random() * 10,
      'D': 55 + Math.random() * 10,
      'F': 40 + Math.random() * 15
    }[grade]

    entries.push({
      id: character.id,
      name: character.name,
      image_url: character.image_url,
      grade,
      avg_score: Math.round(baseScore * 10) / 10,
      vote_count: Math.floor(Math.random() * 500),
      description: ''
    })
  })

  return entries.sort((a, b) => b.avg_score - a.avg_score)
}

export function getDefaultTierList(gameSlug: string) {
  const entries = generateDefaultTierEntries(gameSlug)
  
  return {
    id: `default-tier-${gameSlug}`,
    game_id: `game-${gameSlug}`,
    game_slug: gameSlug,
    category: 'character' as const,
    version: 'Latest',
    title: `${gameSlug.replace('-', ' ')} Tier List`,
    description: `Community-voted tier list for ${gameSlug.replace('-', ' ')} characters`,
    entries,
    total_votes: entries.reduce((sum, e) => sum + e.vote_count, 0),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export function groupEntriesByTier(entries: TierEntry[]): Record<TierGrade, TierEntry[]> {
  const grouped: Record<TierGrade, TierEntry[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: []
  }

  entries.forEach(entry => {
    if (entry.grade in grouped) {
      grouped[entry.grade].push(entry)
    }
  })

  tierGrades.forEach(grade => {
    grouped[grade].sort((a, b) => b.avg_score - a.avg_score)
  })

  return grouped
}