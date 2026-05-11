'use client'

import { useState } from 'react'
import { Heart, Bookmark, ThumbsUp, MessageCircle, Share2, Check, User, ChevronDown, ChevronUp } from 'lucide-react'

interface LikeButtonProps {
  initialLikes: number
  articleId: string
}

export function LikeButton({ initialLikes, articleId }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        isLiked
          ? 'bg-red-500/20 text-red-400'
          : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
      }`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      <span className="font-medium">{likes.toLocaleString()}</span>
    </button>
  )
}

interface BookmarkButtonProps {
  articleId: string
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <button
      onClick={handleBookmark}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        isBookmarked
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
      <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}

interface HelpfulVoteProps {
  articleId: string
}

export function HelpfulVote({ articleId }: HelpfulVoteProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(128)

  const handleVote = (helpful: boolean) => {
    if (hasVoted) {
      if (isHelpful === helpful) {
        setHasVoted(false)
        setHelpfulCount(prev => prev - 1)
      } else {
        setIsHelpful(helpful)
      }
    } else {
      setHasVoted(true)
      setIsHelpful(helpful)
      setHelpfulCount(prev => prev + 1)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Was this guide helpful?</p>
      <button
        onClick={() => handleVote(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          hasVoted && isHelpful
            ? 'bg-green-500/20 text-green-400'
            : 'hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">Yes ({helpfulCount})</span>
      </button>
      <button
        onClick={() => handleVote(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          hasVoted && !isHelpful
            ? 'bg-red-500/20 text-red-400'
            : 'hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)]'
        }`}
      >
        <ThumbsUp className="w-4 h-4 rotate-180" />
        <span className="text-sm font-medium">No</span>
      </button>
    </div>
  )
}

interface Comment {
  id: string
  author: string
  content: string
  likes: number
  createdAt: string
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  articleId: string
}

export function CommentSection({ comments, articleId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [allComments, setAllComments] = useState(comments)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  const handleSubmit = () => {
    if (!newComment.trim()) return
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Guest',
      content: newComment,
      likes: 0,
      createdAt: 'Just now',
    }
    setAllComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-6 mt-3' : 'mt-4'}`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--bg-overlay)' }}>
          <User className="w-5 h-5 mx-auto mt-2.5" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{comment.author}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{comment.createdAt}</span>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-muted)' }}>
              <ThumbsUp className="w-3.5 h-3.5" />
              {comment.likes}
            </button>
            <button className="text-xs hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-muted)' }}>
              Reply
            </button>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <>
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-1 text-xs mt-2 hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {expandedReplies[comment.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {comment.replies.length} replies
              </button>
              {expandedReplies[comment.id] && comment.replies.map(reply => renderComment(reply, true))}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Comments ({allComments.length})
        </h3>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--bg-overlay)' }}>
          <User className="w-5 h-5 mx-auto mt-2.5" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                newComment.trim()
                  ? 'bg-[var(--accent)] text-white hover:opacity-90'
                  : 'bg-[var(--bg-overlay)] text-[var(--text-muted)] cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Post Comment
              </span>
            </button>
          </div>
        </div>
      </div>

      {allComments.length > 0 ? (
        allComments.map(comment => renderComment(comment))
      ) : (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          <MessageCircle className="w-10 h-10 mx-auto mb-2" />
          <p>No comments yet. Be the first!</p>
        </div>
      )}
    </div>
  )
}

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareOptions = [
    { platform: 'Twitter', icon: Share2, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
    { platform: 'Facebook', icon: Share2, color: 'hover:bg-blue-600/20 hover:text-blue-500' },
    { platform: 'Discord', icon: Share2, color: 'hover:bg-indigo-500/20 hover:text-indigo-400' },
    { platform: 'Reddit', icon: Share2, color: 'hover:bg-orange-500/20 hover:text-orange-400' },
  ]

  const handleShare = (platform: string) => {
    let shareUrl = ''
    switch (platform) {
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'Discord':
        shareUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(`${title}\n${url}`)}`
        break
      case 'Reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        break
    }
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Share:</span>
      {shareOptions.map(({ platform, icon: Icon, color }) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`p-2 rounded-lg transition-all ${color}`}
          title={platform}
        >
          <Icon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      ))}
    </div>
  )
}

interface ReadingProgressProps {
  progress: number
}

export function ReadingProgress({ progress }: ReadingProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div
        className="h-full transition-all duration-300"
        style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
      />
    </div>
  )
}