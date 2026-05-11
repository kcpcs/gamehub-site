// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Shield, Zap, Mail, Key, Loader2, AlertCircle, CheckCircle, Link } from 'lucide-react'

interface SiteSettings {
  siteName: string
  tagline: string
  defaultLanguage: string
  seo: {
    defaultTitle: string
    defaultDescription: string
    defaultKeywords: string[]
  }
  socialLinks: {
    twitter: string
    discord: string
    youtube: string
    reddit: string
  }
  features: {
    aiPlayersEnabled: boolean
    commentsEnabled: boolean
    codeSubmissionEnabled: boolean
  }
  smtp: {
    host: string
    port: number
    user: string
    configured: boolean
  }
  apiKeys: {
    igdbConfigured: boolean
    steamConfigured: boolean
    openaiConfigured: boolean
  }
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('general')

  // Keywords as comma-separated string for editing
  const [keywordsInput, setKeywordsInput] = useState('')

  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to fetch settings')
      setSettings(data.data)
      setKeywordsInput((data.data.seo?.defaultKeywords || []).join(', '))
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setSaveMessage(null)
    try {
      const payload = {
        ...settings,
        seo: {
          ...settings.seo,
          defaultKeywords: keywordsInput.split(',').map(k => k.trim()).filter(Boolean),
        },
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save')

      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setSaveMessage(null), 4000)
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (path: string, value: any) => {
    setSettings(prev => {
      if (!prev) return prev
      const parts = path.split('.')
      const result = { ...prev }
      let current: any = result

      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] }
        current = current[parts[i]]
      }

      current[parts[parts.length - 1]] = value
      return result
    })
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'social', label: 'Social Links', icon: Link },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'smtp', label: 'SMTP / Email', icon: Mail },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading settings...</span>
      </div>
    )
  }

  if (error && !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="text-red-500" size={48} />
        <p className="text-lg font-medium text-gray-900 dark:text-white">Failed to load settings</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Language</label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) => updateField('defaultLanguage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Defaults</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Title Tag</label>
                  <input
                    type="text"
                    value={settings.seo.defaultTitle}
                    onChange={(e) => updateField('seo.defaultTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{settings.seo.defaultTitle.length}/60 characters recommended</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Meta Description</label>
                  <textarea
                    value={settings.seo.defaultDescription}
                    onChange={(e) => updateField('seo.defaultDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{settings.seo.defaultDescription.length}/160 characters recommended</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="gaming, guides, tier lists..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter / X</label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => updateField('socialLinks.twitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discord</label>
                  <input
                    type="url"
                    value={settings.socialLinks.discord}
                    onChange={(e) => updateField('socialLinks.discord', e.target.value)}
                    placeholder="https://discord.gg/invite-code"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YouTube</label>
                  <input
                    type="url"
                    value={settings.socialLinks.youtube}
                    onChange={(e) => updateField('socialLinks.youtube', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reddit</label>
                  <input
                    type="url"
                    value={settings.socialLinks.reddit}
                    onChange={(e) => updateField('socialLinks.reddit', e.target.value)}
                    placeholder="https://reddit.com/r/yoursubreddit"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feature Toggles */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Toggles</h3>
              <div className="space-y-4">
                {[
                  {
                    key: 'aiPlayersEnabled',
                    label: 'AI Players',
                    description: 'Enable AI-simulated player activity (comments, likes, community engagement)',
                  },
                  {
                    key: 'commentsEnabled',
                    label: 'Comments System',
                    description: 'Allow users to post comments on articles and guides',
                  },
                  {
                    key: 'codeSubmissionEnabled',
                    label: 'Code Submission',
                    description: 'Allow users to submit game redemption codes',
                  },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                    <button
                      onClick={() => updateField(`features.${feature.key}`, !settings.features[feature.key])}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.features[feature.key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.features[feature.key] ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SMTP Settings */}
          {activeTab === 'smtp' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMTP / Email Configuration</h3>

              <div className={`p-4 rounded-lg border ${
                settings.smtp.configured
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <div className="flex items-center gap-2">
                  {settings.smtp.configured ? (
                    <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    settings.smtp.configured ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {settings.smtp.configured ? 'SMTP is configured' : 'SMTP is not configured - email notifications will not work'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtp.host}
                    onChange={(e) => updateField('smtp.host', e.target.value)}
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={settings.smtp.port}
                    onChange={(e) => updateField('smtp.port', parseInt(e.target.value) || 587)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP User / Email</label>
                  <input
                    type="text"
                    value={settings.smtp.user}
                    onChange={(e) => updateField('smtp.user', e.target.value)}
                    placeholder="noreply@example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: SMTP password should be configured via the SMTP_PASSWORD environment variable for security.
              </p>
            </div>
          )}

          {/* API Keys Status */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Key Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                API keys are configured via environment variables. This panel shows their current status.
              </p>
              <div className="space-y-3">
                {[
                  { key: 'igdbConfigured', label: 'IGDB API', description: 'Used for fetching game metadata', envVars: 'IGDB_CLIENT_ID, IGDB_CLIENT_SECRET' },
                  { key: 'steamConfigured', label: 'Steam Web API', description: 'Used for Steam game data and reviews', envVars: 'STEAM_API_KEY' },
                  { key: 'openaiConfigured', label: 'OpenAI API', description: 'Used for AI content generation and AI players', envVars: 'OPENAI_API_KEY' },
                ].map((api) => (
                  <div key={api.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{api.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{api.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Env: {api.envVars}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                      settings.apiKeys[api.key]
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                    }`}>
                      {settings.apiKeys[api.key] ? (
                        <>
                          <CheckCircle size={12} />
                          Configured
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          Not Set
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-4">
          {saveMessage && (
            <span className={`flex items-center gap-1 text-sm ${
              saveMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {saveMessage.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
