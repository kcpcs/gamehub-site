'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Download, Trash2, Plus, AlertCircle, Check, Clock, HardDrive, Database } from 'lucide-react'

interface BackupFile {
  id: string
  filename: string
  size: number
  created_at: string
  type: 'full' | 'incremental'
  status: 'completed' | 'failed' | 'in_progress'
  metadata?: {
    total_games?: number
    total_articles?: number
    total_codes?: number
    total_users?: number
    total_tier_lists?: number
    total_comments?: number
  }
}

export function BackupManagement() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchBackups = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/backup?action=list')
      const result = await response.json()
      
      if (result.success) {
        setBackups(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch backups')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const handleCreateBackup = async () => {
    try {
      setCreating(true)
      setError(null)
      setSuccess(null)
      
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSuccess('备份创建成功')
        fetchBackups()
      } else {
        throw new Error(result.error || 'Failed to create backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create backup')
    } finally {
      setCreating(false)
    }
  }

  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/backup?action=download&filename=${filename}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess('下载成功')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    }
  }

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/backup?filename=${filename}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        setDeleteConfirm(null)
        setSuccess('备份删除成功')
        fetchBackups()
      } else {
        throw new Error(result.error || 'Failed to delete backup')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete backup')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">备份管理</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            数据库完整备份与恢复
          </p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus size={18} />}
          创建备份
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-green-600 dark:text-green-400">{success}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Backup List */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Database className="text-blue-500" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">备份列表</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">共 {backups.length} 个备份</p>
              </div>
            </div>
          </div>

          {backups.length === 0 ? (
            <div className="p-8 text-center">
              <HardDrive className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">暂无备份记录</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">点击上方按钮创建第一个备份</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <div key={backup.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Database className="text-gray-500 dark:text-gray-400" size={24} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{backup.filename}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(backup.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive size={14} />
                            {formatSize(backup.size)}
                          </span>
                        </div>
                        {backup.metadata && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {backup.metadata.total_games !== undefined && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded">
                                游戏: {backup.metadata.total_games}
                              </span>
                            )}
                            {backup.metadata.total_articles !== undefined && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded">
                                文章: {backup.metadata.total_articles}
                              </span>
                            )}
                            {backup.metadata.total_codes !== undefined && (
                              <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded">
                                兑换码: {backup.metadata.total_codes}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(backup.filename)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        title="下载"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(backup.filename)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">备份说明</h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• 备份包含所有游戏、文章、兑换码、用户等核心数据</li>
          <li>• 建议定期创建备份，以防数据丢失</li>
          <li>• 下载的备份文件可在紧急情况下用于数据恢复</li>
          <li>• 备份文件存储在服务器本地，请及时下载保存</li>
        </ul>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">确认删除</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除这个备份吗？此操作不可撤销。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
