"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { languages, defaultLanguage, type LanguageCode, t } from '@/lib/i18n'

interface LanguageContextType {
  lang: LanguageCode
  setLang: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_KEY = 'gamehub_language'

const getInitialLanguage = (): LanguageCode => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem(LANGUAGE_KEY)
    if (savedLang && languages.some(l => l.code === savedLang)) {
      return savedLang as LanguageCode
    }
  }
  return defaultLanguage
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(getInitialLanguage)

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, newLang)
      document.documentElement.lang = newLang
    }
  }

  const translate = (key: string) => t(key, lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}