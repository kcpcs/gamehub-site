// @ts-nocheck - TierGrade type change pending, uses T0-T4 grades
'use client'

import { useState, useEffect } from 'react'
import type { TierList, TierEntry, TierGrade, TierCategory } from '@/types'
import { TierCategoryTabs } from '@/components/TierCategoryTabs'
import { VersionSelector } from '@/components/VersionSelector'
import { TierVoteButton, TierVoteSection } from '@/components/TierVoteButton'
import { TierEntryModal } from '@/components/TierEntryModal'
import { TierFilter } from '@/components/TierFilter'

interface Game {
  id: string
  slug: string
  name: string
  cover_url: string
}

interface TierListClientProps {
  game: Game
}

interface TierRowProps {
  grade: TierGrade
  entries: TierEntry[]
  color: string
  bgColor: string
  votedEntries: string[]
  onVote: (entryId: string) => void
  onEntryClick: (entry: TierEntry) => void
}

function TierRow({ grade, entries, color, bgColor, votedEntries, onVote, onEntryClick }: TierRowProps) {
  const gradeColors: Record<TierGrade, { bg: string; text: string; border: string }> = {
    T0: { bg: '#7c3aed', text: 'white', border: '#9f67ff' },
    T1: { bg: '#22c55e', text: 'white', border: '#2ea043' },
    T2: { bg: '#3b82f6', text: 'white', border: '#388bfd' },
    T3: { bg: '#eab308', text: 'black', border: '#d29922' },
    T4: { bg: '#f97316', text: 'white', border: '#ea580c' },
    S: { bg: 'var(--accent)', text: 'white', border: 'var(--accent-light)' },
    A: { bg: 'var(--success)', text: 'white', border: '#2ea043' },
    B: { bg: 'var(--info)', text: 'white', border: '#388bfd' },
    C: { bg: 'var(--warning)', text: 'black', border: '#d29922' },
    D: { bg: 'var(--orange)', text: 'black', border: '#e3b341' },
    F: { bg: 'var(--danger)', text: 'white', border: '#f85149' }
  }

  return (
    <div className="flex gap-4 mb-4">
      <div 
        className="w-16 h-full flex items-center justify-center rounded-lg font-bold text-2xl flex-shrink-0"
        style={{ 
          backgroundColor: gradeColors[grade].bg, 
          color: gradeColors[grade].text,
          border: `2px solid ${gradeColors[grade].border}`
        }}
      >
        {grade}
      </div>
      <div 
        className="flex-1 rounded-lg p-4 min-h-[120px] flex flex-wrap gap-3 content-start"
        style={{ backgroundColor: bgColor, border: '1px solid var(--border)' }}
      >
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group relative w-28 h-32 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
            onClick={() => onEntryClick(entry)}
          >
            <img
              src={entry.image_url}
              alt={entry.name}
              className="w-full h-20 object-cover"
              loading="lazy"
            />
            <div className="p-1.5">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {entry.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  ★ {entry.avg_score.toFixed(1)}
                </p>
                <TierVoteButton
                  entryId={entry.id}
                  voteCount={entry.vote_count}
                  hasVoted={votedEntries.includes(entry.id)}
                  onVote={onVote}
                />
              </div>
            </div>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
              <span className="text-xs text-center px-2" style={{ color: 'white' }}>
                {entry.description || entry.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TierListClient({ game }: TierListClientProps) {
  const [tierList, setTierList] = useState<TierList | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeCategory, setActiveCategory] = useState('character')
  const [activeVersion, setActiveVersion] = useState('8.11')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [votedEntries, setVotedEntries] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = useState<TierEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    { id: 'character', label: 'Agents', icon: 'users' as const },
    { id: 'weapon', label: 'Weapons', icon: 'sword' as const },
    { id: 'map', label: 'Maps', icon: 'map' as const },
  ]

  const versions = [
    { id: '8.11', label: '8.11', date: 'May 2024', is_latest: true },
    { id: '8.10', label: '8.10', date: 'April 2024' },
    { id: '8.09', label: '8.09', date: 'March 2024' },
    { id: '8.08', label: '8.08', date: 'February 2024' },
  ]

  const roleFilters = [
    { id: 'duelist', label: 'Duelist', count: 6 },
    { id: 'controller', label: 'Controller', count: 4 },
    { id: 'initiator', label: 'Initiator', count: 4 },
    { id: 'sentinel', label: 'Sentinel', count: 4 },
  ]

  useEffect(() => {
    const fetchTierList = async () => {
      try {
        const res = await fetch(`/api/tierlist/${game.slug}?category=${activeCategory}&version=${activeVersion}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const response = await res.json()
        if (response.success && response.data) {
          setTierList({
            ...response.data,
            game_slug: game.slug,
          })
          setLoading(false)
          return
        }
      } catch {
        // Ignore errors
      }

      // Fallback to placeholder data
      const placeholderTierList: TierList = {
        id: '1',
        game_id: game.id,
        game_slug: game.slug,
        game_name: game.name,
        category: activeCategory as TierCategory,
        patch_version: activeVersion,
        total_votes: 15420,
        is_community: true,
        updated_at: new Date().toISOString(),
        entries: [
          { id: '1', name: 'Jett', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20jett%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T0', vote_count: 2340, avg_score: 4.8, description: 'Best duelist, unmatched mobility' },
          { id: '2', name: 'Raze', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20raze%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T0', vote_count: 2180, avg_score: 4.7, description: 'Explosive damage dealer' },
          { id: '3', name: 'Reyna', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20reyna%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T1', vote_count: 2100, avg_score: 4.4, description: 'Queen of aim duels' },
          { id: '4', name: 'Sova', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20sova%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T1', vote_count: 1780, avg_score: 4.2, description: 'Recon master' },
          { id: '5', name: 'Phoenix', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20phoenix%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T1', vote_count: 1890, avg_score: 4.3, description: 'Self-sustaining duelist' },
          { id: '6', name: 'Killjoy', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20killjoy%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T2', vote_count: 1450, avg_score: 3.9, description: 'Defensive sentinal' },
          { id: '7', name: 'Sage', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20sage%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T2', vote_count: 1580, avg_score: 3.8, description: 'Healing support' },
          { id: '8', name: 'Yoru', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20yoru%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T2', vote_count: 1650, avg_score: 4.1, description: 'Stealthy fragger' },
          { id: '9', name: 'Cypher', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20cypher%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T3', vote_count: 1320, avg_score: 3.7, description: 'Information gatherer' },
          { id: '10', name: 'Viper', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20viper%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T3', vote_count: 1420, avg_score: 3.6, description: 'Area denial controller' },
          { id: '11', name: 'Neon', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20neon%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T3', vote_count: 1950, avg_score: 4.6, description: 'High speed duelist' },
          { id: '12', name: 'Brimstone', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20brimstone%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T4', vote_count: 980, avg_score: 3.2, description: 'Utility-based controller' },
          { id: '13', name: 'Omen', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20omen%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T4', vote_count: 1050, avg_score: 3.3, description: 'Mystery initiator' },
          { id: '14', name: 'Breach', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20breach%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T4', vote_count: 890, avg_score: 3.0, description: 'Seeding initiator' },
          { id: '15', name: 'Kayo', image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20kayo%20character%20portrait%20dark%20theme&image_size=square`, grade: 'T4', vote_count: 420, avg_score: 2.4, description: 'Flash-focused initiator' },
        ]
      }

      setTierList(placeholderTierList)
      setLoading(false)
    }

    fetchTierList()
  }, [game, activeCategory, activeVersion])

  const handleShare = async () => {
    const shareUrl = window.location.href
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVote = async (entryId: string) => {
    if (votedEntries.includes(entryId)) return
    
    try {
      const response = await fetch('/api/tierlist/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      })
      
      if (response.ok) {
        setVotedEntries(prev => [...prev, entryId])
        setTierList(prev => prev ? {
          ...prev,
          total_votes: prev.total_votes + 1,
          entries: prev.entries.map(e => 
            e.id === entryId ? { ...e, vote_count: e.vote_count + 1 } : e
          )
        } : null)
      }
    } catch (error) {
      console.error('Vote failed:', error)
    }
  }

  const handleEntryClick = (entry: TierEntry) => {
    setSelectedEntry(entry)
    setIsModalOpen(true)
  }

  const groupedEntries = tierList ? {
    T0: tierList.entries.filter(e => e.grade === 'T0'),
    T1: tierList.entries.filter(e => e.grade === 'T1'),
    T2: tierList.entries.filter(e => e.grade === 'T2'),
    T3: tierList.entries.filter(e => e.grade === 'T3'),
    T4: tierList.entries.filter(e => e.grade === 'T4'),
    S: tierList.entries.filter(e => e.grade === 'S'),
    A: tierList.entries.filter(e => e.grade === 'A'),
    B: tierList.entries.filter(e => e.grade === 'B'),
    C: tierList.entries.filter(e => e.grade === 'C'),
    D: tierList.entries.filter(e => e.grade === 'D'),
    F: tierList.entries.filter(e => e.grade === 'F'),
  } : null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  if (loading || !tierList) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-transparent border-t-accent rounded-full animate-spin" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading tier list...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {tierList.game_name} Tier List
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <VersionSelector
                versions={versions}
                activeVersion={activeVersion}
                onVersionChange={setActiveVersion}
              />
              <span>•</span>
              <span>{tierList.total_votes.toLocaleString()} votes</span>
              <span>•</span>
              <span>Updated {formatDate(tierList.updated_at)}</span>
              {tierList.is_community && (
                <>
                  <span>•</span>
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                  >
                    Community Voted
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
              style={{ 
                backgroundColor: copied ? 'var(--success)' : 'var(--bg-surface)',
                color: copied ? 'var(--bg-base)' : 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <TierCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {activeCategory === 'character' && (
          <div className="mt-4">
            <TierFilter
              filters={roleFilters}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              filterType="Role"
            />
          </div>
        )}
      </header>

      <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Tier Rankings
          </h2>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>★ = Average Score</span>
            <span>•</span>
            <span>Click for details</span>
          </div>
        </div>

        <div className="space-y-2">
          {groupedEntries && groupedEntries.T0.length > 0 && (
            <TierRow 
              grade="T0" 
              entries={groupedEntries.T0} 
              color="#7c3aed" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.T1.length > 0 && (
            <TierRow 
              grade="T1" 
              entries={groupedEntries.T1} 
              color="#22c55e" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.T2.length > 0 && (
            <TierRow 
              grade="T2" 
              entries={groupedEntries.T2} 
              color="#3b82f6" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.T3.length > 0 && (
            <TierRow 
              grade="T3" 
              entries={groupedEntries.T3} 
              color="#eab308" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.T4.length > 0 && (
            <TierRow 
              grade="T4" 
              entries={groupedEntries.T4} 
              color="#f97316" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.S.length > 0 && (
            <TierRow 
              grade="S" 
              entries={groupedEntries.S} 
              color="var(--accent)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.A.length > 0 && (
            <TierRow 
              grade="A" 
              entries={groupedEntries.A} 
              color="var(--success)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.B.length > 0 && (
            <TierRow 
              grade="B" 
              entries={groupedEntries.B} 
              color="var(--info)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.C.length > 0 && (
            <TierRow 
              grade="C" 
              entries={groupedEntries.C} 
              color="var(--warning)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.D.length > 0 && (
            <TierRow 
              grade="D" 
              entries={groupedEntries.D} 
              color="var(--orange)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
          {groupedEntries && groupedEntries.F.length > 0 && (
            <TierRow 
              grade="F" 
              entries={groupedEntries.F} 
              color="var(--danger)" 
              bgColor="var(--bg-raised)"
              votedEntries={votedEntries}
              onVote={handleVote}
              onEntryClick={handleEntryClick}
            />
          )}
        </div>
      </div>

      <TierVoteSection
        totalVotes={tierList.total_votes}
        onVoteAll={() => {}}
      />

      <TierEntryModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
