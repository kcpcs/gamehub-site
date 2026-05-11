'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Send, Search, Filter, Users } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  games: string[]
  status: 'active' | 'unsubscribed' | 'bounced'
  created_at: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export function SubscriptionManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)
  const [notificationSubject, setNotificationSubject] = useState('')
  const [notificationBody, setNotificationBody] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [searchTerm, statusFilter])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/admin/subscribers?${params}`)
      const data: ApiResponse<Subscriber[]> = await res.json()
      if (data.success && data.data) {
        setSubscribers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return

    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
      const data: ApiResponse<void> = await res.json()
      if (data.success) {
        setSubscribers(prev => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error)
    }
  }

  const handleSendNotification = async () => {
    if (!notificationSubject || !notificationBody) return

    setSending(true)
    try {
      const res = await fetch('/api/admin/subscribers/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: notificationSubject,
          body: notificationBody,
          subscriberId: selectedSubscriber?.id
        })
      })
      const data: ApiResponse<void> = await res.json()
      if (data.success) {
        setNotificationModalOpen(false)
        setNotificationSubject('')
        setNotificationBody('')
        setSelectedSubscriber(null)
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
    } finally {
      setSending(false)
    }
  }

  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors: Record<string, string> = {
    active: 'var(--success)',
    unsubscribed: 'var(--warning)',
    bounced: 'var(--danger)'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Subscribers
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Manage email subscribers
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-secondary)' }}>
          {subscribers.length} subscribers
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg outline-none appearance-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Games</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Joined</th>
              <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-transparent border-t-accent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                  No subscribers found
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {subscriber.games.length > 0 ? (
                        subscriber.games.slice(0, 3).map((game) => (
                          <span
                            key={game}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-secondary)' }}
                          >
                            {game}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>All games</span>
                      )}
                      {subscriber.games.length > 3 && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          +{subscriber.games.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${statusColors[subscriber.status]}20`, color: statusColors[subscriber.status] }}
                    >
                      {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedSubscriber(subscriber); setNotificationModalOpen(true) }}
                        className="p-2 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Send notification"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                        style={{ color: 'var(--danger)' }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {notificationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Send Notification
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {selectedSubscriber ? `Sending to: ${selectedSubscriber.email}` : 'Sending to all active subscribers'}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                <input
                  type="text"
                  value={notificationSubject}
                  onChange={(e) => setNotificationSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                <textarea
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setNotificationModalOpen(false); setSelectedSubscriber(null) }}
                className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                disabled={!notificationSubject || !notificationBody || sending}
                className="flex-1 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}