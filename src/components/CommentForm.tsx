'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
}

interface CommentFormProps {
  itemId: string
  itemType: 'article' | 'guide' | 'code'
  onCommentSubmit?: (comment: Comment) => void
}

const COMMENTS_KEY = 'gamehub_comments'

const ANONYMOUS_NAMES = [
  'Anonymous Gamer', 'Mystery Player', 'Hidden Hero',
  'Secret Scholar', 'Unknown Adventurer', 'Cloaked Commander'
]

export function CommentForm({ itemId, itemType, onCommentSubmit }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: `${itemType}_${itemId}_${Date.now()}`,
      content: content.trim(),
      author: ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)],
      createdAt: new Date().toISOString()
    }

    const comments = getComments()
    comments.unshift(newComment)
    saveComments(comments)

    if (onCommentSubmit) {
      onCommentSubmit(newComment)
    }

    setContent('')
    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  const getComments = (): Comment[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(COMMENTS_KEY)
      const allComments: Comment[] = stored ? JSON.parse(stored) : []
      return allComments.filter(c => c.id.startsWith(`${itemType}_${itemId}_`))
    } catch {
      return []
    }
  }

  const saveComments = (comments: Comment[]) => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(COMMENTS_KEY)
      const allComments: Comment[] = stored ? JSON.parse(stored) : []
      const otherComments = allComments.filter(c => !c.id.startsWith(`${itemType}_${itemId}_`))
      localStorage.setItem(COMMENTS_KEY, JSON.stringify([...comments, ...otherComments]))
    } catch {
      console.error('Failed to save comments')
    }
  }

  return (
    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 rounded-xl text-base resize-none transition-all duration-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            minHeight: '120px'
          }}
          maxLength={500}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {content.length}/500 characters
          </span>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: content.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent-light))' : 'var(--bg-elevated)',
              color: content.trim() ? '#fff' : 'var(--text-muted)'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Posting...
              </>
            ) : submitted ? (
              <>
                <Send size={18} />
                Posted!
              </>
            ) : (
              <>
                <Send size={18} />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

interface CommentListProps {
  itemId: string
  itemType: 'article' | 'guide' | 'code'
}

export function CommentList({ itemId, itemType }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
    loadComments()
  })

  const loadComments = () => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(COMMENTS_KEY)
      const allComments: Comment[] = stored ? JSON.parse(stored) : []
      const filtered = allComments.filter(c => c.id.startsWith(`${itemType}_${itemId}_`))
      setComments(filtered)
    } catch {
      setComments([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!mounted) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        Loading comments...
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>No comments yet</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        Comments ({comments.length})
      </h3>

      {comments.map(comment => (
        <div
          key={comment.id}
          className="p-5 rounded-xl transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#fff' }}
              >
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {comment.author}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  )
}
