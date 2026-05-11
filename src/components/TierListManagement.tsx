// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface TierEntry {
  id: string
  name: string
  image_url: string
  grade: string
  vote_count: number
  avg_score: number
  description: string | null
}

interface TierList {
  id: string
  game_id: string
  category: string
  patch_version: string
  is_community: boolean
  total_votes: number
  updated_at: string
  created_at: string
  game: {
    id: string
    name: string
    slug: string
    cover_url?: string
  }
  entries: TierEntry[]
  _count: {
    entries: number
    votes: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const CATEGORY_LABELS: Record<string, string> = {
  character: 'Characters',
  weapon: 'Weapons',
  class: 'Classes',
  skill: 'Skills',
  item: 'Items',
}

const GRADE_COLORS: Record<string, string> = {
  S: 'bg-red-500',
  A: 'bg-orange-500',
  B: 'bg-yellow-500',
  C: 'bg-green-500',
  D: 'bg-blue-500',
  F: 'bg-gray-500',
}

export function TierListManagement() {
  const [tierLists, setTierLists] = useState<TierList[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTierList, setSelectedTierList] = useState<TierList | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Create/edit form state
  const [formGameId, setFormGameId] = useState('')
  const [formCategory, setFormCategory] = useState('character')
  const [formPatchVersion, setFormPatchVersion] = useState('')
  const [formIsCommunity, setFormIsCommunity] = useState(true)
  const [formEntries, setFormEntries] = useState<Array<{ id?: string; name: string; image_url: string; grade: string; description: string }>>([])

  // Games list for dropdown
  const [games, setGames] = useState<Array<{ id: string; name: string }>>([])

  const fetchTierLists = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (searchTerm) params.set('search', searchTerm)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)

      const res = await fetch(`/api/admin/tierlists?${params}`)
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch tier lists')
      }

      setTierLists(data.data)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tier lists')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, searchTerm, categoryFilter])

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/admin/games?limit=100')
      const data = await res.json()
      if (data.success) {
        setGames(data.data.map((g: any) => ({ id: g.id, name: g.name })))
      }
    } catch (err) {
      console.error('Failed to fetch games:', err)
    }
  }

  useEffect(() => {
    fetchTierLists()
  }, [fetchTierLists])

  useEffect(() => {
    fetchGames()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tier list? All entries and votes will be removed.')) return

    try {
      const res = await fetch(`/api/admin/tierlists/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setTierLists(prev => prev.filter(t => t.id !== id))
    } catch (err: any) {
      alert('Failed to delete: ' + (err.message || 'Unknown error'))
    }
  }

  const handleView = (list: TierList) => {
    setSelectedTierList(list)
    setShowViewModal(true)
  }

  const handleEdit = (list: TierList) => {
    setSelectedTierList(list)
    setFormGameId(list.game_id)
    setFormCategory(list.category)
    setFormPatchVersion(list.patch_version)
    setFormIsCommunity(list.is_community)
    setFormEntries(list.entries.map(e => ({
      id: e.id,
      name: e.name,
      image_url: e.image_url,
      grade: e.grade,
      description: e.description || '',
    })))
    setShowEditModal(true)
  }

  const handleCreate = () => {
    setFormGameId(games[0]?.id || '')
    setFormCategory('character')
    setFormPatchVersion('')
    setFormIsCommunity(true)
    setFormEntries([])
    setShowCreateModal(true)
  }

  const addEntry = () => {
    setFormEntries(prev => [...prev, { name: '', image_url: '', grade: 'S', description: '' }])
  }

  const removeEntry = (index: number) => {
    setFormEntries(prev => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: string, value: string) => {
    setFormEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  const handleSaveCreate = async () => {
    if (!formGameId || !formPatchVersion) {
      alert('Please fill in all required fields (game, patch version)')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/tierlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: formGameId,
          category: formCategory,
          patch_version: formPatchVersion,
          is_community: formIsCommunity,
          entries: formEntries.filter(e => e.name.trim()),
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      setShowCreateModal(false)
      fetchTierLists()
    } catch (err: any) {
      alert('Failed to create: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedTierList) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tierlists/${selectedTierList.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patch_version: formPatchVersion,
          is_community: formIsCommunity,
          entries: formEntries.filter(e => e.name.trim()),
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      setShowEditModal(false)
      fetchTierLists()
    } catch (err: any) {
      alert('Failed to update: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  // Search debounce
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(searchInput), 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  if (error && !loading && tierLists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-lg font-medium text-gray-900 dark:text-white">Failed to load tier lists</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchTierLists}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by game name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          New Tier List
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <span className="ml-3 text-gray-500 dark:text-gray-400">Loading tier lists...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Votes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grades</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tierLists.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No tier lists found. Create one to get started.
                  </td>
                </tr>
              ) : (
                tierLists.map((list) => (
                  <tr key={list.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{list.game?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded">
                        {CATEGORY_LABELS[list.category] || list.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      v{list.patch_version}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                        {list._count.entries}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {list._count.votes}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {list.entries.slice(0, 6).map((entry) => (
                          <span
                            key={entry.id}
                            className={`w-6 h-6 ${GRADE_COLORS[entry.grade] || 'bg-gray-500'} rounded flex items-center justify-center text-white text-xs font-bold`}
                            title={`${entry.name}: ${entry.grade}`}
                          >
                            {entry.grade}
                          </span>
                        ))}
                        {list.entries.length > 6 && (
                          <span className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs">
                            +{list.entries.length - 6}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(list)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(list)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(list.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTierList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tier List Details</h3>
                <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Game:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTierList.game?.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">{CATEGORY_LABELS[selectedTierList.category] || selectedTierList.category}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Version:</span>
                  <span className="text-gray-900 dark:text-white">v{selectedTierList.patch_version}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Votes:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTierList.total_votes}</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">Entries ({selectedTierList.entries.length})</h4>
              <div className="space-y-2">
                {selectedTierList.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className={`w-8 h-8 ${GRADE_COLORS[entry.grade] || 'bg-gray-500'} rounded flex items-center justify-center text-white font-bold text-sm`}>
                      {entry.grade}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">{entry.name}</div>
                      {entry.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.description}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.vote_count} votes
                    </div>
                  </div>
                ))}
                {selectedTierList.entries.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No entries yet</p>
                )}
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="mt-6 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {showCreateModal ? 'Create Tier List' : 'Edit Tier List'}
                </h3>
                <button
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false) }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Game selection - only for create */}
                {showCreateModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Game *</label>
                    <select
                      value={formGameId}
                      onChange={(e) => setFormGameId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a game</option>
                      {games.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category - only for create */}
                {showCreateModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patch Version *</label>
                    <input
                      type="text"
                      value={formPatchVersion}
                      onChange={(e) => setFormPatchVersion(e.target.value)}
                      placeholder="e.g. 4.5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsCommunity}
                        onChange={(e) => setFormIsCommunity(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Community Tier List</span>
                    </label>
                  </div>
                </div>

                {/* Entries */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Entries</label>
                    <button
                      onClick={addEntry}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                    >
                      <Plus size={14} />
                      Add Entry
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formEntries.map((entry, index) => (
                      <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="text"
                          value={entry.name}
                          onChange={(e) => updateEntry(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <select
                          value={entry.grade}
                          onChange={(e) => updateEntry(index, 'grade', e.target.value)}
                          className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {['S', 'A', 'B', 'C', 'D', 'F'].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) => updateEntry(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeEntry(index)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {formEntries.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No entries yet. Click &quot;Add Entry&quot; to start.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false) }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleSaveCreate : handleSaveEdit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {showCreateModal ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
