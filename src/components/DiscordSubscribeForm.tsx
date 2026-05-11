'use client'

import { useState } from 'react'
import { MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface DiscordSubscribeFormProps {
  gameSlug?: string
  gameName?: string
}

export function DiscordSubscribeForm({ gameSlug, gameName }: DiscordSubscribeFormProps) {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!webhookUrl.trim()) {
      setErrorMessage('Please enter a Discord webhook URL')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'discord-only@example.com',
          game_slugs: gameSlug ? [gameSlug] : [],
          discord_webhook_url: webhookUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setWebhookUrl('')
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
        style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)', border: '1px solid var(--success)' }}
      >
        <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--success)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Discord Webhook Configured!
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          You'll receive notifications when new codes are available for {gameName || 'your games'}.
        </p>
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
          style={{ background: 'rgba(58, 130, 250, 0.2)' }}
        >
          <MessageCircle className="w-6 h-6" style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Discord Notifications
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Get notified on Discord when new codes drop
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Discord Webhook URL..."
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
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
          disabled={status === 'loading' || !webhookUrl.trim()}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3b82f6', color: 'white' }}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Configuring...
            </span>
          ) : (
            'Connect Discord'
          )}
        </button>
      </form>

      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-overlay)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>How to get a webhook URL:</strong> Go to your Discord server settings &gt; Integrations &gt; Webhooks &gt; New Webhook
        </p>
      </div>
    </div>
  )
}