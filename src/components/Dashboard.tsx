import { useState } from 'react'
import { TrendingUp, Users, FileText, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { label: '总用户数', value: 12580, change: '+12.5%', positive: true, icon: Users },
  { label: '攻略文章', value: 289, change: '+8.3%', positive: true, icon: FileText },
  { label: '兑换码', value: 156, change: '+5.2%', positive: true, icon: Gift },
  { label: '今日访问', value: 3420, change: '-2.1%', positive: false, icon: TrendingUp },
]

const recentActivity = [
  { id: 1, type: '攻略', title: '原神新手入门指南', author: '玩家小明', time: '5分钟前', status: 'published' },
  { id: 2, type: '评论', title: '感谢分享！', author: '游戏达人', time: '12分钟前', status: 'approved' },
  { id: 3, type: '兑换码', title: 'GENSHINGIFT', author: '管理员', time: '30分钟前', status: 'active' },
  { id: 4, type: '攻略', title: '艾尔登法环Boss攻略', author: '硬核玩家', time: '1小时前', status: 'pending' },
  { id: 5, type: '用户', title: '新用户注册', author: '新用户123', time: '2小时前', status: 'registered' },
]

const topGames = [
  { rank: 1, name: '原神', guides: 156, visits: 125800, trend: '+15%' },
  { rank: 2, name: '艾尔登法环', guides: 89, visits: 89500, trend: '+8%' },
  { rank: 3, name: 'Valorant', guides: 67, visits: 76200, trend: '+12%' },
  { rank: 4, name: '塞尔达传说', guides: 54, visits: 65800, trend: '-3%' },
  { rank: 5, name: '博德之门3', guides: 43, visits: 45200, trend: '+25%' },
]

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('7days')

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近活动</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                查看全部
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.type === '攻略' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                      activity.type === '评论' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                      activity.type === '兑换码' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
                      'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {activity.type}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.author} · {activity.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'published' || activity.status === 'approved' || activity.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                      : activity.status === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {activity.status === 'published' ? '已发布' :
                     activity.status === 'approved' ? '已审核' :
                     activity.status === 'active' ? '有效' :
                     activity.status === 'pending' ? '待审核' : '已注册'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Games */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">热门游戏排行</h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5"
              >
                <option value="7days">近7天</option>
                <option value="30days">近30天</option>
                <option value="90days">近90天</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {topGames.map((game) => (
              <div key={game.rank} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    game.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    game.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    game.rank === 3 ? 'bg-amber-600 text-amber-100' :
                    'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {game.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{game.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{game.guides} 篇攻略</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{(game.visits / 1000).toFixed(1)}k</p>
                    <p className={`text-xs ${game.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {game.trend}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
