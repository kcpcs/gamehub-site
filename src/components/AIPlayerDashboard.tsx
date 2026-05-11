'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, Users, MessageSquare, ThumbsUp, Clock, Play, 
  Pause, TrendingUp, AlertCircle, CheckCircle, BarChart3
} from 'lucide-react'

interface StatsData {
  total_active: number
  total_posts: number
  total_comments: number
  total_activities: number
  status_distribution: Array<{ status: string; count: number }>
}

interface ActivityLog {
  id: string
  player_id: string
  activity_type: string
  target_type: string
  target_id: string
  content: string | null
  created_at: string
  player?: {
    username: string
  }
}

export function AIPlayerDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<number>(5000)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchData()
    
    let interval: ReturnType<typeof setInterval>
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('/api/admin/ai-players/stats'),
        fetch('/api/admin/ai-players/activity-logs'),
      ])
      
      const statsData = await statsRes.json()
      const logsData = await logsRes.json()
      
      if (statsData.success) setStats(statsData.data)
      if (logsData.success) setLogs(logsData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
    setLoading(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <Activity className="w-4 h-4 text-blue-500" />
      case 'comment': return <MessageSquare className="w-4 h-4 text-green-500" />
      case 'reply': return <MessageSquare className="w-4 h-4 text-teal-500" />
      case 'like': return <ThumbsUp className="w-4 h-4 text-red-500" />
      case 'view': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'post': return '发布帖子'
      case 'comment': return '发表评论'
      case 'reply': return '回复评论'
      case 'like': return '点赞'
      case 'view': return '浏览内容'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">AI玩家监控</h3>
          <p className="text-sm text-gray-500">实时监控AI玩家活动状态</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            刷新
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {autoRefresh ? <Play size={14} /> : <Pause size={14} />}
            {autoRefresh ? '自动刷新' : '暂停刷新'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">活跃AI玩家</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总发帖数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_posts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总评论数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_comments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总活动数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_activities || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">状态分布</h4>
          </div>
          <div className="p-4">
            {stats?.status_distribution && stats.status_distribution.length > 0 ? (
              <div className="space-y-3">
                {stats.status_distribution.map((item) => {
                  const total = stats.status_distribution.reduce((sum, s) => sum + s.count, 0)
                  const percentage = total > 0 ? (item.count / total) * 100 : 0
                  const getColor = () => {
                    switch (item.status) {
                      case 'active': return 'bg-green-500'
                      case 'inactive': return 'bg-gray-400'
                      case 'paused': return 'bg-yellow-500'
                      default: return 'bg-gray-300'
                    }
                  }
                  const getLabel = () => {
                    switch (item.status) {
                      case 'active': return '运行中'
                      case 'inactive': return '已停止'
                      case 'paused': return '已暂停'
                      default: return item.status
                    }
                  }
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{getLabel()}</span>
                        <span className="text-gray-900 font-medium">{item.count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getColor()} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无数据
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">最近活动</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {logs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {logs.slice(0, 20).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getActivityIcon(log.activity_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{log.player?.username || '未知'}</span>
                          {' '}{getActivityLabel(log.activity_type)}
                        </p>
                        {log.content && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {log.content}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无活动记录
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
