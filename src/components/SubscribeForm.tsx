'use client'

import { useState } from 'react'
import { Mail, Bell, CheckCircle, AlertCircle } from 'lucide-react'

interface SubscribeFormProps {
  gameSlug?: string
  gameName?: string
  variant?: 'compact' | 'full'
}

interface SubscribeResponse {
  success: boolean
  error?: string
  code?: string
}

export function SubscribeForm({ gameSlug, gameName, variant = 'full' }: SubscribeFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, games: gameSlug ? [gameSlug] : [] })
      })

      const data: SubscribeResponse = await response.json()

      if (data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Subscription failed')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.15) 0%, rgba(63, 185, 80, 0.05) 100%)', border: '1px solid var(--success)' }}
      >
        <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--success)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          You're subscribed!
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          We'll notify you when new codes for {gameName || 'your games'} are available.
        </p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
            disabled={status === 'loading'}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={status === 'loading' || !email}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          {status === 'loading' ? '...' : 'Notify'}
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(124, 58, 237, 0.2)' }}
        >
          <Bell className="w-6 h-6" style={{ color: 'var(--accent-light)' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Get Notified
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Subscribe for new {gameName || 'game'} codes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none transition-colors focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--accent)'
            } as React.CSSProperties}
            disabled={status === 'loading'}
          />
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--danger)' }}>
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'white' }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe for Updates'}
        </button>
      </form>

      <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
        No spam, unsubscribe anytime.
      </p>
    </div>
  )
}