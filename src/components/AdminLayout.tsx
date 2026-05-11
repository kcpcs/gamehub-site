'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, Users, Gamepad2, FileText, Gift, BarChart3, 
  MessageSquare, TrendingUp, Settings, LogOut, Menu, X, Shield
} from 'lucide-react'
import { DashboardReal } from './DashboardReal'
import { UserManagement } from './UserManagement'
import { GameManagement } from './GameManagement'
import { GuideManagement } from './GuideManagement'
import { CodeManagement } from './CodeManagement'
import { TierListManagement } from './TierListManagement'
import { CommentManagement } from './CommentManagement'
import { Analytics } from './Analytics'
import { SystemSettings } from './SystemSettings'

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, component: DashboardReal, description: '数据概览与统计' },
  { id: 'users', label: '用户管理', icon: Users, component: UserManagement, description: '用户CRUD与角色管理' },
  { id: 'games', label: '游戏管理', icon: Gamepad2, component: GameManagement, description: '游戏数据维护' },
  { id: 'guides', label: '攻略管理', icon: FileText, component: GuideManagement, description: '文章内容管理' },
  { id: 'codes', label: '兑换码管理', icon: Gift, component: CodeManagement, description: '兑换码维护' },
  { id: 'tierlists', label: '排行榜管理', icon: BarChart3, component: TierListManagement, description: 'Tier List管理' },
  { id: 'comments', label: '评论管理', icon: MessageSquare, component: CommentManagement, description: '评论审核' },
  { id: 'analytics', label: '数据分析', icon: TrendingUp, component: Analytics, description: '运营数据分析' },
  { id: 'settings', label: '系统设置', icon: Settings, component: SystemSettings, description: '网站配置' },
]

export function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || DashboardReal
  const activeItem = navItems.find(item => item.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">GameHub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">管理后台</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Header */}
      <header className="fixed top-0 right-0 left-64 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeItem?.label}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activeItem?.description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              管理员
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="搜索..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="text-white" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-16 p-8">
        <ActiveComponent />
      </main>
    </div>
  )
}
