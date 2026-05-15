import { useState } from 'react'
import { TrendingUp, Users, FileText, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export function Dashboard() {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState('7days')

  const stats = [
    { label: t('total_users'), value: 12580, change: '+12.5%', positive: true, icon: Users },
    { label: t('guides'), value: 289, change: '+8.3%', positive: true, icon: FileText },
    { label: t('redeem_codes'), value: 156, change: '+5.2%', positive: true, icon: Gift },
    { label: t('todays_visits'), value: 3420, change: '-2.1%', positive: false, icon: TrendingUp },
  ]

  const recentActivity = [
    { id: 1, type: 'Guide', title: 'Genshin Impact Beginner Guide', author: 'Player Xiao', time: '5 minutes ago', status: 'published' },
    { id: 2, type: 'Comment', title: 'Great guide!', author: 'GameMaster', time: '12 minutes ago', status: 'approved' },
    { id: 3, type: 'Code', title: 'GENSHINGIFT', author: 'Admin', time: '30 minutes ago', status: 'active' },
    { id: 4, type: 'Guide', title: 'Elden Ring Boss Guide', author: 'Hardcore Player', time: '1 hour ago', status: 'pending' },
    { id: 5, type: 'User', title: 'New User Registration', author: 'NewUser123', time: '2 hours ago', status: 'registered' },
  ]

  const topGames = [
    { rank: 1, name: 'Genshin Impact', guides: 156, visits: 125800, trend: '+15%' },
    { rank: 2, name: 'Elden Ring', guides: 89, visits: 89500, trend: '+8%' },
    { rank: 3, name: 'Valorant', guides: 67, visits: 76200, trend: '+12%' },
    { rank: 4, name: 'Zelda: Breath of the Wild', guides: 54, visits: 65800, trend: '-3%' },
    { rank: 5, name: 'Baldur\'s Gate 3', guides: 43, visits: 45200, trend: '+25%' },
  ]

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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recent_activity')}</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                {t('view_all')}
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.type === 'Guide' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                      activity.type === 'Comment' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                      activity.type === 'Code' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
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
                    {activity.status === 'published' ? t('status_published') :
                     activity.status === 'approved' ? t('status_approved') :
                     activity.status === 'active' ? t('status_active') :
                     activity.status === 'pending' ? t('status_pending') : t('status_registered')}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('top_games')}</h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5"
              >
                <option value="7days">{t('last_7_days')}</option>
                <option value="30days">{t('last_30_days')}</option>
                <option value="90days">{t('last_90_days')}</option>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">{game.guides} guides</p>
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
