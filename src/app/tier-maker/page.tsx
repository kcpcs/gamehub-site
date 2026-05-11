'use client'

import { useState, useEffect } from 'react'
import { TierMaker } from '@/components/TierMaker'
import { Sparkles } from 'lucide-react'
import { getGameImageUrl } from '@/lib/game-images'
import type { TierEntry, TierGrade } from '@/types'

export default function TierMakerPage() {
  const [entries, setEntries] = useState<TierEntry[]>([])
  const [gameName, setGameName] = useState('My Game')
  const [patchVersion, setPatchVersion] = useState('1.0.0')
  const [category, setCategory] = useState<'character' | 'weapon' | 'class' | 'skill' | 'item'>('character')

  useEffect(() => {
    const defaultEntries: TierEntry[] = [
      { id: '1', name: 'Warrior', image_url: getGameImageUrl('warrior fantasy character', 'small'), grade: 'S', vote_count: 120, avg_score: 4.9, description: 'Top tier character' },
      { id: '2', name: 'Mage', image_url: getGameImageUrl('mage wizard fantasy character', 'small'), grade: 'S', vote_count: 115, avg_score: 4.8, description: 'Excellent choice' },
      { id: '3', name: 'Ranger', image_url: getGameImageUrl('ranger archer fantasy character', 'small'), grade: 'A', vote_count: 98, avg_score: 4.5, description: 'Great option' },
      { id: '4', name: 'Rogue', image_url: getGameImageUrl('rogue assassin fantasy character', 'small'), grade: 'A', vote_count: 92, avg_score: 4.4, description: 'Solid pick' },
      { id: '5', name: 'Paladin', image_url: getGameImageUrl('paladin knight fantasy character', 'small'), grade: 'B', vote_count: 75, avg_score: 3.9, description: 'Good but not great' },
      { id: '6', name: 'Cleric', image_url: getGameImageUrl('cleric healer fantasy character', 'small'), grade: 'B', vote_count: 70, avg_score: 3.8, description: 'Decent option' },
      { id: '7', name: 'Barbarian', image_url: getGameImageUrl('barbarian warrior fantasy character', 'small'), grade: 'C', vote_count: 55, avg_score: 3.2, description: 'Average' },
      { id: '8', name: 'Druid', image_url: getGameImageUrl('druid nature fantasy character', 'small'), grade: 'C', vote_count: 50, avg_score: 3.0, description: 'Below average' },
      { id: '9', name: 'Bard', image_url: getGameImageUrl('bard musician fantasy character', 'small'), grade: 'D', vote_count: 30, avg_score: 2.5, description: 'Struggles in meta' },
      { id: '10', name: 'Alchemist', image_url: getGameImageUrl('alchemist wizard fantasy character', 'small'), grade: 'F', vote_count: 15, avg_score: 1.8, description: 'Avoid if possible' },
    ]
    setEntries(defaultEntries)
  }, [])

  const handleSave = (savedEntries: TierEntry[]) => {
    const tierListData = {
      game_name: gameName,
      patch_version: patchVersion,
      category,
      entries: savedEntries,
      total_votes: savedEntries.reduce((sum, e) => sum + e.vote_count, 0),
      created_at: new Date().toISOString()
    }
    
    console.log('Tier List saved:', tierListData)
    
    const dataStr = JSON.stringify(tierListData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gameName.toLowerCase().replace(/\s+/g, '-')}-tier-list-${patchVersion}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-light)' }}>Create Your Own Tier List</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Tier Maker
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Drag and drop entries to create your perfect tier list
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Patch Version</label>
            <input
              type="text"
              value={patchVersion}
              onChange={(e) => setPatchVersion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="character">Characters</option>
              <option value="weapon">Weapons</option>
              <option value="class">Classes</option>
              <option value="skill">Skills</option>
              <option value="item">Items</option>
            </select>
          </div>
        </div>

        <TierMaker initialEntries={entries} onSave={handleSave} />

        <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>How to Use</h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent)' }}>1.</span>
              <span>Click "Add Entry" to create new tier list items</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent)' }}>2.</span>
              <span>Drag entries between tiers to organize them</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent)' }}>3.</span>
              <span>Click the trash icon to remove entries</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent)' }}>4.</span>
              <span>Export your tier list as JSON or save to download</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}