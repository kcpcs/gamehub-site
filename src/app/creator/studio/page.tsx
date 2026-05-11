'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, FileText, BarChart3, Settings, LogOut, Plus, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Sun, Moon, Mail, Save, User, Link2, AlertCircle, CheckCircle2, Download } from 'lucide-react'

interface Article {
  id: string
  title: string
  game_slug: string
  status: 'published' | 'draft' | 'pending'
  views: number
  likes: number
  comments: number
  created_at: string
  updated_at: string
}

interface CreatorStats {
  totalViews: number
  totalLikes: number
  totalArticles: number
  totalEarnings: number
  viewsTrend: number[]
  articlesByGame: { name: string; count: number; color: string }[]
}

interface Preferences {
  emailNotifications: boolean
  darkMode: boolean
  autoSaveDrafts: boolean
}

interface Profile {
  displayName: string
  bio: string
  twitterUrl: string
}

const mockStats: CreatorStats = {
  totalViews: 12847,
  totalLikes: 3420,
  totalArticles: 23,
  totalEarnings: 1250.75,
  viewsTrend: [1200, 1450, 980, 2100, 1850, 2400, 1900],
  articlesByGame: [
    { name: 'Genshin', count: 8, color: '#6366f1' },
    { name: 'Valorant', count: 6, color: '#22c55e' },
    { name: 'LoL', count: 5, color: '#f59e0b' },
    { name: 'Apex', count: 4, color: '#ec4899' }
  ]
}

const mockArticles: Article[] = [
  { id: '1', title: 'Genshin Impact 4.0 Complete Guide', game_slug: 'genshin-impact', status: 'published', views: 3240, likes: 456, comments: 32, created_at: '2024-01-15', updated_at: '2024-01-18' },
  { id: '2', title: 'Valorant Best Agents for Ranked', game_slug: 'valorant', status: 'published', views: 2150, likes: 289, comments: 24, created_at: '2024-01-12', updated_at: '2024-01-14' },
  { id: '3', title: 'LoL Season 14 Tier List', game_slug: 'league-of-legends', status: 'pending', views: 0, likes: 0, comments: 0, created_at: '2024-01-17', updated_at: '2024-01-17' },
  { id: '4', title: 'Apex Legends Best Weapons 2024', game_slug: 'apex-legends', status: 'draft', views: 0, likes: 0, comments: 0, created_at: '2024-01-16', updated_at: '2024-01-16' },
  { id: '5', title: 'Honkai Star Rail Character Guide', game_slug: 'honkai-star-rail', status: 'published', views: 1890, likes: 312, comments: 18, created_at: '2024-01-10', updated_at: '2024-01-11' },
  { id: '6', title: 'Fortnite Best Landing Spots', game_slug: 'fortnite', status: 'published', views: 1560, likes: 234, comments: 15, created_at: '2024-01-08', updated_at: '2024-01-09' }
]

type TabType = 'dashboard' | 'articles' | 'create' | 'settings'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

