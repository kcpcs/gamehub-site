'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Copy, Check, RefreshCw, AlertCircle, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface Code {
  id: string
  code: string
  game_id: string
  game: {
    id: string
    name: string
    slug: string
  }
  reward_desc: string
  status: 'active' | 'expired' | 'unverified'
  source: string
  expires_at: string | null
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' },
  expired: { label: 'Expired', className: 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400' },
  unverified: { label: 'Unverified', className: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' },
}

export function CodeManagementReal() {
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [selectedCode, setSelectedCode] = useState<Code | null>(null)
  const [formData, setFormData] = useState<Partial<Code>>({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchCodes = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'all' && { status }),
      })
      
      const response = await fetch(`/api/admin/codes?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch codes')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setCodes(result.data)
        setPagination(result.pagination)
      } else {
        throw new Error(result.error || 'Failed to fetch codes')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCodes(pagination.page, searchTerm, statusFilter)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCodes(1, searchTerm, statusFilter)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    fetchCodes(1, searchTerm, status)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCodes(newPage, searchTerm, statusFilter)
    }
  }

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleView = (code: Code) => {
    setSelectedCode(code)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (code: Code) => {
    setSelectedCode(code)
    setFormData(code)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedCode(null)
    setFormData({
      code: '',
      game_id: '',
      reward_desc: '',
      source: 'official',
    })
    setModalMode('create')
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const url = modalMode === 'create' 
        ? '/api/admin/codes' 
        : `/api/admin/codes/${selectedCode?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save code')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setShowModal(false)
        fetchCodes(pagination.page, searchTerm, statusFilter)
      } else {
        throw new Error(result.error || 'Failed to save code')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save code')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/codes/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete code')
      }
      
      setDeleteConfirm(null)
      fetchCodes(pagination.page, searchTerm, statusFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete code')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="unverified">Unverified</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Code
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <XIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Codes Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No codes found
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {code.code}
                        </code>
                        <button
                          onClick={() => handleCopy(code.code, code.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy"
                        >
                          {copiedId === code.id ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded">
                        {code.game?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {code.reward_desc}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                        {code.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusLabels[code.status]?.className || 'bg-gray-100 dark:bg-gray-600 text-gray-500'}`}>
                        {statusLabels[code.status]?.label || code.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(code)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="View">
                          <Copy size={18} />
                        </button>
                        <button onClick={() => handleEdit(code)} className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setDeleteConfirm(code.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'view' ? 'Code Details' : modalMode === 'edit' ? 'Edit Code' : 'Add Code'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modalMode === 'view' && selectedCode && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <code className="font-mono text-xl flex-1">{selectedCode.code}</code>
                    <button
                      onClick={() => handleCopy(selectedCode.code, selectedCode.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg"
                    >
                      {copiedId === selectedCode.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Game:</span>
                      <span className="font-medium ml-2">{selectedCode.game?.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Source:</span>
                      <span className="ml-2">{selectedCode.source}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ml-2 ${statusLabels[selectedCode.status]?.className}`}>
                        {statusLabels[selectedCode.status]?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Expires:</span>
                      <span className="ml-2">{selectedCode.expires_at ? new Date(selectedCode.expires_at).toLocaleDateString('en-US') : 'Never'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Reward:</span>
                    <p className="mt-1 font-medium">{selectedCode.reward_desc}</p>
                  </div>
                </div>
              )}
              {(modalMode === 'edit' || modalMode === 'create') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Code</label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reward</label>
                    <input
                      type="text"
                      value={formData.reward_desc || ''}
                      onChange={(e) => setFormData({ ...formData, reward_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Source</label>
                    <select
                      value={formData.source || 'official'}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="official">Official</option>
                      <option value="discord">Discord</option>
                      <option value="reddit">Reddit</option>
                      <option value="twitter">Twitter</option>
                      <option value="user">User Submitted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expires (Optional)</label>
                    <input
                      type="date"
                      value={formData.expires_at ? formData.expires_at.split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              {modalMode === 'view' ? (
                <button
                  onClick={() => handleEdit(selectedCode!)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this code? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
