'use client'

import { useState, useCallback } from 'react'
import { getGameImageUrl } from '@/lib/game-images'
import { Plus, Trash2, Save, Download, Upload, GripVertical, X } from 'lucide-react'
import type { TierGrade, TierEntry } from '@/types'

interface TierMakerProps {
  initialEntries?: TierEntry[]
  onSave?: (entries: TierEntry[]) => void
}

const TIER_COLORS: Record<TierGrade, { bg: string; text: string; border: string }> = {
  S: { bg: 'var(--accent)', text: 'white', border: 'var(--accent-light)' },
  A: { bg: 'var(--success)', text: 'white', border: '#2ea043' },
  B: { bg: 'var(--info)', text: 'white', border: '#388bfd' },
  C: { bg: 'var(--warning)', text: 'black', border: '#d29922' },
  D: { bg: 'var(--orange)', text: 'black', border: '#e3b341' },
  F: { bg: 'var(--danger)', text: 'white', border: '#f85149' }
}

const TIER_GRADES: TierGrade[] = ['S', 'A', 'B', 'C', 'D', 'F']

interface DraggedItem {
  id: string
  fromGrade: TierGrade
}

export function TierMaker({ initialEntries = [], onSave }: TierMakerProps) {
  const [entries, setEntries] = useState<TierEntry[]>(initialEntries)
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [draggingOverGrade, setDraggingOverGrade] = useState<TierGrade | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntry, setNewEntry] = useState({ name: '', image_url: '', description: '' })
  const [saved, setSaved] = useState(false)

  const groupedEntries = TIER_GRADES.reduce((acc, grade) => {
    acc[grade] = entries.filter(e => e.grade === grade)
    return acc
  }, {} as Record<TierGrade, TierEntry[]>)

  const handleDragStart = useCallback((e: React.DragEvent, id: string, grade: TierGrade) => {
    setDraggedItem({ id, fromGrade: grade })
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, grade: TierGrade) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggingOverGrade(grade)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDraggingOverGrade(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toGrade: TierGrade) => {
    e.preventDefault()
    if (!draggedItem) return

    setEntries(prev => prev.map(entry => 
      entry.id === draggedItem.id 
        ? { ...entry, grade: toGrade }
        : entry
    ))

    setDraggedItem(null)
    setDraggingOverGrade(null)
  }, [draggedItem])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDraggingOverGrade(null)
  }, [])

  const handleAddEntry = () => {
    if (!newEntry.name.trim()) return

    const entry: TierEntry = {
      id: `entry-${Date.now()}`,
      name: newEntry.name.trim(),
      image_url: newEntry.image_url || getGameImageUrl(newEntry.name, 'small'),
      grade: 'C',
      vote_count: 0,
      avg_score: 3,
      description: newEntry.description
    }

    setEntries(prev => [...prev, entry])
    setNewEntry({ name: '', image_url: '', description: '' })
    setShowAddModal(false)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(entries)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const data = JSON.stringify(entries, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tier-list.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          setEntries(imported)
        }
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tier Maker
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Drag and drop entries to organize your tier list
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors" style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-primary)' }}>
            <Upload className="w-4 h-4" />
            <span className="text-sm">Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-primary)' }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Entry</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: saved ? 'var(--success)' : 'var(--accent)', color: 'white' }}
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">{saved ? 'Saved!' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {TIER_GRADES.map((grade) => (
          <div
            key={grade}
            className="flex gap-4 p-4 rounded-xl transition-all"
            style={{
              backgroundColor: draggingOverGrade === grade ? `${TIER_COLORS[grade].bg}20` : 'var(--bg-surface)',
              border: `1px solid ${draggingOverGrade === grade ? TIER_COLORS[grade].border : 'var(--border)'}`,
              minHeight: '120px'
            }}
            onDragOver={(e) => handleDragOver(e, grade)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, grade)}
          >
            <div
              className="w-16 h-full flex items-center justify-center rounded-lg font-bold text-2xl flex-shrink-0"
              style={{
                backgroundColor: TIER_COLORS[grade].bg,
                color: TIER_COLORS[grade].text,
                border: `2px solid ${TIER_COLORS[grade].border}`
              }}
            >
              {grade}
            </div>
            <div className="flex-1 flex flex-wrap gap-3 min-h-[80px] content-start">
              {groupedEntries[grade].map((entry) => (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, entry.id, entry.grade)}
                  onDragEnd={handleDragEnd}
                  className="group relative w-28 h-36 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: draggedItem?.id === entry.id ? `2px dashed ${TIER_COLORS[grade].border}` : '1px solid var(--border)',
                    opacity: draggedItem?.id === entry.id ? 0.5 : 1
                  }}
                >
                  <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 rounded bg-black/50 text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
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
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      ★ {entry.avg_score.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
              {groupedEntries[grade].length === 0 && draggingOverGrade === grade && (
                <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Add New Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/5 rounded transition-colors">
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                <input
                  type="text"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Entry name"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Image URL (optional)</label>
                <input
                  type="text"
                  value={newEntry.image_url}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description (optional)</label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.name.trim()}
                  className="flex-1 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}