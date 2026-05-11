'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

interface TableOfContentsProps {
  headings: Array<{
    id: string
    text: string
    level: number
  }>
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = document.getElementById(headings[i].id)
      if (heading && heading.offsetTop <= scrollPosition) {
        setActiveId(headings[i].id)
        break
      }
    }
  }, [headings])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id)
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (headings.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="sticky top-6 rounded-xl p-4"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Table of Contents
        </h3>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-secondary)' }}
        />
      </button>

      {isExpanded && (
        <nav className="space-y-1 max-h-[400px] overflow-y-auto">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeId === heading.id
                  ? 'bg-accent/10 font-medium'
                  : 'hover:bg-white/5'
              }`}
              style={{
                paddingLeft: `${(heading.level - 1) * 12 + 12}px`,
                color: activeId === heading.id ? 'var(--accent-light)' : 'var(--text-secondary)',
              }}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

export function generateHeadingsFromContent(content: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Array<{ id: string; text: string; level: number }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    headings.push({ id, text, level })
  }

  return headings
}