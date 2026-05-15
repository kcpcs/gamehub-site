'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, Users, Gamepad2, FileText, Gift, BarChart3, 
  MessageSquare, TrendingUp, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Bell, Search, Shield, Moon, Sun, RefreshCw, Bot, ShieldCheck, Users2
} from 'lucide-react'
import { DashboardReal } from './DashboardReal'
import { UserManagementReal } from './UserManagementReal'
import { GameManagementReal } from './GameManagementReal'
import { GuideManagementReal } from './GuideManagementReal'
import { CodeManagementReal } from './CodeManagementReal'
import { TierListManagement } from './TierListManagement'
import { CommentManagement } from './CommentManagement'
import { AnalyticsEnhanced } from './AnalyticsEnhanced'
import { SystemSettings } from './SystemSettings'
import { BackupManagement } from './BackupManagement'
import { BatchOperations } from './BatchOperations'
import { AIPlayerManagement } from './AIPlayerManagement'
import { AdminUserManagement } from './AdminUserManagement'
import { AdminRoleManagement } from './AdminRoleManagement'
import { useLanguage } from '@/lib/language-context'

function BatchOperationsWrapper() {
  return <BatchOperations type="games" />
}

const getNavItems = (t: (key: string) => string) => [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, component: DashboardReal, description: '概览与统计' },
  { id: 'users', label: '用户', icon: Users, component: UserManagementReal, description: '用户管理' },
  { id: 'admin-users', label: '管理员', icon: Users2, component: AdminUserManagement, description: '管理员用户' },
  { id: 'roles', label: '角色', icon: ShieldCheck, component: AdminRoleManagement, description: '角色与权限' },
  { id: 'ai-players', label: 'AI玩家', icon: Bot, component: AIPlayerManagement, description: 'AI用户管理' },
  { id: 'games', label: '游戏', icon: Gamepad2, component: GameManagementReal, description: '游戏数据管理' },
  { id: 'guides', label: '攻略', icon: FileText, component: GuideManagementReal, description: '攻略内容管理' },
  { id: 'codes', label: '兑换码', icon: Gift, component: CodeManagementReal, description: '兑换码管理' },
  { id: 'tierlists', label: '排行榜', icon: BarChart3, component: TierListManagement, description: '排行榜管理' },
  { id: 'comments', label: '评论', icon: MessageSquare, component: CommentManagement, description: '评论审核' },
  { id: 'analytics', label: '数据分析', icon: TrendingUp, component: AnalyticsEnhanced, description: '数据分析' },
  { id: 'backup', label: '备份', icon: RefreshCw, component: BackupManagement, description: '数据备份' },
  { id: 'batch', label: '批量操作', icon: FileText, component: BatchOperationsWrapper, description: '批量操作' },
  { id: 'settings', label: '设置', icon: Settings, component: SystemSettings, description: '系统设置' },
]

export function AdminLayoutEnhanced() {
  const { t } = useLanguage()
  const navItems = getNavItems(t)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // 始终显示侧边栏
      setMobileMenuOpen(true)
      setSidebarCollapsed(false)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || DashboardReal
  const activeItem = navItems.find(item => item.id === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Sidebar - 始终显示 */}
      <aside className={`
        fixed left-0 top-0 h-full z-50 transform transition-all duration-300 ease-in-out
        translate-x-0
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700
        flex flex-col shadow-2xl
      `}>
        {/* Logo */}
        <div className={`p-4 border-b border-slate-700/50 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Gamepad2 className="text-white" size={24} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Gamepad2 className="text-white" size={24} />
              </div>
              <div>
              <h1 className="text-xl font-bold text-white">GameHub</h1>
              <p className="text-xs text-slate-400">管理后台</p>
            </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  if (isMobile) setMobileMenuOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/40 border border-white/10' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent hover:border-slate-600'}
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logout */}
        <div className={`p-3 border-t border-slate-700/50 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button className={`
            w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 border border-transparent hover:border-slate-600
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}>
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium text-sm">退出</span>}
          </button>
        </div>
      </aside>



      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} className="text-slate-600 dark:text-slate-300" />
              </button>
              
              {/* Breadcrumb */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                  {activeItem?.label}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                  {activeItem?.description}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Search (Desktop) */}
              <div className="hidden md:flex relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="搜索..."
                  className="pl-11 pr-4 py-2.5 w-72 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group">
                <Bell size={20} className="text-slate-500 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
              </button>

              {/* Theme Toggle */}
              <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
                <Moon size={20} className="text-slate-500 dark:text-slate-300 hidden dark:block" />
                <Sun size={20} className="text-slate-500 dark:text-slate-300 dark:hidden" />
              </button>

              {/* Admin Badge */}
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                <Shield className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">管理员</span>
              </div>

              {/* User Avatar */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden">
          <ActiveComponent />
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>© 2024 GameHub. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Timezone: UTC+8</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
