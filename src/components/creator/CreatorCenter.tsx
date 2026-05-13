'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, CheckCircle, XCircle, Clock, DollarSign, Play, FileText, Gift } from 'lucide-react'

interface CreatorApplication {
  id: string
  platform: string
  channel_name: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
}

interface CreatorProfile {
  id: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  total_views: number
  total_earnings: number
  pending_earnings: number
}

interface ContentSubmission {
  id: string
  content_type: 'VIDEO' | 'GUIDE' | 'CODE'
  title: string
  status: 'pending' | 'approved' | 'rejected'
  earnings?: number
  created_at: string
}

interface CreatorCenterProps {
  initialApplication?: CreatorApplication | null
  initialProfile?: CreatorProfile | null
}

export function CreatorCenter({ initialApplication, initialProfile }: CreatorCenterProps) {
  const { data: session } = useSession()
  const [application, setApplication] = useState<CreatorApplication | null>(initialApplication)
  const [profile, setProfile] = useState<CreatorProfile | null>(initialProfile)
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'status' | 'submit' | 'earnings'>('status')

  const [formData, setFormData] = useState({
    platform: 'YOUTUBE',
    channel_url: '',
    channel_name: '',
    subscriber_count: '',
    content_type: [] as string[],
    experience: ''
  })

  const contentTypes = [
    { value: 'VIDEO', label: 'Videos', icon: Play },
    { value: 'GUIDE', label: 'Guides', icon: FileText },
    { value: 'CODE', label: 'Codes', icon: Gift }
  ]

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/creator/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data.data)
        setActiveTab('status')
      }
    } catch (error) {
      console.error('Failed to submit application:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleContentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      content_type: prev.content_type.includes(type)
        ? prev.content_type.filter(t => t !== type)
        : [...prev.content_type, type]
    }))
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-400'
      case 'gold': return 'text-yellow-400'
      case 'silver': return 'text-gray-400'
      default: return 'text-orange-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>
          Please sign in to access the Creator Center.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Creator Center
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Join our creator partnership program and earn rewards for your content
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['status', 'submit', 'earnings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? '' : 'hover:bg-opacity-50'
            }`}
            style={
              activeTab === tab
                ? { backgroundColor: 'var(--accent)', color: 'white' }
                : { backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }
            }
          >
            {tab === 'status' && 'Status'}
            {tab === 'submit' && 'Submit Content'}
            {tab === 'earnings' && 'Earnings'}
          </button>
        ))}
      </div>

      {activeTab === 'status' && (
        <div className="space-y-6">
          {application ? (
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(application.status)}
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Application {application.status}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Platform</span>
                  <span style={{ color: 'var(--text-primary)' }}>{application.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Channel</span>
                  <span style={{ color: 'var(--text-primary)' }}>{application.channel_name}</span>
                </div>
                {application.rejection_reason && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10">
                    <p className="text-sm text-red-500">
                      Rejection reason: {application.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>
                You haven&apos;t applied to the creator program yet.
              </p>
              <button
                onClick={() => setActiveTab('submit')}
                className="mt-4 px-6 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Apply Now
              </button>
            </div>
          )}

          {profile && (
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Creator Profile
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-2xl font-bold ${getTierColor(profile.tier)}`}>
                  {profile.tier.toUpperCase()}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>Creator</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Total Views</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {profile.total_views.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Total Earnings</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                    ${profile.total_earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'submit' && !application && (
        <form onSubmit={handleSubmitApplication} className="space-y-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Creator Application
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="TWITCH">Twitch</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Channel URL
                </label>
                <input
                  type="url"
                  value={formData.channel_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, channel_url: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Channel Name
                </label>
                <input
                  type="text"
                  value={formData.channel_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, channel_name: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Subscriber Count
                </label>
                <input
                  type="number"
                  value={formData.subscriber_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, subscriber_count: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Content Types
                </label>
                <div className="flex gap-3">
                  {contentTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleContentType(value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.content_type.includes(value) ? '' : 'hover:bg-opacity-50'
                      }`}
                      style={{
                        backgroundColor: formData.content_type.includes(value) ? 'var(--accent)' : 'var(--bg-overlay)',
                        color: formData.content_type.includes(value) ? 'white' : 'var(--text-primary)'
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Experience (Optional)
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-primary)', minHeight: '100px' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      )}

      {activeTab === 'earnings' && profile && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span style={{ color: 'var(--text-muted)' }}>Pending</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${profile.pending_earnings.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span style={{ color: 'var(--text-muted)' }}>Total Earned</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ${profile.total_earnings.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-purple-500" />
                <span style={{ color: 'var(--text-muted)' }}>Total Views</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {profile.total_views.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recent Submissions
            </h2>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map(submission => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-overlay)' }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {submission.title}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {submission.content_type} • {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(submission.status)}
                      {submission.earnings && (
                        <span style={{ color: 'var(--accent)' }}>
                          ${submission.earnings.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                No submissions yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
