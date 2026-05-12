import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ClientLayout } from '@/components/ClientLayout'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default:  'GameHub — Game Guides, Codes & Tier Lists',
    template: '%s | GameHub',
  },
  description: 'Your ultimate destination for gaming guides, redeem codes, and tier lists. Updated daily with strategies, tips, and exclusive rewards for Genshin Impact, Valorant, Elden Ring, and 30+ games.',
  keywords: ['game guides', 'tier list', 'redeem codes', ' Genshin Impact codes', 'Valorant tips', 'Elden Ring walkthrough', 'gaming strategies'],
  authors: [{ name: 'GameHub Team', url: 'https://gamehub.com' }],
  creator: 'GameHub',
  publisher: 'GameHub',
  openGraph: {
    type: 'website',
    siteName: 'GameHub',
    title: 'GameHub — Game Guides, Codes & Tier Lists',
    description: 'Your ultimate destination for gaming guides, redeem codes, and tier lists. Updated daily with strategies, tips, and exclusive rewards.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'GameHub - Ultimate Gaming Guide Hub',
    }],
    locale: 'en_US',
    url: 'https://gamehub.com',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gamehub',
    creator: '@gamehub',
    title: 'GameHub — Game Guides, Codes & Tier Lists',
    description: 'Your ultimate destination for gaming guides, redeem codes, and tier lists. Updated daily.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://gamehub.com',
    types: {
      'application/rss+xml': '/api/rss',
    },
    languages: {
      'en-US': 'https://gamehub.com',
    },
  },
  category: 'Gaming',
  classification: 'Game Guides & Resources',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let session = null
  try {
    session = await auth()
  } catch {
    // auth() may fail if NEXTAUTH_SECRET is missing or DB is unavailable
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <ClientLayout user={session?.user || null}>{children}</ClientLayout>
    </html>
  )
}