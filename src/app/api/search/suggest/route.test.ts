import { describe, it, expect, vi, beforeEach } from 'vitest'

// 必须在任何导入之前定义 mock
vi.mock('@/lib/db', () => ({
  db: {
    game: {
      findMany: vi.fn(),
    },
    article: {
      findMany: vi.fn(),
    },
  },
}))

// 现在导入其他模块
import { db } from '@/lib/db'
import { GET } from './route'

describe('GET /api/search/suggest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return search suggestions for games and articles', async () => {
    const mockGames = [
      { id: 'game-1', slug: 'elden-ring', name: 'Elden Ring', cover_url: 'https://example.com/er.jpg' },
      { id: 'game-2', slug: 'elden-ring-dlc', name: 'Elden Ring: Shadow of the Erdtree', cover_url: 'https://example.com/er-dlc.jpg' },
    ]

    const mockArticles = [
      { id: 'article-1', slug: 'elden-ring-guide', title: 'Elden Ring Complete Guide', article_type: 'guide', cover_url: 'https://example.com/guide.jpg' },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)
    db.article.findMany.mockResolvedValue(mockArticles as any)

    const req = new Request('http://localhost/api/search/suggest?q=elden')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suggestions.games).toHaveLength(2)
    expect(data.data.suggestions.articles).toHaveLength(1)
    expect(data.data.suggestions.games[0].name).toBe('Elden Ring')
    expect(data.data.suggestions.articles[0].title).toBe('Elden Ring Complete Guide')
  })

  it('should return 400 if query is missing', async () => {
    const req = new Request('http://localhost/api/search/suggest')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Query is required')
  })

  it('should return 400 if query is too short', async () => {
    const req = new Request('http://localhost/api/search/suggest?q=a')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Query too short')
  })

  it('should return empty suggestions when no matches found', async () => {
    db.game.findMany.mockResolvedValue([])
    db.article.findMany.mockResolvedValue([])

    const req = new Request('http://localhost/api/search/suggest?q=nonexistentgame123')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suggestions.games).toHaveLength(0)
    expect(data.data.suggestions.articles).toHaveLength(0)
  })

  it('should return only game suggestions when no articles match', async () => {
    const mockGames = [
      { id: 'game-1', slug: 'test-game', name: 'Test Game', cover_url: 'https://example.com/test.jpg' },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)
    db.article.findMany.mockResolvedValue([])

    const req = new Request('http://localhost/api/search/suggest?q=test')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suggestions.games).toHaveLength(1)
    expect(data.data.suggestions.articles).toHaveLength(0)
  })

  it('should return only article suggestions when no games match', async () => {
    const mockArticles = [
      { id: 'article-1', slug: 'test-article', title: 'Test Article', article_type: 'guide', cover_url: 'https://example.com/test.jpg' },
    ]

    db.game.findMany.mockResolvedValue([])
    db.article.findMany.mockResolvedValue(mockArticles as any)

    const req = new Request('http://localhost/api/search/suggest?q=test')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suggestions.games).toHaveLength(0)
    expect(data.data.suggestions.articles).toHaveLength(1)
  })

  it('should handle case-insensitive search', async () => {
    const mockGames = [
      { id: 'game-1', slug: 'mario', name: 'Super Mario', cover_url: 'https://example.com/mario.jpg' },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)
    db.article.findMany.mockResolvedValue([])

    const req = new Request('http://localhost/api/search/suggest?q=MARIO')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.suggestions.games).toHaveLength(1)
  })
})
