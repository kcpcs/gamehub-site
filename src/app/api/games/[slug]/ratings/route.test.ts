import { describe, it, expect, vi, beforeEach } from 'vitest'

// 必须在任何导入之前定义 mock
vi.mock('@/lib/db', () => ({
  db: {
    game: {
      findUnique: vi.fn(),
    },
    gameRating: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}))

// 现在导入其他模块
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { GET, POST, DELETE } from './route'

describe('GET /api/games/[slug]/ratings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return ratings with pagination and stats', async () => {
    const mockGame = { id: 'game-1', slug: 'test-game' }
    const mockRatings = [
      { id: 'rating-1', score: 5, user: { id: 'user-1', username: 'test', avatar: null } },
      { id: 'rating-2', score: 4, user: { id: 'user-2', username: 'test2', avatar: null } },
    ]

    db.game.findUnique.mockResolvedValue(mockGame as any)
    db.gameRating.findMany.mockResolvedValue(mockRatings as any)
    db.gameRating.count.mockResolvedValue(2)
    db.gameRating.aggregate.mockResolvedValue({
      _avg: { score: 4.5 },
      _count: { id: 2 },
    } as any)

    const req = new Request('http://localhost/api/games/test-game/ratings?page=1&limit=10')
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await GET(req, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.ratings).toEqual(mockRatings)
    expect(data.data.stats.average).toBe(4.5)
    expect(data.data.stats.total).toBe(2)
    expect(data.data.pagination.page).toBe(1)
  })

  it('should return 404 if game not found', async () => {
    db.game.findUnique.mockResolvedValue(null)

    const req = new Request('http://localhost/api/games/non-existent/ratings')
    const params = Promise.resolve({ slug: 'non-existent' })
    const response = await GET(req, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Game not found')
  })
})

describe('POST /api/games/[slug]/ratings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new rating', async () => {
    const mockGame = { id: 'game-1', slug: 'test-game' }
    const mockRating = { id: 'rating-1', score: 5, review: 'Great game!' }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(mockGame as any)
    db.gameRating.findUnique.mockResolvedValue(null)
    db.gameRating.create.mockResolvedValue(mockRating as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'POST',
      body: JSON.stringify({ score: 5, review: 'Great game!' }),
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await POST(req, { params })
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockRating)
  })

  it('should return 400 for invalid score', async () => {
    const mockGame = { id: 'game-1', slug: 'test-game' }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(mockGame as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'POST',
      body: JSON.stringify({ score: 10 }),
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await POST(req, { params })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Invalid score')
  })

  it('should return 404 if game not found', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(null)

    const req = new Request('http://localhost/api/games/non-existent/ratings', {
      method: 'POST',
      body: JSON.stringify({ score: 5 }),
    })
    const params = Promise.resolve({ slug: 'non-existent' })
    const response = await POST(req, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Game not found')
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'POST',
      body: JSON.stringify({ score: 5 }),
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await POST(req, { params })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})

describe('DELETE /api/games/[slug]/ratings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete a rating', async () => {
    const mockGame = { id: 'game-1', slug: 'test-game' }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(mockGame as any)
    db.gameRating.deleteMany.mockResolvedValue({ count: 1 } as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'DELETE',
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await DELETE(req, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return 404 if game not found', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(null)

    const req = new Request('http://localhost/api/games/non-existent/ratings', {
      method: 'DELETE',
    })
    const params = Promise.resolve({ slug: 'non-existent' })
    const response = await DELETE(req, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Game not found')
  })

  it('should return 404 if rating not found', async () => {
    const mockGame = { id: 'game-1', slug: 'test-game' }

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.game.findUnique.mockResolvedValue(mockGame as any)
    db.gameRating.deleteMany.mockResolvedValue({ count: 0 } as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'DELETE',
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await DELETE(req, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Rating not found')
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/games/test-game/ratings', {
      method: 'DELETE',
    })
    const params = Promise.resolve({ slug: 'test-game' })
    const response = await DELETE(req, { params })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})
