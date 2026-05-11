// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
import type { Record } from 'typescript'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  const scriptRef = useRef<HTMLScriptElement>(null)

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(data)
    }
  }, [data])

  return (
    <script
      ref={scriptRef}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}