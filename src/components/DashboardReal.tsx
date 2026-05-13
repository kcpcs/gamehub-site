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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const { overview, recent_activity, top_games } = stats

  const statCards = [
    { label: 'Total Games', value: overview.total_games, change: '+5', icon: FileText, color: 'blue' },
    { label: 'Guides', value: overview.total_articles, change: '+12', icon: FileText, color: 'green' },
    { label: 'Codes', value: overview.total_codes, change: '+8', icon: Gift, color: 'purple' },
    { label: 'Users', value: overview.total_users, change: '+25', icon: Users, color: 'orange' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's your site overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {lastUpdated.toLocaleTimeString('en-US')}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
          }
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                    <ArrowUpRight size={16} />
                    <span>{stat.change}%</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Published Guides</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{overview.published_articles}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Drafts</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{overview.draft_articles}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Active Codes</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{overview.active_codes}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired Codes</span>
          </div>
          <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{overview.expired_codes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
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
