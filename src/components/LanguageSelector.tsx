"use client"

import { useState } from 'react'
import { languages, type LanguageCode } from '@/lib/i18n'

interface LanguageSelectorProps {
  currentLang: LanguageCode
  onLangChange: (lang: LanguageCode) => void
}

const langFlags: Record<string, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  es: '🇪🇸',
}

const langCodes: Record<string, string> = {
  en: 'EN',
  zh: 'CN',
  ja: 'JP',
  ko: 'KR',
  es: 'ES',
}

export function LanguageSelector({ currentLang, onLangChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        style={{ backgroundColor: 'rgba(30, 27, 75, 0.5)', border: '1px solid rgba(124, 58, 237, 0.3)', backdropFilter: 'blur(10px)' }}
        aria-label="Select language"
      >
        <span className="text-lg">{langFlags[currentLang]}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {langCodes[currentLang]} {languages.find(l => l.code === currentLang)?.name}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLangChange(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  currentLang === lang.code 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'hover:bg-white/5'
                }`}
                style={{ color: currentLang === lang.code ? undefined : 'var(--text-primary)' }}
              >
                <span className="text-lg">{langFlags[lang.code]}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLang === lang.code && (
                  <svg className="ml-auto w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}