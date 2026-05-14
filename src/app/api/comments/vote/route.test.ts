import { describe, it, expect, vi, beforeEach } from 'vitest'

// 必须在任何导入之前定义 mock
vi.mock('@/lib/db', () => ({
  db: {
    comment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    commentVote: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}))

// 现在导入其他模块
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { POST } from './route'

describe('POST /api/comments/vote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new upvote', async () => {
    const mockComment = { id: 'comment-1', content: 'Test comment', vote_score: 0 }
    const mockVote = { id: 'vote-1', comment_id: 'comment-1', user_id: 'test-user', value: 1 }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.comment.findUnique.mockResolvedValue(mockComment as any)
    db.commentVote.findUnique.mockResolvedValue(null)
    db.commentVote.create.mockResolvedValue(mockVote as any)
    db.comment.update.mockResolvedValue({ ...mockComment, vote_score: 1 } as any)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: 1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.vote).toEqual(mockVote)
    expect(data.data.comment.vote_score).toBe(1)
  })

  it('should create a new downvote', async () => {
    const mockComment = { id: 'comment-1', content: 'Test comment', vote_score: 0 }
    const mockVote = { id: 'vote-1', comment_id: 'comment-1', user_id: 'test-user', value: -1 }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.comment.findUnique.mockResolvedValue(mockComment as any)
    db.commentVote.findUnique.mockResolvedValue(null)
    db.commentVote.create.mockResolvedValue(mockVote as any)
    db.comment.update.mockResolvedValue({ ...mockComment, vote_score: -1 } as any)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: -1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.vote.value).toBe(-1)
  })

  it('should update an existing vote', async () => {
    const mockComment = { id: 'comment-1', content: 'Test comment', vote_score: 1 }
    const existingVote = { id: 'vote-1', comment_id: 'comment-1', user_id: 'test-user', value: 1 }
    const updatedVote = { ...existingVote, value: -1 }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.comment.findUnique.mockResolvedValue(mockComment as any)
    db.commentVote.findUnique.mockResolvedValue(existingVote as any)
    db.commentVote.update.mockResolvedValue(updatedVote as any)
    db.comment.update.mockResolvedValue({ ...mockComment, vote_score: -1 } as any)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: -1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.vote.value).toBe(-1)
  })

  it('should cancel a vote (value 0)', async () => {
    const mockComment = { id: 'comment-1', content: 'Test comment', vote_score: 1 }
    const existingVote = { id: 'vote-1', comment_id: 'comment-1', user_id: 'test-user', value: 1 }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.comment.findUnique.mockResolvedValue(mockComment as any)
    db.commentVote.findUnique.mockResolvedValue(existingVote as any)
    db.commentVote.delete.mockResolvedValue(existingVote as any)
    db.comment.update.mockResolvedValue({ ...mockComment, vote_score: 0 } as any)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: 0 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.comment.vote_score).toBe(0)
  })

  it('should return 400 if commentId is missing', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ value: 1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Comment ID')
  })

  it('should return 400 for invalid vote value', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: 5 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Invalid vote value')
  })

  it('should return 404 if comment not found', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.comment.findUnique.mockResolvedValue(null)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'non-existent', value: 1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Comment not found')
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/comments/vote', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment-1', value: 1 }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})
