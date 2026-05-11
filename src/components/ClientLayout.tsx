'use client'

import { LanguageProviderWrapper } from '@/components/providers/LanguageProviderWrapper'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { ReactNode } from 'react'
import type { User } from 'next-auth'

interface ClientLayoutProps {
  children: ReactNode
  user: User | null
}

export function ClientLayout({ children, user }: ClientLayoutProps) {
  return (
    <body className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3' }}>
      <LanguageProviderWrapper>
        <Header user={user} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </LanguageProviderWrapper>
    </body>
  )
}