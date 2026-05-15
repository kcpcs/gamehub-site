'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, TrendingDown, Users, FileText, Gift, Eye,
  RefreshCw, AlertCircle, Download, Calendar, BarChart3,
  PieChart as PieChartIcon, Activity, Layers, Target,
  AlertTriangle, Zap, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface StatsData {
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
  recent_activity: { articles: any[]; codes: any[] }
  top_games: any[]
}

interface BehaviorStats {
  totalViews: number
  uniquePaths: number
  uniqueSessions: number
  avgDuration: number
  topPaths: Array<{ path: string; views: number }>
  hourlyBreakdown: Array<{ hour: string; views: number }>
}

interface SegmentItem {
  segment_name: string
  user_count: number
  percentage: number
  description: string
  avg_score: number
}

interface FunnelStep {
  name: string
  count: number
  percentage: number
  dropoff: number
  dropoff_rate: number
}

interface RetentionData {
  cohorts: Array<{ week: string; users: number; retention: number[] }>
  overallRetention: number[]
}

interface TrendPointData {
  date: string
  value: number
  predicted?: number
  is_anomaly?: boolean
  anomaly_score?: number
}

interface TrendResultData {
  metric: string
  data: TrendPointData[]
  trend_direction: 'up' | 'down' | 'stable'
  trend_slope: number
  anomalies: Array<{ date: string; value: number; score: number }>
  prediction_confidence: number
  next_day_prediction: number | null
  next_week_prediction: number | null
}

type TabType = 'overview' | 'behavior' | 'segments' | 'funnels' | 'trends'

const TABS: Array<{ key: TabType; label: string; icon: any }> = [
  { key: 'overview', label: '概览', icon: BarChart3 },
  { key: 'behavior', label: '行为分析', icon: Activity },
  { key: 'segments', label: '用户分群', icon: Layers },
  { key: 'funnels', label: '漏斗分析', icon: Target },
  { key: 'trends', label: '趋势预测', icon: Zap },
]

const SEGMENT_TYPES = [
  { key: 'activity', label: '活跃度' },
  { key: 'engagement', label: '参与度' },
  { key: 'preference', label: '偏好' },
  { key: 'retention', label: '留存' },
]

const FUNNEL_OPTIONS = [
  { value: 'visit_to_register', label: '访问→注册' },
  { value: 'content_engagement', label: '内容互动' },
  { value: 'game_exploration', label: '游戏探索' },
]

const TREND_METRICS = [
  { value: 'page_views', label: '页面浏览' },
  { value: 'article_creation', label: '文章创作' },
  { value: 'user_registration', label: '用户注册' },
]

