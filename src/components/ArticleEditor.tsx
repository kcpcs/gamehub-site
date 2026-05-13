'use client'

import { useState, useCallback } from 'react'
import { Bold, Italic, List, ListOrdered, Link, Image, Code, Quote, Heading1, Heading2, Save, Eye, X } from 'lucide-react'

interface ArticleEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
  onCancel?: () => void
}

export function ArticleEditor({ initialContent = '', onSave, onCancel }: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = useCallback((prefix: string, suffix = '') => {
    const textarea = document.querySelector('textarea[data-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end)
    
    setContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }, [content])

  const toolbarButtons = [
    { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: List, label: 'Unordered List', action: () => insertMarkdown('- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertMarkdown('1. ') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: Image, label: 'Image', action: () => insertMarkdown('![alt](', ')') },
  ]

  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
  }

  const renderPreview = () => {
    let html = content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-red-500">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4">$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded-lg" />')
      .replace(/\n/gim, '<br />')

    return html
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, index) => {
            const Icon = btn.icon
            return (
              <button
                key={index}
                onClick={btn.action}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={btn.label}
                type="button"
              >
                <Icon size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showPreview 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            type="button"
          >
            <Eye size={16} />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div 
          className="p-6 min-h-96 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      ) : (
        <textarea
          data-editor
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter article content here... (Markdown format supported)"
          className="w-full min-h-96 p-6 border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm"
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          type="button"
        >
          <Save size={18} />
          Save
        </button>
      </div>
    </div>
  )
}
