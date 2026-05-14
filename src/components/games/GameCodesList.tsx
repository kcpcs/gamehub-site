'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '../codes/CopyButton'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Code {
  id: string
  code: string
  reward_desc: string
  source: string
  expires_at: string | null
}

interface GameCodesListProps {
  gameSlug: string
}

export function GameCodesList({ gameSlug }: GameCodesListProps) {
  const { t } = useLanguage()
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await fetch(`/api/codes/${gameSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.active_codes) {
            setCodes(data.data.active_codes)
          }
        }
      } catch (error) {
        console.error('Failed to fetch codes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCodes()
  }, [gameSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>{t('no_codes_available')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {codes.map((code) => (
        <div
          key={code.id}
          className="flex items-center justify-between p-4 rounded-lg"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex-1 min-w-0 mr-4">
            <code className="font-mono text-lg font-bold" style={{ color: 'var(--accent-light)' }}>
              {code.code}
            </code>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {code.reward_desc}
            </p>
            {code.expires_at && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Expires: {new Date(code.expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <CopyButton code={code.code} />
        </div>
      ))}
    </div>
  )
}
