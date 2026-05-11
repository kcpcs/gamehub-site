'use client'

import Link from 'next/link'
import { Search, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { SearchModal } from '@/components/SearchModal'
import { UserButton } from '@/components/UserButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useLanguage } from '@/lib/language-context'

// ─── INTERFACE (DO NOT MODIFY) ────────────────────────────────
export interface HeaderProps {
  /** Current page path, used for active link highlighting */
  currentPath?: string
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}
// ─────────────────────────────────────────────────────────────

/**
 * SKELETON — Structure and logic only.
 * Trae CN Task: Apply dark gaming theme styles per design spec.
 * DO NOT change prop interface or nav link structure.
 */
export function Header({ currentPath, user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  const NAV_LINKS = [
    { href: '/games',      label: 'games',      translationKey: 'games' },
    { href: '/guides',     label: 'guides',     translationKey: 'guides' },
    { href: '/codes',      label: 'codes',      translationKey: 'codes' },
    { href: '/tier-list',  label: 'tier_list', translationKey: 'tier_list' },
    { href: '/creator/studio',       label: 'creator',       translationKey: 'creator' },
  ] as const

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ background: 'rgba(var(--bg-surface-rgb), 0.8)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            GameHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                color: currentPath?.startsWith(link.href)
                  ? 'var(--accent-light)'
                  : 'var(--text-secondary)',
              }}
            >
              {t(link.translationKey)}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language Selector */}
          <LanguageSelector currentLang={lang} onLangChange={setLang} />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Creator CTA */}
          {user && (
            <Link
              href="/creator/studio"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#fff' }}
            >
              {t('start_creating')}
            </Link>
          )}

          {/* User */}
          <UserButton user={user || null} />

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-2 animate-in slide-in-from-top-2" style={{ borderColor: 'var(--border)', background: 'rgba(var(--bg-surface-rgb), 0.95)' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: currentPath?.startsWith(link.href)
                  ? 'var(--accent-light)'
                  : 'var(--text-secondary)',
                backgroundColor: currentPath?.startsWith(link.href) ? 'var(--bg-elevated)' : 'transparent'
              }}
              onClick={() => setMobileOpen(false)}
            >
              {t(link.translationKey)}
            </Link>
          ))}
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
