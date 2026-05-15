'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Trash2, User, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Comment {
  id: string
  article_slug: string
  author_username: string
  author_avatar: string | null
  content: string
  likes: number
  parent_id: string | null
  created_at: string
  updated_at: string
  article: {
    slug: string
    title: string
  }
  replies: { id: string }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function CommentManagement() {
  const { t } = useLanguage()
  const [comments, setComments] = useState<Comment[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (searchTerm) params.set('search', searchTerm)

      const res = await fetch(`/api/admin/comments?${params}`)
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch comments')
      }

      setComments(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, searchTerm])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput)
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment? All replies will also be removed.')) return

    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setComments(prev => prev.filter(c => c.id !== id))
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} comment(s)?`)) return

    setDeleting(true)
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setSelectedIds(new Set())
      fetchComments()
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setDeleting(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(comments.map(c => c.id)))
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString()
    } catch {
      return dateStr
    }
  }

  if (error && !loading && comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-lg font-medium text-gray-900 dark:text-white">Failed to load comments</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchComments}
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
      {/* Search and Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search comments, authors, articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete Selected ({selectedIds.size})
              </button>
            )}
          </div>
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Total: {pagination.total}</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <span className="ml-3 text-gray-500 dark:text-gray-400">Loading comments...</span>
        </div>
      )}

      {/* Comments List */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Select All Header */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <input
              type="checkbox"
              checked={comments.length > 0 && selectedIds.size === comments.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
            </span>
          </div>

          {/* Comments */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {comments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                <p>No comments found.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                    selectedIds.has(comment.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(comment.id)}
                      onChange={() => toggleSelect(comment.id)}
                      className="w-4 h-4 mt-1 rounded border-gray-300"
                    />

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {comment.author_avatar ? (
                        <img
                          src={comment.author_avatar}
                          alt={comment.author_username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{comment.author_username}</span>
                        {comment.parent_id && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded">
                            Reply
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{comment.content}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <ExternalLink size={12} />
                          <span className="truncate max-w-xs">{comment.article?.title || comment.article_slug}</span>
                        </span>
                        {comment.replies && comment.replies.length > 0 && (
                          <span>{comment.replies.length} replies</span>
                        )}
                        <span>{comment.likes} likes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-1">
                      <button
                        onClick={() => handleDeleteSingle(comment.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