export function AnalyticsEnhanced() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [timeRange, setTimeRange] = useState('7days')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [behaviorData, setBehaviorData] = useState<BehaviorStats | null>(null)
  const [segmentData, setSegmentData] = useState<Record<string, SegmentItem[]>>({})
  const [segmentType, setSegmentType] = useState('activity')
  const [funnelName, setFunnelName] = useState('visit_to_register')
  const [funnelData, setFunnelData] = useState<{ steps: FunnelStep[]; conversion_rate: number } | null>(null)
  const [trendMetric, setTrendMetric] = useState('page_views')
  const [trendData, setTrendData] = useState<TrendResultData | null>(null)
  const [retentionData, setRetentionData] = useState<RetentionData | null>(null)

  const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90

  const fetchWithError = useCallback(async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Failed to load')
    return data.data
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const load = async () => {
      try {
        if (activeTab === 'overview') {
          const data = await fetchWithError(`/api/admin/dashboard?days=${days}`)
          if (cancelled) return
          setStatsData({
            overview: {
              total_games: data.total_games ?? data.overview?.total_games ?? 0,
              total_articles: data.total_articles ?? data.overview?.total_articles ?? 0,
              total_codes: data.total_codes ?? data.overview?.total_codes ?? 0,
              total_users: data.total_users ?? data.overview?.total_users ?? 0,
              published_articles: data.published_articles ?? data.overview?.published_articles ?? 0,
              active_codes: data.active_codes ?? data.overview?.active_codes ?? 0,
              draft_articles: (data.total_articles ?? data.overview?.total_articles ?? 0) - (data.published_articles ?? data.overview?.published_articles ?? 0),
              expired_codes: (data.total_codes ?? data.overview?.total_codes ?? 0) - (data.active_codes ?? data.overview?.active_codes ?? 0),
            },
            recent_activity: data.recent_activity ?? { articles: [], codes: [] },
            top_games: data.top_games ?? [],
          })
        } else if (activeTab === 'behavior') {
          const data = await fetchWithError(`/api/admin/analytics/behavior?days=${days}`)
          if (cancelled) return
          setBehaviorData({
            totalViews: data.totalViews ?? 0,
            uniquePaths: data.uniquePaths ?? 0,
            uniqueSessions: data.uniqueSessions ?? 0,
            avgDuration: data.avgDuration ?? 0,
            topPaths: data.topPaths ?? [],
            hourlyBreakdown: data.hourlyBreakdown ?? [],
          })
        } else if (activeTab === 'segments') {
          if (segmentType === 'retention') {
            const data = await fetchWithError(`/api/admin/analytics/segments?type=retention&days=${days}`)
            if (cancelled) return
            setRetentionData(data)
          } else {
            const data = await fetchWithError(`/api/admin/analytics/segments?type=${segmentType}&days=${days}`)
            if (cancelled) return
            const all = await fetchWithError(`/api/admin/analytics/segments?days=${days}`)
            if (cancelled) return
            setSegmentData({
              activity: all.activity ?? data,
              engagement: all.engagement ?? [],
              preference: all.preference ?? [],
            })
          }
        } else if (activeTab === 'funnels') {
          const data = await fetchWithError(`/api/admin/analytics/funnels?funnel=${funnelName}&days=${days}`)
          if (cancelled) return
          setFunnelData({
            steps: data.steps ?? data.definition?.steps?.map((s: string) => ({ name: s, count: 0, percentage: 0, dropoff: 0, dropoff_rate: 0 })) ?? [],
            conversion_rate: data.conversion_rate ?? 0,
          })
        } else if (activeTab === 'trends') {
          const data = await fetchWithError(`/api/admin/analytics/trends?metric=${trendMetric}&days=${days}`)
          if (cancelled) return
          setTrendData(data)
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Network error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [activeTab, days, segmentType, funnelName, trendMetric, fetchWithError])

  const handleExport = () => {
    const exportData: any = { timeRange, exportedAt: new Date().toISOString() }
    if (activeTab === 'overview') exportData.statsData = statsData
    if (activeTab === 'behavior') exportData.behaviorData = behaviorData
    if (activeTab === 'segments') { exportData.segmentData = segmentData; exportData.retentionData = retentionData }
    if (activeTab === 'funnels') exportData.funnelData = funnelData
    if (activeTab === 'trends') exportData.trendData = trendData

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${activeTab}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('analytics')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('analytics_desc')}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">{t('last_7_days')}</option>
            <option value="30days">{t('last_30_days')}</option>
            <option value="90days">{t('last_90_days')}</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download size={16} />
            导出数据
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && <OverviewContent statsData={statsData} />}

          {/* ── Behavior Tab ── */}
          {activeTab === 'behavior' && <BehaviorContent data={behaviorData} />}

          {/* ── Segments Tab ── */}
          {activeTab === 'segments' && (
            <SegmentsContent
              data={segmentData}
              retentionData={retentionData}
              segmentType={segmentType}
              onSegmentTypeChange={setSegmentType}
            />
          )}

          {/* ── Funnels Tab ── */}
          {activeTab === 'funnels' && (
            <FunnelsContent
              data={funnelData}
              funnelName={funnelName}
              onFunnelChange={setFunnelName}
            />
          )}

          {/* ── Trends Tab ── */}
          {activeTab === 'trends' && (
            <TrendsContent
              data={trendData}
              trendMetric={trendMetric}
              onMetricChange={setTrendMetric}
            />
          )}
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   Overview Content
   ═══════════════════════════════════════ */
function OverviewContent({ statsData }: { statsData: StatsData | null }) {
  const overview = statsData?.overview
  const stats = overview ? [
    { label: '用户总数', value: overview.total_users || 0, icon: Users, color: 'blue' },
    { label: '攻略总数', value: overview.total_articles || 0, icon: FileText, color: 'green' },
    { label: '兑换码', value: overview.total_codes || 0, icon: Gift, color: 'purple' },
    { label: '已发布攻略', value: overview.published_articles || 0, icon: Eye, color: 'orange' },
  ] : []

  const topGames = statsData?.top_games ?? []

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{item.value.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                <item.icon className={`text-${item.color}-500`} size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">热门游戏排行</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">排名</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">游戏</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">攻略数</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">兑换码</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {topGames.map((game: any, i: number) => (
                <tr key={game.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>{i + 1}</span>
                  </td>
                  <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{game.name}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{game.guide_count ?? 0}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">{game.code_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════
   Behavior Content
   ═══════════════════════════════════════ */
function BehaviorContent({ data }: { data: BehaviorStats | null }) {
  if (!data) return <p className="text-gray-500 text-center py-10">暂无行为数据</p>

  const maxViews = Math.max(...data.topPaths.map(p => p.views), 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="总页面浏览" value={data.totalViews.toLocaleString()} icon={Eye} color="blue" />
        <StatCard label="唯一页面路径" value={data.uniquePaths.toString()} icon={FileText} color="green" />
        <StatCard label="唯一会话数" value={data.uniqueSessions.toLocaleString()} icon={Users} color="purple" />
        <StatCard label="平均时长(s)" value={data.avgDuration.toString()} icon={Activity} color="orange" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">热门页面路径</h3>
        <div className="space-y-3">
          {data.topPaths.slice(0, 15).map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-8">{i + 1}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{p.path}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(p.views / maxViews) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{p.views.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   Segments Content
   ═══════════════════════════════════════ */
function SegmentsContent({
  data, retentionData, segmentType, onSegmentTypeChange,
}: {
  data: Record<string, SegmentItem[]>
  retentionData: RetentionData | null
  segmentType: string
  onSegmentTypeChange: (t: string) => void
}) {
  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {SEGMENT_TYPES.map(st => (
          <button
            key={st.key}
            onClick={() => onSegmentTypeChange(st.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              segmentType === st.key
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {segmentType === 'retention' ? (
        <RetentionView data={retentionData} />
      ) : (
        <SegmentBars segments={data[segmentType] || data['activity'] || []} colors={COLORS} />
      )}
    </div>
  )
}

function SegmentBars({ segments, colors }: { segments: SegmentItem[]; colors: string[] }) {
  if (!segments || segments.length === 0) return <p className="text-gray-500 text-center py-10">暂无分群数据</p>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="space-y-4">
        {segments.map((seg, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{seg.segment_name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {seg.user_count.toLocaleString()} 人 ({seg.percentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${seg.percentage}%`,
                  backgroundColor: colors[i % colors.length],
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{seg.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RetentionView({ data }: { data: RetentionData | null }) {
  if (!data || data.overallRetention.length === 0) return <p className="text-gray-500 text-center py-10">暂无留存数据</p>

  const labels = ['第0周', '第1周', '第2周', '第3周', '第4周']

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">用户留存率</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">同期群</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">用户数</th>
              {labels.map(l => (
                <th key={l} className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.cohorts.slice(0, 8).map((cohort, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{cohort.week}</td>
                <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">{cohort.users}</td>
                {cohort.retention.map((r, j) => (
                  <td key={j} className="py-2 px-3">
                    <span className={`text-sm font-medium ${
                      r >= 50 ? 'text-green-500' : r >= 20 ? 'text-yellow-500' : 'text-red-400'
                    }`}>
                      {r}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   Funnels Content
   ═══════════════════════════════════════ */
function FunnelsContent({
  data, funnelName, onFunnelChange,
}: {
  data: { steps: FunnelStep[]; conversion_rate: number } | null
  funnelName: string
  onFunnelChange: (f: string) => void
}) {
  if (!data || data.steps.length === 0) return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {FUNNEL_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => onFunnelChange(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              funnelName === f.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >{f.label}</button>
        ))}
      </div>
      <p className="text-gray-500 text-center py-10">暂无漏斗数据</p>
    </div>
  )

  const maxCount = Math.max(...data.steps.map(s => s.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {FUNNEL_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => onFunnelChange(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              funnelName === f.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >{f.label}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">转化漏斗</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">总转化率:</span>
            <span className={`text-lg font-bold ${data.conversion_rate >= 5 ? 'text-green-500' : 'text-yellow-500'}`}>
              {data.conversion_rate}%
            </span>
          </div>
        </div>

        <div className="flex items-end justify-center gap-6 h-64">
          {data.steps.map((step, i) => {
            const height = (step.count / maxCount) * 200
            const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{step.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{step.percentage}%</span>
                  {step.dropoff > 0 && (
                    <span className="text-xs text-red-400 mt-1">-{step.dropoff.toLocaleString()}</span>
                  )}
                </div>
                <div
                  className="w-20 rounded-t-lg transition-all duration-500 flex items-end justify-center"
                  style={{
                    height: `${Math.max(height, 16)}px`,
                    backgroundColor: colors[i % colors.length],
                    opacity: 1 - i * 0.1,
                  }}
                >
                  <span className="text-white text-xs font-medium pb-1 whitespace-nowrap">{step.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   Trends Content
   ═══════════════════════════════════════ */
function TrendsContent({
  data, trendMetric, onMetricChange,
}: {
  data: TrendResultData | null
  trendMetric: string
  onMetricChange: (m: string) => void
}) {
  if (!data || data.data.length === 0) return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {TREND_METRICS.map(m => (
          <button
            key={m.value}
            onClick={() => onMetricChange(m.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              trendMetric === m.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >{m.label}</button>
        ))}
      </div>
      <p className="text-gray-500 text-center py-10">暂无趋势数据</p>
    </div>
  )

  const maxValue = Math.max(...data.data.map(d => Math.max(d.value, d.predicted || 0)), 1)
  const DirectionIcon = data.trend_direction === 'up' ? ArrowUp : data.trend_direction === 'down' ? ArrowDown : Minus
  const directionColor = data.trend_direction === 'up' ? 'text-green-500' : data.trend_direction === 'down' ? 'text-red-500' : 'text-gray-400'

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TREND_METRICS.map(m => (
          <button
            key={m.value}
            onClick={() => onMetricChange(m.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              trendMetric === m.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >{m.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">趋势方向</p>
          <div className={`flex items-center gap-2 ${directionColor}`}>
            <DirectionIcon size={24} />
            <span className="text-xl font-bold">
              {data.trend_direction === 'up' ? '上升' : data.trend_direction === 'down' ? '下降' : '平稳'}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">预测置信度</p>
          <p className={`text-xl font-bold ${data.prediction_confidence >= 0.7 ? 'text-green-500' : 'text-yellow-500'}`}>
            {Math.round(data.prediction_confidence * 100)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">异常点数量</p>
          <p className={`text-xl font-bold ${data.anomalies.length > 5 ? 'text-red-500' : 'text-green-500'}`}>
            {data.anomalies.length}
          </p>
        </div>
      </div>

      {data.next_day_prediction !== null && (
        <div className="flex gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">明日预测</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{Math.round(data.next_day_prediction).toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400">下周预测</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(data.next_week_prediction || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">趋势图</h3>
        <div className="h-48 flex items-end gap-1">
          {data.data.map((point, i) => {
            const height = (point.value / maxValue) * 160
            const isAnomaly = point.is_anomaly
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${point.date}: ${point.value}${point.is_anomaly ? ' (异常)' : ''}${point.predicted ? ` 预测: ${point.predicted}` : ''}`}>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isAnomaly ? 'bg-red-500' : 'bg-blue-400'
                    }`}
                    style={{ height: `${Math.max(height, 2)}px` }}
                  />
                </div>
                {i % Math.ceil(data.data.length / 10) === 0 && (
                  <span className="text-[10px] text-gray-400 rotate-45 origin-left whitespace-nowrap">{point.date.slice(5)}</span>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded" />
            <span className="text-xs text-gray-500">正常值</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-xs text-gray-500">异常值</span>
          </div>
        </div>
      </div>

      {data.anomalies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-yellow-500" size={18} />
            <h3 className="font-semibold text-gray-900 dark:text-white">异常检测</h3>
          </div>
          <div className="space-y-2">
            {data.anomalies.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{a.date}</span>
                <span className="text-sm font-medium text-red-500">{a.value.toLocaleString()}</span>
                <span className="text-xs text-gray-400">异常分数: {a.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   Helper Components
   ═══════════════════════════════════════ */
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string; icon: any; color: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
          <Icon className={`text-${color}-500`} size={18} />
        </div>
      </div>
    </div>
  )
}