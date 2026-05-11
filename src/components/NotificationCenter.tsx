'use client'

import { useState } from 'react'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'New Guide!',
      message: 'New guide for Genshin Impact has been published',
      timestamp: Date.now() - 300000,
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Codes Available',
      message: 'New redeem codes for Honkai: Star Rail are now available',
      timestamp: Date.now() - 3600000,
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Guide Updated',
      message: 'Elden Ring guide has been updated with new content',
      timestamp: Date.now() - 86400000,
      read: true
    }
  ])

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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-opacity-50"
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
            {notifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
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
