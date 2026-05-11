'use client'

import { useState } from 'react'
import { TableOfContents, ChevronRight } from 'lucide-react'

interface TableOfContentsNavProps {
  headings: string[]
}

export function TableOfContentsNav({ headings }: TableOfContentsNavProps) {
  const [showToc, setShowToc] = useState(false)

  const handleHeadingClick = (index: number) => {
    const element = document.querySelector(`#heading-${index * 2}`)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <button
        onClick={() => setShowToc(!showToc)}
        className="lg:hidden flex items-center justify-between w-full p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Table of Contents</span>
        <ChevronRight className={`w-5 h-5 transition-transform ${showToc ? 'rotate-90' : ''}`} style={{ color: 'var(--text-secondary)' }} />
      </button>

      <div className={`${showToc ? 'block' : 'hidden'} lg:block rounded-xl p-4 mb-6`} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TableOfContents className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Table of Contents</h3>
        </div>
        <nav className="space-y-2">
          {headings.map((heading, index) => {
            const title = heading.replace('## ', '')
            return (
              <button
                key={index}
                onClick={() => handleHeadingClick(index)}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--bg-overlay)] transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                {title}
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}