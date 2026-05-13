'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Comment {
  id: string
  content: string
  user: { id: string; username: string; avatar: string | null }
  created_at: string
  replies?: Comment[]
}

interface VideoCommentsProps {
  videoId: string
}

export function VideoComments({ videoId }: VideoCommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/videos/${videoId}/comments`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setComments(data.data.comments)
          }
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session?.user) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setComments([data.data, ...comments])
          setCommentText('')
        }
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h3>

      {session?.user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 rounded-lg bg-transparent"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-medium">
                {comment.user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {comment.user.username}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {comment.content}
                </p>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 space-y-3 border-l-2 pl-4" style={{ borderColor: 'var(--border)' }}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-medium text-sm">
                          {reply.user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {reply.user.username}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {new Date(reply.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
