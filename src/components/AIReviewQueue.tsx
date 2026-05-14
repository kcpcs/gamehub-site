'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye, AlertCircle, Clock, User } from 'lucide-react'

interface ReviewItem {
  id: string
  ai_player_id: string
  ai_player: {
    username: string
    avatar_url: string | null
  }
  action_type: string
  target_type: string
  target_id: string | null
  generated_content: string
  confidence_score: number
  quality_check_result: string
  status: string
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export function AIReviewQueue() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [selectedStatus])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const url = selectedStatus === 'all' 
        ? '/api/admin/ai-review' 
        : `/api/admin/ai-review?status=${selectedStatus}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/admin/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' })
      })
      if (response.ok) {
        fetchReviews()
        setSelectedReview(null)
      }
    } catch (error) {
      console.error('Failed to approve:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch('/api/admin/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject' })
      })
      if (response.ok) {
        fetchReviews()
        setSelectedReview(null)
      }
    } catch (error) {
      console.error('Failed to reject:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      auto_published: 'bg-blue-100 text-blue-800'
    }
    const labels: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      auto_published: 'Auto Published'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      post: 'Post',
      comment: 'Comment',
      reply: 'Reply',
      like: 'Like',
      view: 'View'
    }
    return labels[type] || type
  }

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-transparent border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Content Review Queue</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review and moderate AI-generated content before publication
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            {pendingCount} pending reviews
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="text-gray-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                      <p>No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                          {review.ai_player.avatar_url ? (
                            <img src={review.ai_player.avatar_url} alt={review.ai_player.username} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {review.ai_player.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                        {getActionTypeLabel(review.action_type)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 max-w-xs">
                        {review.generated_content}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${review.confidence_score >= 0.85 ? 'bg-green-500' : review.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${review.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {Math.round(review.confidence_score * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(review.id)}
                              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(review.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Details</h3>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                    {selectedReview.ai_player.avatar_url ? (
                      <img src={selectedReview.ai_player.avatar_url} alt={selectedReview.ai_player.username} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedReview.ai_player.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      AI Player
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Action Type
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getActionTypeLabel(selectedReview.action_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Confidence
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${selectedReview.confidence_score >= 0.85 ? 'bg-green-500' : selectedReview.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${selectedReview.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {Math.round(selectedReview.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Generated Content
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedReview.generated_content}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Quality Check Result
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <pre className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedReview.quality_check_result}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedReview.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(selectedReview.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleReject(selectedReview.id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedReview.status !== 'pending' && (
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
