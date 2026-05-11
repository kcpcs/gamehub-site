'use client'

import { useEffect, useRef } from 'react'

// ─── INTERFACE (DO NOT MODIFY) ────────────────────────────────
export type AdSlotSize =
  | '728x90'    // leaderboard (desktop header/footer)
  | '300x250'   // medium rectangle (in-article)
  | '300x600'   // half page (sidebar sticky)
  | '320x50'    // mobile banner (bottom sticky)

export interface AdSlotProps {
  size: AdSlotSize
  slot: string       // AdSense data-ad-slot value
  className?: string
}
// ─────────────────────────────────────────────────────────────

const SIZE_MAP: Record<AdSlotSize, { w: number; h: number }> = {
  '728x90':  { w: 728, h: 90  },
  '300x250': { w: 300, h: 250 },
  '300x600': { w: 300, h: 600 },
  '320x50':  { w: 320, h: 50  },
}

/**
 * AdSense ad slot component.
 * Renders a placeholder in development, live ad in production.
 * DO NOT add any logic that could violate AdSense policies.
 */
export function AdSlot({ size, slot, className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { w, h } = SIZE_MAP[size]

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    try {
      // @ts-expect-error adsbygoogle global
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: w, height: h, maxWidth: '100%',
          background: 'var(--bg-raised)',
          border: '1px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 12,
        }}
      >
        Ad {size}
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={{ width: w, height: h, maxWidth: '100%' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: w, height: h }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  )
}
