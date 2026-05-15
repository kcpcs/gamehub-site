'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Plus, Edit2, Trash2, Eye, Search, X, Save, 
  AlertCircle, CheckCircle, Lock, Unlock
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface AdminUser {
  id: string
  email: string
  username: string
  avatar: string | null
  role: string
  last_login_at: string | null
  created_at: string
  updated_at: string
}

const roleLabels: Record<string, { label: string; className: string }> = {
  super_admin: { label: '超级管理员', className: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  admin: { label: '管理员', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  moderator: { label: '版主', className: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  editor: { label: '编辑', className: 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300' },
}

type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'editor'

export function AdminUserManagement() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState<{
    email: string
    username: string
    password: string
    role: AdminRole
  }>({
    email: '',
    username: '',
    password: '',
    role: 'editor',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [operationSuccess, setOperationSuccess] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/admin-users')
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      } else {
        setError(result.error || 'Failed to fetch users')
      }
    } catch {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenCreateModal = () => {
    setEditingUser(null)
    setFormData({ email: '', username: '', password: '', role: 'editor' })
    setShowModal(true)
    setOperationSuccess('')
  }

  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      username: user.username,
      password: '',
      role: user.role as AdminRole,
    })
    setShowModal(true)
    setOperationSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingUser ? `/api/admin/admin-users/${editingUser.id}` : '/api/admin/admin-users'
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser
        ? { ...formData, password: formData.password || undefined }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      if (result.success) {
        setOperationSuccess(editingUser ? '更新成功' : '创建成功')
        setTimeout(() => {
          setShowModal(false)
          fetchUsers()
        }, 1000)
      } else {
        setError(result.error)
      }
    } catch {
      setError('操作失败')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('确定要删除该管理员吗？')) return
    try {
      const response = await fetch(`/api/admin/admin-users/${userId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        fetchUsers()
      } else {
        setError(result.error)
      }
    } catch {
      setError('删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('loading_text')}</p>
        </div>
      </div>
    )
  }

  if (error && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin_user_management')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('admin_user_management_desc')}</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
          {t('create_admin')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search_admin_placeholder')}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('user_info')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('role')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('last_login')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('created_at')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleLabels[user.role]?.className || 'bg-gray-100 text-gray-600'}`}>
                      {roleLabels[user.role]?.label || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.last_login_at || '')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无管理员用户</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingUser ? t('edit_admin') : t('create_admin')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Success Message */}
            {operationSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">{operationSuccess}</span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {editingUser ? '新密码（留空不修改）' : '密码 <span className="text-red-500">*</span>'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    placeholder={editingUser ? '留空保持原密码' : '设置密码'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <Eye size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  角色 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="super_admin">超级管理员</option>
                  <option value="admin">管理员</option>
                  <option value="moderator">版主</option>
                  <option value="editor">编辑</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingUser ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}