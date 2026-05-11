'use client'

import { useState, useEffect, use } from 'react'
import type { CodesPageData, CodeSource } from '@/types'
import { CopyButton } from '@/components/codes/CopyButton'
import { SubscribeForm } from '@/components/SubscribeForm'
import { HowToRedeem } from '@/components/codes/HowToRedeem'

const placeholderData: CodesPageData = {
  game_slug: 'genshin-impact',
  game_name: 'Genshin Impact',
  game_cover: 'https://picsum.photos/seed/genshin/320/240',
  active_codes: [
    { id: '1', code: 'GENSHINGIFT', reward_desc: '60 Primogems + 5 Hero Wit', status: 'active', source: 'official', source_url: undefined, expires_at: undefined, verified_at: new Date().toISOString(), game_id: '1', game_slug: 'genshin-impact', game_name: 'Genshin Impact', created_at: new Date().toISOString() },
    { id: '2', code: 'ADVENTURE2026', reward_desc: '100 Primogems', status: 'active', source: 'discord', source_url: undefined, expires_at: undefined, verified_at: new Date().toISOString(), game_id: '1', game_slug: 'genshin-impact', game_name: 'Genshin Impact', created_at: new Date().toISOString() }
  ],
  expired_codes: [
    { id: '3', code: 'OLDCODE123', reward_desc: '30 Primogems', status: 'expired', source: 'reddit', source_url: undefined, expires_at: '2026-01-01', verified_at: new Date().toISOString(), game_id: '1', game_slug: 'genshin-impact', game_name: 'Genshin Impact', created_at: new Date().toISOString() }
  ],
  last_updated: new Date().toISOString(),
  last_checked: new Date().toISOString()
}

async function fetchCodes(gameSlug: string): Promise<CodesPageData> {
  try {
    const res = await fetch(`/api/codes/${gameSlug}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const response = await res.json()
    if (response.success && response.data) {
      return { ...response.data, last_checked: new Date().toISOString() }
    }
    return placeholderData
  } catch {
    return placeholderData
  }
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

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'No expiry'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatLastUpdated(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatLastChecked(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / 60000)
    return `Last checked: ${diffMins}m ago`
  } else if (diffHours < 24) {
    return `Last checked: ${diffHours}h ago`
  } else {
    return `Last checked: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }
}

export default function CodesPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: gameSlug } = use(params)
  const [data, setData] = useState<CodesPageData | null>(null)
  const [showExpired, setShowExpired] = useState(false)
  const [formData, setFormData] = useState({ code: '', reward: '', sourceUrl: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const codesData = await fetchCodes(gameSlug)
      setData(codesData)
      setLoading(false)
    }
    loadData()
  }, [gameSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch(`/api/codes/${gameSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          reward_desc: formData.reward,
          source_url: formData.sourceUrl || undefined
        })
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

  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading codes...</span>
        </div>
      </div>
    )
  }

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
                "name": `What are the active ${data.game_name} codes?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The active ${data.game_name} codes are: ${data.active_codes.map(c => c.code).join(', ')}. These codes can be redeemed for various rewards like Primogems, Hero Wit, and other in-game items.`
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
              }
            ]
          })
        }}
      />

      <div 
        className="rounded-xl p-4 flex items-center gap-4 mb-8"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <img 
          src={data.game_cover} 
          alt={data.game_name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {data.game_name} Codes ({currentMonthYear})
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'var(--success)', color: 'var(--bg-base)' }}
            >
              {data.active_codes.length} Active Codes
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {formatLastChecked(data.last_checked || data.last_updated)}
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
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Quick Tips</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Codes expire quickly, so redeem them as soon as possible. We check and update codes frequently to ensure they're working.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Active Codes
      </h2>
      <div className="space-y-4 mb-8">
        {data.active_codes.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No active codes available at this time. Check back later!</p>
          </div>
        ) : (
          data.active_codes.map((code) => (
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
                  Reward: {code.reward_desc}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {code.expires_at ? `Expires: ${formatDate(code.expires_at)}` : 'No expiration date'}
                </p>
              </div>
              <div className="sm:flex-shrink-0">
                <CopyButton code={code.code} />
              </div>
            </div>
          ))
        )}
      </div>

      <HowToRedeem gameName={data.game_name} />

      <div className="mb-8">
        <SubscribeForm
          gameSlug={data.game_slug}
          gameName={data.game_name}
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
            Expired Codes ({data.expired_codes.length})
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
            {data.expired_codes.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                No expired codes to show
              </p>
            ) : (
              data.expired_codes.map((code) => (
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
                    Expired: {formatDate(code.expires_at)}
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
          Submit a New Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Code
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
              placeholder="e.g. FREEGEMS2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Reward Description
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
              placeholder="e.g. 50 Primogems + 3 Hero Wit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Source URL (Optional)
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
            {submitting ? 'Submitting...' : submitSuccess ? 'Submitted Successfully!' : 'Submit Code'}
          </button>
        </form>
      </div>

      <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-overlay)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          We verify all codes before listing them. If you find a code that doesn't work, please let us know!
        </p>
      </div>
    </div>
  )
}
