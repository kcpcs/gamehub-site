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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(defaultLanguage)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLang = localStorage.getItem(LANGUAGE_KEY)
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLangState(savedLang as LanguageCode)
    }
  }, [])

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, newLang)
      document.documentElement.lang = newLang
    }
  }

  const translate = (key: string) => t(key, lang)

  if (!isClient) {
    return (
      <LanguageContext.Provider value={{ lang: defaultLanguage, setLang, t: (key: string) => t(key, defaultLanguage) }}>
        {children}
      </LanguageContext.Provider>
    )
  }

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