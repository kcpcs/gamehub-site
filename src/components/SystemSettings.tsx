// @ts-nocheck
import { useState } from 'react'
import { Save, Bell, Globe, Shield, Palette, Database } from 'lucide-react'

const siteSettings = {
  siteName: 'GameHub',
  siteDescription: '终极游戏攻略中心',
  siteLogo: '',
  defaultLanguage: 'en',
  timezone: 'Asia/Shanghai',
}

const notificationSettings = {
  enableEmailNotifications: true,
  enablePushNotifications: true,
  notifyOnNewComment: true,
  notifyOnNewGuide: true,
  notifyOnNewUser: false,
}

const securitySettings = {
  enableTwoFactorAuth: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  enableRateLimiting: true,
}

export function SystemSettings() {
  const [settings, setSettings] = useState({ siteSettings, notificationSettings, securitySettings })
  const [activeTab, setActiveTab] = useState('site')
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = () => {
    setSaveMessage('设置已保存！')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleChange = (section: string, key: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: 'site', label: '网站设置', icon: Globe },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'appearance', label: '外观设置', icon: Palette },
    { id: 'database', label: '数据库', icon: Database },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Site Settings */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">网站基本设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站名称</label>
                  <input
                    type="text"
                    value={settings.siteSettings.siteName}
                    onChange={(e) => handleChange('siteSettings', 'siteName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">网站描述</label>
                  <input
                    type="text"
                    value={settings.siteSettings.siteDescription}
                    onChange={(e) => handleChange('siteSettings', 'siteDescription', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">默认语言</label>
                  <select
                    value={settings.siteSettings.defaultLanguage}
                    onChange={(e) => handleChange('siteSettings', 'defaultLanguage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">时区</label>
                  <select
                    value={settings.siteSettings.timezone}
                    onChange={(e) => handleChange('siteSettings', 'timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">通知设置</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'enableEmailNotifications', label: '启用邮件通知', description: '发送通知邮件给用户' },
                  { key: 'enablePushNotifications', label: '启用推送通知', description: '发送浏览器推送通知' },
                  { key: 'notifyOnNewComment', label: '新评论通知', description: '当有新评论时发送通知' },
                  { key: 'notifyOnNewGuide', label: '新攻略通知', description: '当有新攻略发布时发送通知' },
                  { key: 'notifyOnNewUser', label: '新用户通知', description: '当有新用户注册时发送通知' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleChange('notificationSettings', item.key, !settings.notificationSettings[item.key])}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.notificationSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notificationSettings[item.key] ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">安全设置</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">启用双因素认证</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">要求管理员登录时使用双因素认证</p>
                  </div>
                  <button
                    onClick={() => handleChange('securitySettings', 'enableTwoFactorAuth', !settings.securitySettings.enableTwoFactorAuth)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.securitySettings.enableTwoFactorAuth ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.securitySettings.enableTwoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">启用速率限制</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">限制API请求频率防止攻击</p>
                  </div>
                  <button
                    onClick={() => handleChange('securitySettings', 'enableRateLimiting', !settings.securitySettings.enableRateLimiting)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.securitySettings.enableRateLimiting ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.securitySettings.enableRateLimiting ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">会话超时时间（分钟）</label>
                    <input
                      type="number"
                      value={settings.securitySettings.sessionTimeout}
                      onChange={(e) => handleChange('securitySettings', 'sessionTimeout', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">最大登录尝试次数</label>
                    <input
                      type="number"
                      value={settings.securitySettings.maxLoginAttempts}
                      onChange={(e) => handleChange('securitySettings', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">外观设置</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-blue-500 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">亮色主题</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100" />
                    <div className="w-8 h-8 rounded bg-gray-200" />
                    <div className="w-8 h-8 rounded bg-gray-300" />
                  </div>
                </div>
                <div className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">暗色主题</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-gray-800" />
                    <div className="w-8 h-8 rounded bg-gray-700" />
                    <div className="w-8 h-8 rounded bg-gray-600" />
                  </div>
                </div>
                <div className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">系统主题</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-gray-100 to-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">数据库管理</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                  <Database className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">备份数据库</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">创建数据库备份文件</p>
                </button>
                <button className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors">
                  <Database className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">恢复数据库</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">从备份文件恢复</p>
                </button>
                <button className="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors">
                  <Database className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">优化数据库</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">清理冗余数据</p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
          {saveMessage && (
            <span className="text-green-600 dark:text-green-400">{saveMessage}</span>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Save size={20} />
            保存设置
          </button>
        </div>
      </div>
    </div>
  )
}
