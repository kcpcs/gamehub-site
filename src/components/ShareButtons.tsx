// @ts-nocheck
'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Share:</span>
      
      <div className="flex items-center gap-2">
        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4" style={{ color: '#1DA1F2' }} />
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" style={{ color: '#1877F2' }} />
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" style={{ color: '#0A66C2' }} />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <Check className="w-4 h-4" style={{ color: 'var(--success)' }} />
          ) : (
            <Copy className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>
      </div>

      {/* Share Menu Button */}
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        title="More sharing options"
      >
        <Share2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
      </button>
    </div>
  )
}