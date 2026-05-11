import { useState } from 'react'
import { Search, Check, X, Reply, Trash2, User } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  article_title: string
  status: 'approved' | 'pending' | 'spam'
  created_at: string
}

const mockComments: Comment[] = [
  { id: '1', author: '游戏爱好者', content: '非常详细的攻略，感谢分享！', article_title: '原神新手入门指南', status: 'approved', created_at: '2024-05-11 14:30' },
  { id: '2', author: '萌新玩家', content: '请问这个角色怎么获得？', article_title: '原神角色排行榜', status: 'approved', created_at: '2024-05-11 12:15' },
  { id: '3', author: '广告账号', content: '买游戏账号加微信 xxxxxx', article_title: '艾尔登法环攻略', status: 'spam', created_at: '2024-05-11 10:45' },
  { id: '4', author: '硬核玩家', content: '这个Boss攻略很有用，已经通关了！', article_title: '艾尔登法环Boss攻略', status: 'pending', created_at: '2024-05-10 23:30' },
  { id: '5', author: '玩家小明', content: '期待更多攻略更新！', article_title: 'Valorant角色指南', status: 'approved', created_at: '2024-05-10 18:20' },
]

export function CommentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [comments, setComments] = useState(mockComments)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.article_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || comment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, status: 'approved' } : comment
    ))
  }

  const handleReject = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, status: 'spam' } : comment
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条评论吗？')) {
      setComments(comments.filter(comment => comment.id !== id))
    }
  }

  const handleReply = () => {
    if (replyContent.trim() && selectedComment) {
      alert(`已回复评论 ${selectedComment.id}`)
      setReplyContent('')
      setSelectedComment(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索评论..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有状态</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="spam">垃圾评论</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              待审核: {comments.filter(c => c.status === 'pending').length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              已通过: {comments.filter(c => c.status === 'approved').length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              垃圾: {comments.filter(c => c.status === 'spam').length}
            </span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredComments.map((comment) => (
          <div 
            key={comment.id} 
            className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6 ${
              comment.status === 'pending' ? 'border-yellow-300 dark:border-yellow-700' :
              comment.status === 'spam' ? 'border-red-300 dark:border-red-700' :
              'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{comment.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{comment.created_at}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                comment.status === 'pending' 
                  ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                  : comment.status === 'approved'
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
              }`}>
                {comment.status === 'pending' ? '待审核' : comment.status === 'approved' ? '已通过' : '垃圾'}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{comment.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">关联文章:</span>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{comment.article_title}</p>
              </div>
              <div className="flex gap-2">
                {comment.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleApprove(comment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                    >
                      <Check size={16} />
                      通过
                    </button>
                    <button 
                      onClick={() => handleReject(comment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    >
                      <X size={16} />
                      拒绝
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setSelectedComment(comment)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                >
                  <Reply size={16} />
                  回复
                </button>
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Trash2 size={16} />
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">回复评论</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{selectedComment.author}</span>: {selectedComment.content}
              </p>
            </div>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="输入回复内容..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => { setSelectedComment(null); setReplyContent('') }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleReply}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                发送回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