function Switch({ enabled, onChange, disabled = false }: SwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] focus:ring-[var(--accent)] ${
        enabled 
          ? 'bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30' 
          : 'bg-[var(--bg-raised)] border border-[var(--border)]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
          enabled ? 'left-7' : 'left-1'
        }`}
      >
        {enabled && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
      </span>
    </button>
  )
}

interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  onClose: () => void
}

function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', icon: CheckCircle2 },
    error: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', icon: AlertCircle },
    info: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', icon: AlertCircle }
  }

  const { bg, border, text, icon: Icon } = colors[type]

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${bg} ${border} shadow-xl animate-slide-up`}>
      <Icon className={`w-5 h-5 ${text}`} />
      <span className={`text-sm font-medium ${text}`}>{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <XCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </button>
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default function CreatorStudioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [profile, setProfile] = useState<Profile>({
    displayName: 'GamingPro',
    bio: 'Professional gamer and content creator. Let\'s level up together!',
    twitterUrl: ''
  })
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    darkMode: true,
    autoSaveDrafts: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const navItems = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'articles' as const, icon: FileText, label: 'Articles' },
    { id: 'create' as const, icon: Plus, label: 'Create' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ]

  const getStatusIcon = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
      case 'draft':
        return <Clock className="w-4 h-4" style={{ color: 'var(--warning)' }} />
      case 'pending':
        return <XCircle className="w-4 h-4" style={{ color: 'var(--info)' }} />
    }
  }

  const getStatusText = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return 'Published'
      case 'draft':
        return 'Draft'
      case 'pending':
        return 'Pending Review'
    }
  }

  const handlePreferenceChange = (key: keyof Preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleProfileChange = (key: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setToast({ type: 'success', message: 'Settings saved successfully!' })
      setHasChanges(false)
    } catch {
      setToast({ type: 'error', message: 'Failed to save settings. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (activeTab === 'create') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-sm hover:underline transition-colors"
            style={{ color: 'var(--accent-light)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Create New Article
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-8">
          Create and publish guides, tier lists, and more
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          <div className="space-y-2">
            {navItems.slice(0, -1).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30' 
                    : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <div className="border-t mt-4 pt-4">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-all">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-2xl p-8 border border-[var(--border)]">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  placeholder="Enter article title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Game
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all">
                  <option>Select a game...</option>
                  <option>genshin-impact</option>
                  <option>valorant</option>
                  <option>league-of-legends</option>
                  <option>apex-legends</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Content
              </label>
              <textarea
                rows={12}
                className="w-full px-4 py-4 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none font-mono text-sm transition-all"
                placeholder="# Article Title&#10;&#10;Write your content here..."
              />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl font-medium bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-raised)] transition-all">
                <span className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Save Draft
                </span>
              </button>
              <button className="flex-1 py-3 rounded-xl font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/30">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr]">
        <div className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-70 border-r border-[var(--border)] bg-[var(--bg-base)]">
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Creator Studio
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Welcome back, Creator
                </p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30' 
                    : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-all group">
              <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className="lg:ml-70 p-8">
          {activeTab === 'dashboard' && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Dashboard
                </h1>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Overview of your content performance
                </p>
              </header>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/15">
                      <Eye className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/15 text-green-400">
                      +23%
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Total Views</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {mockStats.totalViews.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-pink-500/15">
                      <BarChart3 className="w-5 h-5 text-pink-400" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/15 text-green-400">
                      +18%
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Likes</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {mockStats.totalLikes.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/15">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/15 text-green-400">
                      +3
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Articles</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {mockStats.totalArticles}
                  </p>
                </div>

                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/15">
                      <Settings className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/15 text-green-400">
                      +12%
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Earnings</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    ${mockStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 className="w-4 h-4" />
                    Views Trend (Last 7 Days)
                  </h3>
                  <div className="flex items-end justify-between gap-2 h-40">
                    {mockStats.viewsTrend.map((views, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-[var(--accent)] to-purple-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group" 
                        style={{ height: `${(views / Math.max(...mockStats.viewsTrend)) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--bg-base)] rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                          {views.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FileText className="w-4 h-4" />
                    Articles by Game
                  </h3>
                  <div className="space-y-4">
                    {mockStats.articlesByGame.map(item => (
                      <div key={item.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {item.count} articles
                          </span>
                        </div>
                        <div className="h-2.5 bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(item.count / mockStats.totalArticles) * 100}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock className="w-4 h-4" />
                    Recent Articles
                  </h3>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {mockArticles.slice(0, 4).map(article => (
                    <div key={article.id} className="px-6 py-4 hover:bg-[var(--bg-overlay)] transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {article.title}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {article.game_slug} • {article.views.toLocaleString()} views
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {article.status === 'published' && (
                            <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                              <BarChart3 className="w-3.5 h-3.5" />
                              {article.likes}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: article.status === 'published' ? 'rgba(34, 197, 94, 0.1)' : article.status === 'draft' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                            {getStatusIcon(article.status)}
                            <span style={{ color: article.status === 'published' ? 'var(--success)' : article.status === 'draft' ? 'var(--warning)' : 'var(--info)' }}>
                              {getStatusText(article.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'articles' && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  My Articles
                </h1>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Manage your published and draft articles
                </p>
              </header>

              <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {['All', 'Published', 'Draft', 'Pending'].map(status => (
                        <button
                          key={status}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            status === 'All'
                              ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30'
                              : 'hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/30"
                    >
                      <Plus className="w-4 h-4" />
                      New Article
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Title
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Game
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Views
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Likes
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Status
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {mockArticles.map(article => (
                        <tr key={article.id} className="hover:bg-[var(--bg-overlay)] transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {article.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {article.game_slug}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {article.views.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {article.likes}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(article.status)}
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {getStatusText(article.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2.5 rounded-xl hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-all group">
                                <Eye className="w-4 h-4 group-hover:text-[var(--accent)]" />
                              </button>
                              <button className="p-2.5 rounded-xl hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] transition-all group">
                                <Edit className="w-4 h-4 group-hover:text-[var(--accent)]" />
                              </button>
                              <button className="p-2.5 rounded-xl hover:bg-red-500/20 text-[var(--text-secondary)] transition-all group">
                                <Trash2 className="w-4 h-4 group-hover:text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Settings
                </h1>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Configure your creator profile and preferences
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Profile
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profile.displayName}
                          onChange={(e) => handleProfileChange('displayName', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                          Social Links
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[var(--bg-raised)]">
                              <Link2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <input
                              type="text"
                              value={profile.twitterUrl}
                              onChange={(e) => handleProfileChange('twitterUrl', e.target.value)}
                              placeholder="Twitter URL..."
                              className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Preferences
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-overlay)]">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-green-500/15">
                            <Mail className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Email Notifications</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive updates about your articles</p>
                          </div>
                        </div>
                        <Switch
                          enabled={preferences.emailNotifications}
                          onChange={(val) => handlePreferenceChange('emailNotifications', val)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-overlay)]">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-purple-500/15">
                            {preferences.darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Use dark theme for the studio</p>
                          </div>
                        </div>
                        <Switch
                          enabled={preferences.darkMode}
                          onChange={(val) => handlePreferenceChange('darkMode', val)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-overlay)]">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-orange-500/15">
                            <Save className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Auto-save Drafts</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Automatically save your work every 30 seconds</p>
                          </div>
                        </div>
                        <Switch
                          enabled={preferences.autoSaveDrafts}
                          onChange={(val) => handlePreferenceChange('autoSaveDrafts', val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] sticky top-8">
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                          hasChanges && !isSaving
                            ? 'bg-[var(--accent)] text-white hover:opacity-90 shadow-lg shadow-[var(--accent)]/30'
                            : 'bg-[var(--bg-overlay)] text-[var(--text-muted)] cursor-not-allowed'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      {hasChanges && (
                        <button
                          onClick={() => {
                            setProfile({ displayName: 'GamingPro', bio: 'Professional gamer and content creator. Let\'s level up together!', twitterUrl: '' })
                            setPreferences({ emailNotifications: true, darkMode: true, autoSaveDrafts: false })
                            setHasChanges(false)
                          }}
                          className="w-full py-3 rounded-xl font-medium bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] transition-all"
                        >
                          Discard Changes
                        </button>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Your settings are automatically synced across all devices. Changes take effect immediately after saving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}