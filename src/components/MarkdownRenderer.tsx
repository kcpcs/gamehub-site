'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown renderer without heavy dependencies
  const renderMarkdown = () => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []
    let currentListKey = 0

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${currentListKey}`} className="list-disc list-inside space-y-2 my-4">
            {listItems}
          </ul>
        )
        currentListKey++
      }
      listItems = []
      inList = false
    }

    lines.forEach((line, index) => {
      // Headings
      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
            {line.slice(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        flushList()
        const text = line.slice(3)
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        elements.push(
          <h2 key={index} id={id} className="text-2xl font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
            {text}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        flushList()
        const text = line.slice(4)
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        elements.push(
          <h3 key={index} id={id} className="text-xl font-semibold mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
            {text}
          </h3>
        )
      } else if (line.startsWith('- ')) {
        inList = true
        const text = line.slice(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: bold;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="color: var(--text-primary); font-style: italic;">$1</em>')
        listItems.push(
          <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: text }} />
        )
      } else if (line.trim() === '') {
        flushList()
      } else {
        flushList()
        const formattedText = line
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: bold;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="color: var(--text-primary); font-style: italic;">$1</em>')
          .replace(/`([^`]+)`/g, '<code style="background-color: var(--bg-overlay); color: var(--accent-light); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-light); text-decoration: underline;">$1</a>')
        elements.push(
          <p key={index} className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: formattedText }} />
        )
      }
    })

    flushList()
    return elements
  }

  return <div>{renderMarkdown()}</div>
}
