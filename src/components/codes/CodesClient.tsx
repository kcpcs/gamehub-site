'use client'

import { useState } from 'react'
import type { GameCode, CodeSource } from '@/types'
import { CopyButton } from '@/components/codes/CopyButton'
import { SubscribeForm } from '@/components/SubscribeForm'
import { HowToRedeem } from '@/components/codes/HowToRedeem'
import { useLanguage } from '@/lib/language-context'
import { tf } from '@/lib/i18n'

interface Game {
  slug: string
  name: string
  cover_url: string
}

interface Codes {
  active: GameCode[]
  expired: GameCode[]
}

interface CodesClientProps {
  game: Game
  codes: Codes
  currentMonthYear: string
}

function SourceBadge({ source }: { source: CodeSource }) {
  const colors: Record<CodeSource, { bg: string; text: string }> = {
    discord: { bg: '#5865F2', text: '#ffffff' },
    reddit: { bg: '#FF4500', text: '#ffffff' },
    official: { bg: '#3fb950', text: '#ffffff' },
    twitter: { bg: '#1DA1F2', text: '#ffffff' },
    user: { bg: '#6e7681', text: '#ffffff' }
  }
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: colors[source].bg, color: colors[source].text }}
    >
      {capitalize(source)}
    </span>
  )
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatLastUpdated() {
  const now = new Date()
  return now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function CodesClient({ game, codes, currentMonthYear }: CodesClientProps) {
  const { t } = useLanguage()
  const [showExpired, setShowExpired] = useState(false)
  const [formData, setFormData] = useState({ code: '', reward: '', sourceUrl: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch(`/api/codes/${game.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          reward_desc: formData.reward,
          source_url: formData.sourceUrl || undefined
        }),
      })
      
      if (res.ok) {
        setSubmitSuccess(true)
        setFormData({ code: '', reward: '', sourceUrl: '' })
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What are the active ${game.name} codes?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The active ${game.name} codes are: ${codes.active.map(c => c.code).join(', ')}. These codes can be redeemed for various rewards like Primogems, Hero Wit, and other in-game items.`
                }
              },
              {
                "@type": "Question",
                "name": "How do I redeem codes in Genshin Impact?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To redeem codes in Genshin Impact, open the game, go to Settings > Account > Redeem Code, enter the code, and click redeem. You can also redeem codes through the official website."
                }
              },
              {
                "@type": "Question",
                "name": "When do Genshin Impact codes expire?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Genshin Impact codes have varying expiration dates. Some codes expire within a few days while others may last for weeks. Always check the expiration date before redeeming."
                }
              },
            ]
          })
        }}
      />

      <div 
        className="rounded-xl p-4 flex items-center gap-4 mb-8"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <img 
          src={game.cover_url} 
          alt={game.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {game.name} Codes ({currentMonthYear})
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'var(--success)', color: 'var(--bg-base)' }}
            >
              {tf('game_codes_count', { count: codes.active.length })} {t('active_codes')}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {t('last_checked_just_now')}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
            <span className="text-white font-bold text-sm">!</span>
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('quick_tips')}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Codes expire quickly, so redeem them as soon as possible. We check and update codes frequently to ensure they're working.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {t('active_codes')}
      </h2>
      <div className="space-y-4 mb-8">
        {codes.active.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{t('no_active_codes')}</p>
          </div>
        ) : (
          codes.active.map((code) => (
            <div 
              key={code.id}
              className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <code 
                    className="font-mono text-lg px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--accent-light)' }}
                  >
                    {code.code}
                  </code>
                  <SourceBadge source={code.source} />
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {t('reward')}: {code.reward_desc}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {code.expires_at ? tf('expires_on', { date: formatDate(code.expires_at) }) : t('no_expiration_date')}
                </p>
              </div>
              <div className="sm:flex-shrink-0">
                <CopyButton code={code.code} />
              </div>
            </div>
          ))
        )}
      </div>

      <HowToRedeem gameName={game.name} />

      <div className="mb-8">
        <SubscribeForm
          gameSlug={game.slug}
          gameName={game.name}
          variant="full"
        />
      </div>

      <div
        className="rounded-xl mb-8 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setShowExpired(!showExpired)}
          className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('expired_codes')} ({codes.expired.length})
          </h2>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${showExpired ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showExpired && (
          <div className="p-4 space-y-3">
            {codes.expired.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                {t('no_expired_codes')}
              </p>
            ) : (
              codes.expired.map((code) => (
                <div key={code.id} className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <code 
                        className="font-mono text-sm line-through"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {code.code}
                      </code>
                      <SourceBadge source={code.source} />
                    </div>
                    <p className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                      {code.reward_desc}
                    </p>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {tf('expires_on', { date: formatDate(code.expires_at) || t('no_expiration_date') })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('submit_new_code')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t('code')}
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: 'var(--bg-overlay)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace'
              }}
              placeholder="e.g., FREEGEMS2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t('reward_description')}
            </label>
            <input
              type="text"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: 'var(--bg-overlay)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              placeholder="e.g., 50 Primogems + 3 Hero Wit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t('source_url_optional')}
            </label>
            <input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: 'var(--bg-overlay)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              placeholder="https://discord.gg/example"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: submitSuccess ? 'var(--success)' : 'var(--accent)',
              color: submitSuccess ? 'var(--bg-base)' : 'white',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? t('submitting') : submitSuccess ? t('submitted_successfully') : t('submit_code')}
          </button>
        </form>
      </div>

      <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('verify_codes_message')}
        </p>
      </div>
    </div>
  )
}
