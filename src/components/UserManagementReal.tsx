'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Ban, Unlock, Mail, User, RefreshCw, AlertCircle, X as XIcon, ChevronLeft, ChevronRight, Shield, Crown } from 'lucide-react'

interface User {
  id: string
  email: string
  username: string
  avatar?: string
  membership: string
  creator_level: string
  points: number
  article_count: number
  total_views: number
  created_at: string
  updated_at: string
  _count?: {
    articles: number
    tier_votes: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const roleLabels: Record<string, { label: string; className: string; icon: any }> = {
  super_admin: { label: 'Super Admin', className: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400', icon: Crown },
  admin: { label: 'Admin', className: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400', icon: Shield },
  moderator: { label: 'Moderator', className: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400', icon: User },
  editor: { label: 'Editor', className: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400', icon: User },
  creator: { label: 'Creator', className: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400', icon: User },
  user: { label: 'User', className: 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300', icon: User },
}

const membershipLabels: Record<string, { label: string; className: string }> = {
  vip: { label: 'VIP', className: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' },
  premium: { label: 'Premium', className: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' },
  free: { label: 'Free', className: 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300' },
}

export function UserManagementReal() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [formData, setFormData] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [banConfirm, setBanConfirm] = useState<string | null>(null)

  const fetchUsers = async (page = 1, search = '', role = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(role !== 'all' && { role }),
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data)
        setPagination(result.pagination)
      } else {
        throw new Error(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(pagination.page, searchTerm, roleFilter)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchTerm, roleFilter)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, searchTerm, roleFilter)
    }
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      creator_level: user.creator_level,
      membership: user.membership,
    })
    setModalMode('edit')
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [selectedUser?.id],
          action: 'update',
          data: {
            creator_level: formData.creator_level,
            membership: formData.membership,
          },
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setShowModal(false)
        fetchUsers(pagination.page, searchTerm, roleFilter)
      } else {
        throw new Error(result.error || 'Failed to update user')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [id],
          action: 'delete',
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      setDeleteConfirm(null)
      fetchUsers(pagination.page, searchTerm, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleBan = async (id: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [id],
          action: 'ban',
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to ban user')
      }
      
      setBanConfirm(null)
      fetchUsers(pagination.page, searchTerm, roleFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban user')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                fetchUsers(1, searchTerm, e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="editor">Editor</option>
              <option value="creator">Creator</option>
              <option value="user">User</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus size={20} />
            Add User
          </button>
        </div>
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

      {/* Users Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const RoleIcon = roleLabels[user.creator_level]?.icon || User
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user.username?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${roleLabels[user.creator_level]?.className || roleLabels.user.className}`}>
                          <RoleIcon size={12} />
                          {roleLabels[user.creator_level]?.label || 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${membershipLabels[user.membership]?.className || membershipLabels.free.className}`}>
                          {membershipLabels[user.membership]?.label || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {user.points.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {user.article_count || user._count?.articles || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => handleView(user)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="View">
                            <User size={18} />
                          </button>
                          <button onClick={() => handleEdit(user)} className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setBanConfirm(user.id)} className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg transition-colors" title="Ban">
                            <Ban size={18} />
                          </button>
                          <button onClick={() => setDeleteConfirm(user.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
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

      {/* View/Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'view' ? 'User Details' : 'Edit User'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modalMode === 'view' ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        selectedUser.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.username}</h4>
                      <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${roleLabels[selectedUser.creator_level]?.className}`}>
                        {roleLabels[selectedUser.creator_level]?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Membership:</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${membershipLabels[selectedUser.membership]?.className}`}>
                        {membershipLabels[selectedUser.membership]?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Points:</span>
                      <span className="ml-2 font-medium text-yellow-600">{selectedUser.points.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Articles:</span>
                      <span className="ml-2">{selectedUser.article_count || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Views:</span>
                      <span className="ml-2">{selectedUser.total_views?.toLocaleString() || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Joined:</span>
                      <span className="ml-2">{formatDate(selectedUser.created_at)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={formData.creator_level || 'user'}
                      onChange={(e) => setFormData({ ...formData, creator_level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="editor">Editor</option>
                      <option value="creator">Creator</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Membership</label>
                    <select
                      value={formData.membership || 'free'}
                      onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="vip">VIP</option>
                      <option value="premium">Premium</option>
                      <option value="free">Free</option>
                    </select>
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
                  onClick={() => handleEdit(selectedUser)}
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
              Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently deleted.
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

      {/* Ban Confirmation */}
      {banConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-bold">Confirm Ban</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to ban this user? Banned users will not be able to log in or take actions.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBanConfirm(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBan(banConfirm)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
