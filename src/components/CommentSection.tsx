// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, Reply, Send, User } from 'lucide-react'

interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  created_at: string
  likes: number
  is_liked: boolean
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/comments/${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || mockComments)
      } else {
        setComments(mockComments)
      }
    } catch {
      setComments(mockComments)
    }
    setIsLoading(false)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: newComment,
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments()
      }
    } catch {
      console.error('Failed to submit comment')
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch('/api/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          parentId,
          content: replyContent,
        }),
      })

      if (response.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchComments()
      }
    } catch {
      console.error('Failed to submit reply')
    }
  }

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchComments()
      }
    } catch {
      console.error('Failed to like comment')
    }
  }

  const renderComment = (comment: Comment, depth = 0) => (
    <div
      key={comment.id}
      className="mb-4"
      style={{ paddingLeft: `${depth * 16}px` }}
    >
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
        >
          <User className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
              {comment.author}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {comment.created_at}
            </span>
          </div>

          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                comment.is_liked ? 'text-accent-light' : ''
              }`}
              style={{ color: comment.is_liked ? undefined : 'var(--text-muted)' }}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-accent-light"
              style={{ color: 'var(--text-muted)' }}
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-overlay)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  ringColor: 'var(--accent)',
                }}
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                  }}
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-transparent border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Input */}
      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--bg-overlay)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            ringColor: 'var(--accent)',
          }}
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            <Send className="w-4 h-4" />
            <span>Post Comment</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        comments.map((comment) => renderComment(comment))
      ) : (
        <div className="text-center py-8 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'GamerPro',
    content: 'Great guide! The tips helped me beat the boss on my first try. Thanks!',
    created_at: '2 hours ago',
    likes: 24,
    is_liked: false,
    replies: [
      {
        id: '1-1',
        author: 'GameMaster',
        content: 'Glad it helped! The parry timing is tricky but once you get it...',
        created_at: '1 hour ago',
        likes: 8,
        is_liked: false,
      },
    ],
  },
  {
    id: '2',
    author: 'NewPlayer',
    content: 'Just started playing this game. This guide is exactly what I needed!',
    created_at: '5 hours ago',
    likes: 12,
    is_liked: true,
  },
  {
    id: '3',
    author: 'StrategyExpert',
    content: 'Nice breakdown of the strategies. Would love to see a follow-up with advanced tactics.',
    created_at: '1 day ago',
    likes: 35,
    is_liked: false,
    replies: [
      {
        id: '3-1',
        author: 'Admin',
        content: 'Thanks for the suggestion! We\'re working on an advanced guide.',
        created_at: '12 hours ago',
        likes: 15,
        is_liked: false,
      },
    ],
  },
]