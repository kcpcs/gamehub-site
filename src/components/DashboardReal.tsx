'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, FileText, Gift, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

interface Stats {
  overview: {
    total_games: number
    total_articles: number
    total_codes: number
    total_users: number
    published_articles: number
    active_codes: number
    draft_articles: number
    expired_codes: number
  }
  recent_activity: {
    articles: Array<{
      id: string
      title: string
      game: string
      status: string
      created_at: string
    }>
    codes: Array<{
      id: string
      code: string
      game: string
      status: string
      created_at: string
    }>
  }
  top_games: Array<{
    rank: number
    id: string
    name: string
    slug: string
    cover_url: string
    guide_count: number
    code_count: number
  }>
}

const statusLabels: Record<string, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' },
  draft: { label: 'Draft', className: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' },
  review: { label: 'In Review', className: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' },
  active: { label: 'Active', className: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' },
  expired: { label: 'Expired', className: 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400' },
  unverified: { label: 'Unverified', className: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' },
}

export function DashboardReal() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [timeRange, setTimeRange] = useState('7')

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/dashboard?days=${timeRange}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <RefreshCw className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">加载中...</p>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const { overview, recent_activity, top_games } = stats

  const statCards = [
    { label: '游戏总数', value: overview.total_games, change: '+5', icon: FileText, color: 'blue' },
    { label: '攻略总数', value: overview.total_articles, change: '+12', icon: FileText, color: 'green' },
    { label: '兑换码总数', value: overview.total_codes, change: '+8', icon: Gift, color: 'purple' },
    { label: '用户总数', value: overview.total_users, change: '+25', icon: Users, color: 'orange' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">仪表板</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            欢迎回来！这是您的网站概览。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
          >
            <option value="7">最近 7 天</option>
            <option value="30">最近 30 天</option>
            <option value="90">最近 90 天</option>
          </select>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
          {lastUpdated && (
            <span className="text-xs text-slate-400 hidden sm:block">
              更新于 {lastUpdated.toLocaleTimeString('zh-CN')}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses: Record<string, string> = {
            blue: 'from-blue-500 to-cyan-500 bg-gradient-to-br text-white shadow-blue-500/25',
            green: 'from-emerald-500 to-teal-500 bg-gradient-to-br text-white shadow-emerald-500/25',
            purple: 'from-purple-500 to-pink-500 bg-gradient-to-br text-white shadow-purple-500/25',
            orange: 'from-orange-500 to-amber-500 bg-gradient-to-br text-white shadow-orange-500/25',
          }
          return (
            <div key={index} className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-slate-800 dark:text-white">{stat.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight size={16} />
                    <span>{stat.change}%</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[stat.color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">已发布攻略</span>
          </div>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{overview.published_articles}</p>
        </div>
        <div className="group bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-2xl p-5 border border-amber-100 dark:border-amber-800/50 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">草稿攻略</span>
          </div>
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{overview.draft_articles}</p>
        </div>
        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-5 border border-green-100 dark:border-green-800/50 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-green-700 dark:text-green-300">有效兑换码</span>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">{overview.active_codes}</p>
        </div>
        <div className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-5 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">过期兑换码</span>
          </div>
          <p className="text-3xl font-bold text-slate-500 dark:text-slate-400">{overview.expired_codes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/30">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">最近活动</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {recent_activity.articles.length === 0 && recent_activity.codes.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No recent activity
              </div>
            ) : (
              <>
                {recent_activity.articles.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusLabels[activity.status]?.className || 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                          {statusLabels[activity.status]?.label || activity.status}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.game} · {formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {recent_activity.codes.map((code) => (
                  <div key={code.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusLabels[code.status]?.className || 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                          {statusLabels[code.status]?.label || code.status}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{code.code}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{code.game} · {formatDate(code.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Top Games */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Games</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {top_games.map((game) => (
              <div key={game.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    game.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    game.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    game.rank === 3 ? 'bg-amber-600 text-amber-100' :
                    'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {game.rank}
                  </span>
                  <img 
                    src={game.cover_url} 
                    alt={game.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{game.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{game.guide_count} guides</p>
                  </div>
                </div>
              </div>
            ))}
            {top_games.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No games found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
