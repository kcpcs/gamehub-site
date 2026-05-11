// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, Plus, Edit2, Trash2, X, Save, AlertCircle, CheckCircle,
  Check, X as XIcon
} from 'lucide-react'

interface AdminRole {
  id: string
  name: string
  description: string | null
  can_manage_users: boolean
  can_manage_games: boolean
  can_manage_articles: boolean
  can_manage_codes: boolean
  can_manage_tierlists: boolean
  can_manage_comments: boolean
  can_view_analytics: boolean
  can_manage_settings: boolean
  can_manage_roles: boolean
  can_manage_ai_players: boolean
  created_at: string
  updated_at: string
}

const permissionLabels: Record<string, string> = {
  can_manage_users: '管理用户',
  can_manage_games: '管理游戏',
  can_manage_articles: '管理文章',
  can_manage_codes: '管理兑换码',
  can_manage_tierlists: '管理排行榜',
  can_manage_comments: '管理评论',
  can_view_analytics: '查看分析',
  can_manage_settings: '管理设置',
  can_manage_roles: '管理角色',
  can_manage_ai_players: '管理AI玩家',
}

export function AdminRoleManagement() {
  const [roles, setRoles] = useState<AdminRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    can_manage_users: false,
    can_manage_games: false,
    can_manage_articles: false,
    can_manage_codes: false,
    can_manage_tierlists: false,
    can_manage_comments: false,
    can_view_analytics: false,
    can_manage_settings: false,
    can_manage_roles: false,
    can_manage_ai_players: false,
  })
  const [operationSuccess, setOperationSuccess] = useState('')

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/roles')
      const result = await response.json()
      if (result.success) {
        setRoles(result.data)
      } else {
        setError(result.error || 'Failed to fetch roles')
      }
    } catch (err) {
      setError('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingRole(null)
    setFormData({
      name: '',
      description: '',
      can_manage_users: false,
      can_manage_games: false,
      can_manage_articles: false,
      can_manage_codes: false,
      can_manage_tierlists: false,
      can_manage_comments: false,
      can_view_analytics: false,
      can_manage_settings: false,
      can_manage_roles: false,
      can_manage_ai_players: false,
    })
    setShowModal(true)
    setOperationSuccess('')
  }

  const handleOpenEditModal = (role: AdminRole) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      can_manage_users: role.can_manage_users,
      can_manage_games: role.can_manage_games,
      can_manage_articles: role.can_manage_articles,
      can_manage_codes: role.can_manage_codes,
      can_manage_tierlists: role.can_manage_tierlists,
      can_manage_comments: role.can_manage_comments,
      can_view_analytics: role.can_view_analytics,
      can_manage_settings: role.can_manage_settings,
      can_manage_roles: role.can_manage_roles,
      can_manage_ai_players: role.can_manage_ai_players,
    })
    setShowModal(true)
    setOperationSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingRole ? `/api/admin/roles/${editingRole.id}` : '/api/admin/roles'
      const method = editingRole ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.success) {
        setOperationSuccess(editingRole ? '更新成功' : '创建成功')
        setTimeout(() => {
          setShowModal(false)
          fetchRoles()
        }, 1000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('操作失败')
    }
  }

  const handleDelete = async (roleId: string) => {
    if (!confirm('确定要删除该角色吗？')) return
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        fetchRoles()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const defaultRoles = ['super_admin_role', 'admin_role', 'moderator_role', 'editor_role']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error && !roles.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchRoles}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">角色权限管理</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">管理管理员角色和权限</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
          创建角色
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                    {role.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(role)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!defaultRoles.includes(role.id) && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                权限
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 text-sm ${
                      role[key as keyof AdminRole] ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {role[key as keyof AdminRole] ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <XIcon className="w-4 h-4 text-gray-300" />
                    )}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>创建于 {formatDate(role.created_at)}</span>
                {defaultRoles.includes(role.id) && (
                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full">默认角色</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingRole ? '编辑角色' : '创建角色'}
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  角色名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  权限设置
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        formData[key as keyof typeof formData]
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
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
                  {editingRole ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}