'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw, AlertCircle, X as XIcon, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { ArticleEditor } from './ArticleEditor'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  article_type: string
  status: 'published' | 'draft' | 'review'
  cover_url?: string
  read_time: number
  view_count: number
  share_count?: number
  game?: {
    id: string
    name: string
    slug: string
  }
  author?: {
    id: string
    username: string
  }
  created_at: string
  published_at?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusLabels: Record<string, { label: string; className: string }> = {
  published: { label: '已发布', className: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' },
  draft: { label: '草稿', className: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' },
  review: { label: '审核中', className: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' },
}

const typeLabels: Record<string, { label: string; className: string }> = {
  guide: { label: '攻略', className: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' },
  tierlist: { label: '排行榜', className: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600' },
  news: { label: '新闻', className: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600' },
  codes: { label: '兑换码', className: 'bg-green-100 dark:bg-green-900/50 text-green-600' },
}

export function GuideManagementReal() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [formData, setFormData] = useState<Partial<Article>>({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchArticles = async (page = 1, search = '', status = 'all', type = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status !== 'all' && { status }),
        ...(type !== 'all' && { type }),
      })
      
      const response = await fetch(`/api/admin/articles?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setArticles(result.data)
        setPagination(result.pagination)
      } else {
        throw new Error(result.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(pagination.page, searchTerm, statusFilter, typeFilter)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArticles(1, searchTerm, statusFilter, typeFilter)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage, searchTerm, statusFilter, typeFilter)
    }
  }

  const handleView = (article: Article) => {
    setSelectedArticle(article)
    setModalMode('view')
    setShowModal(true)
  }

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      article_type: article.article_type,
      status: article.status,
      excerpt: article.excerpt,
    })
    setModalMode('edit')
    setShowModal(true)
  }

  const handleCreate = () => {
    setSelectedArticle(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      article_type: 'guide',
      status: 'draft',
      excerpt: '',
    })
    setModalMode('create')
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const url = modalMode === 'create' 
        ? '/api/admin/articles' 
        : `/api/admin/articles/${selectedArticle?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save article')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setShowModal(false)
        fetchArticles(pagination.page, searchTerm, statusFilter, typeFilter)
      } else {
        throw new Error(result.error || 'Failed to save article')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete article')
      }
      
      setDeleteConfirm(null)
      fetchArticles(pagination.page, searchTerm, statusFilter, typeFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索攻略..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                fetchArticles(1, searchTerm, e.target.value, typeFilter)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="review">审核中</option>
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                fetchArticles(1, searchTerm, statusFilter, e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有类型</option>
              <option value="guide">攻略</option>
              <option value="tierlist">排行榜</option>
              <option value="news">新闻</option>
              <option value="codes">兑换码</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            添加攻略
          </button>
        </form>
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

      {/* Articles Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">游戏</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">阅读</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无文章数据
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.cover_url && (
                          <img src={article.cover_url} alt="" className="w-12 h-8 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{article.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded">
                        {article.game?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${typeLabels[article.article_type]?.className || 'bg-gray-100 dark:bg-gray-600'}`}>
                        {typeLabels[article.article_type]?.label || article.article_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusLabels[article.status]?.className || 'bg-gray-100 dark:bg-gray-600 text-gray-500'}`}>
                        {statusLabels[article.status]?.label || article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {article.view_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleView(article)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="查看">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEdit(article)} className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors" title="编辑">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => setDeleteConfirm(article.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors" title="删除">
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
            显示 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共 {pagination.total} 条
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
              第 {pagination.page} / {pagination.totalPages} 页
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'view' ? '文章详情' : modalMode === 'edit' ? '编辑文章' : '创建文章'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {modalMode === 'view' && selectedArticle ? (
                <div className="space-y-4">
                  {selectedArticle.cover_url && (
                    <img src={selectedArticle.cover_url} alt="" className="w-full h-48 object-cover rounded-lg" />
                  )}
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeLabels[selectedArticle.article_type]?.className || 'bg-gray-100'}`}>
                      {typeLabels[selectedArticle.article_type]?.label}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusLabels[selectedArticle.status]?.className || 'bg-gray-100'}`}>
                      {statusLabels[selectedArticle.status]?.label}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedArticle.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{selectedArticle.game?.name}</span>
                    <span>·</span>
                    <span>{selectedArticle.author?.username}</span>
                    <span>·</span>
                    <span>{formatDate(selectedArticle.published_at || selectedArticle.created_at)}</span>
                    <span>·</span>
                    <span>{selectedArticle.read_time} 分钟阅读</span>
                  </div>
                  {selectedArticle.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-4">
                      {selectedArticle.excerpt}
                    </p>
                  )}
                  {selectedArticle.content && (
                    <div className="prose dark:prose-invert max-w-none mt-6">
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br />') }} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">标题</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">类型</label>
                      <select
                        value={formData.article_type || 'guide'}
                        onChange={(e) => setFormData({ ...formData, article_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="guide">攻略</option>
                        <option value="tierlist">排行榜</option>
                        <option value="news">新闻</option>
                        <option value="codes">兑换码</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">状态</label>
                      <select
                        value={formData.status || 'draft'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">草稿</option>
                        <option value="review">审核中</option>
                        <option value="published">已发布</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">摘要</label>
                    <textarea
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">内容 (Markdown)</label>
                    <ArticleEditor 
                      initialContent={formData.content || ''}
                      onSave={(content) => setFormData({ ...formData, content })}
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
                取消
              </button>
              {modalMode === 'view' ? (
                <button
                  onClick={() => handleEdit(selectedArticle!)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  编辑
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
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
              <h3 className="text-lg font-bold">确认删除</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除这篇文章吗？此操作不可撤销。
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
