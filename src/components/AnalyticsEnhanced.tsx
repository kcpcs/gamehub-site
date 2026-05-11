'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Users, FileText, Gift, Eye, 
  RefreshCw, AlertCircle, Download, Calendar, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'

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
  recent_activity: {
    articles: any[]
    codes: any[]
  }
  top_games: any[]
}

interface ChartData {
  day: string
  visits: number
  guides: number
  codes: number
}

const mockChartData: ChartData[] = [
  { day: '周一', visits: 1200, guides: 15, codes: 8 },
  { day: '周二', visits: 1500, guides: 18, codes: 12 },
  { day: '周三', visits: 1350, guides: 12, codes: 6 },
  { day: '周四', visits: 1800, guides: 22, codes: 15 },
  { day: '周五', visits: 2100, guides: 28, codes: 20 },
  { day: '周六', visits: 2800, guides: 35, codes: 25 },
  { day: '周日', visits: 2500, guides: 30, codes: 18 },
]

const mockPlatformData = [
  { platform: 'PC', percentage: 45, color: '#3b82f6' },
  { platform: '移动端', percentage: 35, color: '#22c55e' },
  { platform: 'PS5', percentage: 12, color: '#a855f7' },
  { platform: 'Xbox', percentage: 5, color: '#f97316' },
  { platform: 'Switch', percentage: 3, color: '#6b7280' },
]

const mockTopArticles = [
  { title: '原神新手入门指南', views: 12580, likes: 342, trend: '+15%', trendUp: true },
  { title: '艾尔登法环Boss攻略', views: 8950, likes: 287, trend: '+8%', trendUp: true },
  { title: 'Valorant角色排行榜', views: 7620, likes: 215, trend: '-3%', trendUp: false },
  { title: '塞尔达传说隐藏神庙', views: 6580, likes: 189, trend: '+12%', trendUp: true },
  { title: '博德之门3职业选择', views: 4520, likes: 156, trend: '+25%', trendUp: true },
]

export function AnalyticsEnhanced() {
  const [timeRange, setTimeRange] = useState('7days')
  const [loading, setLoading] = useState(false)
  const [chartData] = useState<ChartData[]>(mockChartData)
  const [platformData] = useState(mockPlatformData)
  const [topArticles] = useState(mockTopArticles)

  const maxVisits = Math.max(...chartData.map(d => d.visits))
  const maxGuides = Math.max(...chartData.map(d => d.guides))

  const totalVisits = chartData.reduce((sum, d) => sum + d.visits, 0)
  const totalGuides = chartData.reduce((sum, d) => sum + d.guides, 0)
  const totalCodes = chartData.reduce((sum, d) => sum + d.codes, 0)

  const handleExport = () => {
    const data = {
      timeRange,
      chartData,
      platformData,
      topArticles,
      exportedAt: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            全面了解网站运营状况
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">近7天</option>
            <option value="30days">近30天</option>
            <option value="90days">近90天</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download size={18} />
            导出数据
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">总访问量</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalVisits.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Eye className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">攻略发布</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalGuides}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>+18</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FileText className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">兑换码新增</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCodes}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>+104</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Gift className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">活跃用户</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">8,420</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>+5.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Users className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">访问趋势</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">每日访问量与内容发布</p>
            </div>
          </div>
          
          {/* Custom Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {chartData.map((data, index) => {
              const visitHeight = (data.visits / maxVisits) * 100
              const guideHeight = (data.guides / maxGuides) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    <div 
                      className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${visitHeight}%` }}
                      title={`访问: ${data.visits}`}
                    />
                    <div 
                      className="w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-500 hover:from-green-600 hover:to-green-500"
                      style={{ height: `${guideHeight}%` }}
                      title={`攻略: ${data.guides}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{data.day}</span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">访问量</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600 dark:text-gray-400">攻略发布</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <PieChartIcon className="text-purple-500" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">平台分布</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">用户使用设备占比</p>
            </div>
          </div>

          {/* SVG Pie Chart */}
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
              {(() => {
                let currentAngle = 0
                return platformData.map((item, index) => {
                  const angle = (item.percentage / 100) * 360
                  const startAngle = currentAngle
                  const endAngle = currentAngle + angle
                  currentAngle = endAngle
                  
                  const startRad = (startAngle - 90) * Math.PI / 180
                  const endRad = (endAngle - 90) * Math.PI / 180
                  
                  const x1 = 50 + 40 * Math.cos(startRad)
                  const y1 = 50 + 40 * Math.sin(startRad)
                  const x2 = 50 + 40 * Math.cos(endRad)
                  const y2 = 50 + 40 * Math.sin(endRad)
                  
                  const largeArc = angle > 180 ? 1 : 0
                  
                  const pathD = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
                  
                  return (
                    <path
                      key={index}
                      d={pathD}
                      fill={item.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  )
                })
              })()}
              <circle cx="50" cy="50" r="20" fill="var(--bg-surface)" />
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {platformData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.platform}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <FileText className="text-green-500" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">热门文章</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">阅读量最高的攻略内容</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">排名</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">标题</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">浏览</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">点赞</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">趋势</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topArticles.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-amber-100' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{article.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{article.likes.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      article.trendUp ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {article.trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {article.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">生成周报</h4>
          <p className="text-sm text-blue-100 mb-4">自动生成运营周报并发送至邮箱</p>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
            立即生成
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">内容分析</h4>
          <p className="text-sm text-green-100 mb-4">分析热门内容类型和用户偏好</p>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
            开始分析
          </button>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">用户画像</h4>
          <p className="text-sm text-purple-100 mb-4">了解用户群体特征和兴趣分布</p>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
            查看画像
          </button>
        </div>
      </div>
    </div>
  )
}
