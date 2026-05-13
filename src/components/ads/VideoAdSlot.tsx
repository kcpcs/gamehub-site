'use client'

import { AdSlot } from '../ads/AdSlot'

interface VideoAdSlotProps {
  type: 'preroll' | 'midroll' | 'postroll'
  className?: string
}

export function VideoAdSlot({ type, className }: VideoAdSlotProps) {
  if (type === 'preroll') {
    return (
      <div className={className}>
        <AdSlot
          size="728x90"
          slot="video-preroll"
          className="mx-auto"
        />
      </div>
    )
  }

  if (type === 'midroll') {
    return (
      <div className={className}>
        <AdSlot
          size="300x250"
          slot="video-midroll"
          className="mx-auto"
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <AdSlot
        size="728x90"
        slot="video-postroll"
        className="mx-auto"
      />
    </div>
  )
}

interface VideoAdIntegrationProps {
  videoCount: number
  showMidrollAfter?: number
  children: React.ReactNode
}

export function VideoAdIntegration({
  videoCount,
  showMidrollAfter = 3,
  children
}: VideoAdIntegrationProps) {
  const segments = videoCount > showMidrollAfter ? 2 : 1
  const midrollPosition = showMidrollAfter

  if (segments === 1) {
    return <>{children}</>
  }

  const parts = children instanceof Array ? children : [children]

  return (
    <>
      {parts.slice(0, midrollPosition)}
      <div className="my-6">
        <VideoAdSlot type="midroll" />
      </div>
      {parts.slice(midrollPosition)}
    </>
  )
}
