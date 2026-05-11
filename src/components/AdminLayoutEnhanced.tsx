// @ts-nocheck
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

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: DashboardReal, description: 'Overview & Statistics' },
  { id: 'users', label: 'Users', icon: Users, component: UserManagementReal, description: 'User Management' },
  { id: 'admin-users', label: 'Admin Users', icon: Users2, component: AdminUserManagement, description: 'Admin User Management' },
  { id: 'roles', label: 'Roles', icon: ShieldCheck, component: AdminRoleManagement, description: 'Role & Permission Management' },
  { id: 'ai-players', label: 'AI Players', icon: Bot, component: AIPlayerManagement, description: 'AI Player Management' },
  { id: 'games', label: 'Games', icon: Gamepad2, component: GameManagementReal, description: 'Game Data Management' },
  { id: 'guides', label: 'Guides', icon: FileText, component: GuideManagementReal, description: 'Guide Content Management' },
  { id: 'codes', label: 'Codes', icon: Gift, component: CodeManagementReal, description: 'Redeem Code Management' },
  { id: 'tierlists', label: 'Tier Lists', icon: BarChart3, component: TierListManagement, description: 'Tier List Management' },
  { id: 'comments', label: 'Comments', icon: MessageSquare, component: CommentManagement, description: 'Comment Moderation' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, component: AnalyticsEnhanced, description: 'Analytics & Reporting' },
  { id: 'backup', label: 'Backup', icon: RefreshCw, component: BackupManagement, description: 'Data Backup & Restore' },
  { id: 'batch', label: 'Batch Ops', icon: FileText, component: BatchOperations, description: 'Import/Export Data' },
  { id: 'settings', label: 'Settings', icon: Settings, component: SystemSettings, description: 'Site Configuration' },
]

export function AdminLayoutEnhanced() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setMobileMenuOpen(false)
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const ActiveComponent = navItems.find(item => item.id === activeTab)?.component || DashboardReal
  const activeItem = navItems.find(item => item.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full z-50 transform transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col
      `}>
        {/* Logo */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Gamepad2 className="text-white" size={24} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Gamepad2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">GameHub</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">管理后台</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
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
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} className={sidebarCollapsed ? '' : ''} />
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
        <div className={`p-2 border-t border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
            ${sidebarCollapsed ? 'justify-center' : ''}
          `}>
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              {/* Breadcrumb */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  {activeItem?.label}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {activeItem?.description}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Quick Search (Desktop) */}
              <div className="hidden md:flex relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="搜索..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Theme Toggle */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Moon size={20} className="text-gray-600 dark:text-gray-300 hidden dark:block" />
                <Sun size={20} className="text-gray-600 dark:text-gray-300 dark:hidden" />
              </button>

              {/* Admin Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">管理员</span>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <ActiveComponent />
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>© 2024 GameHub. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>时区: UTC+8</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
