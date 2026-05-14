'use client'

import { useState, useEffect, useRef } from 'react'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  action_url: string | null
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (data.success) {
        const transformed = data.data.map((n: any) => ({
          ...n,
          timestamp: new Date(n.created_at).getTime(),
          type: mapType(n.type)
        }))
        setNotifications(transformed)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const mapType = (type: string): NotificationType => {
    const typeMap: Record<string, NotificationType> = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      error: 'error'
    }
    return typeMap[type] || 'info'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      default:
        return 'ℹ'
    }
  }

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'var(--success)'
      case 'warning':
        return 'var(--warning)'
      case 'error':
        return 'var(--danger)'
      default:
        return 'var(--accent-light)'
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readAll: true })
      })
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.158c0 .525.323.719.642 1.007L6 17h5m2 3 2 4h4m-2 0v-.2" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold flex items-center justify-center text-white rounded-full" style={{ backgroundColor: 'var(--accent)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl z-50" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs" style={{ color: 'var(--accent-light)' }}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="p-4 cursor-pointer transition-colors hover:bg-opacity-10"
                  style={{
                    borderBottom: '1px solid var(--border)', backgroundColor: !notification.read ? 'var(--bg-overlay)' : 'transparent'
                  }}
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                      <span style={{ color: getColor(notification.type) }}>
                        {getIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {notification.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="w-full text-sm" style={{ color: 'var(--text-secondary)' }}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
