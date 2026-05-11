'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Clock } from 'lucide-react'

interface Version {
  id: string
  label: string
  date: string
  is_latest?: boolean
}

interface VersionSelectorProps {
  versions: Version[]
  activeVersion: string
  onVersionChange: (version: string) => void
}

export function VersionSelector({ versions, activeVersion, onVersionChange }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeVersionData = versions.find(v => v.id === activeVersion)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
        }}
      >
        <Clock className="w-4 h-4" />
        <span>
          {activeVersionData?.is_latest && (
            <span className="mr-2 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
              Latest
            </span>
          )}
          Patch {activeVersionData?.label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="p-2">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => {
                  onVersionChange(version.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeVersion === version.id ? 'bg-accent/10' : 'hover:bg-white/5'
                }`}
                style={{
                  color: activeVersion === version.id ? 'var(--accent-light)' : 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center gap-2">
                  {version.is_latest && (
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
                      NEW
                    </span>
                  )}
                  <span className="font-medium">Patch {version.label}</span>
                </div>
                <span className="text-xs opacity-60">{version.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}