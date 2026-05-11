'use client'

import { LanguageProvider } from '@/lib/language-context'
import { type ReactNode } from 'react'

export function LanguageProviderWrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
