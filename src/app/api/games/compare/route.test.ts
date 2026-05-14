import { describe, it, expect, vi, beforeEach } from 'vitest'

// 必须在任何导入之前定义 mock
vi.mock('@/lib/db', () => ({
  db: {
    game: {
      findMany: vi.fn(),
    },
  },
}))

// 现在导入其他模块
import { db } from '@/lib/db'
import { GET } from './route'

describe('GET /api/games/compare', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should compare multiple games successfully', async () => {
    const mockGames = [
      {
        id: 'game-1',
        slug: 'game-one',
        name: 'Game One',
        cover_url: 'https://example.com/game1.jpg',
        platforms: ['pc', 'ps5'],
        genres: ['action', 'rpg'],
        developer: 'Dev Studio',
        publisher: 'Pub Inc',
        release_date: new Date('2024-01-01'),
        score_opencritic: 85,
        score_steam_pct: 90,
        score_community: 4.5,
        score_review_count: 1000,
        guide_count: 50,
        code_count: 10,
        ratings: [
          { score: 5 },
          { score: 4 },
        ],
      },
      {
        id: 'game-2',
        slug: 'game-two',
        name: 'Game Two',
        cover_url: 'https://example.com/game2.jpg',
        platforms: ['pc', 'xbox'],
        genres: ['strategy'],
        developer: 'Another Dev',
        publisher: 'Another Pub',
        release_date: new Date('2024-02-01'),
        score_opencritic: 80,
        score_steam_pct: 85,
        score_community: 4.0,
        score_review_count: 500,
        guide_count: 30,
        code_count: 5,
        ratings: [
          { score: 4 },
          { score: 4 },
        ],
      },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)

    const req = new Request('http://localhost/api/games/compare?slug=game-one&slug=game-two')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.games).toHaveLength(2)
    expect(data.data.games[0].slug).toBe('game-one')
    expect(data.data.games[1].slug).toBe('game-two')
    expect(data.data.games[0].userRating.average).toBe(4.5)
    expect(data.data.games[1].userRating.average).toBe(4)
  })

  it('should return 400 if less than 2 games provided', async () => {
    const req = new Request('http://localhost/api/games/compare?slug=game-one')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('At least 2 games')
  })

  it('should return 400 if more than 5 games provided', async () => {
    const req = new Request('http://localhost/api/games/compare?slug=1&slug=2&slug=3&slug=4&slug=5&slug=6')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Maximum 5 games')
  })

  it('should return 404 if some games not found', async () => {
    const mockGames = [
      { id: 'game-1', slug: 'game-one', name: 'Game One', ratings: [] },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)

    const req = new Request('http://localhost/api/games/compare?slug=game-one&slug=missing-game')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Some games not found')
  })

  it('should handle games with no ratings', async () => {
    const mockGames = [
      {
        id: 'game-1',
        slug: 'game-one',
        name: 'Game One',
        cover_url: 'https://example.com/game1.jpg',
        platforms: ['pc'],
        genres: ['action'],
        developer: 'Dev Studio',
        publisher: 'Pub Inc',
        release_date: null,
        score_opencritic: null,
        score_steam_pct: null,
        score_community: null,
        score_review_count: 0,
        guide_count: 0,
        code_count: 0,
        ratings: [],
      },
      {
        id: 'game-2',
        slug: 'game-two',
        name: 'Game Two',
        cover_url: 'https://example.com/game2.jpg',
        platforms: ['pc'],
        genres: ['strategy'],
        developer: 'Another Dev',
        publisher: 'Another Pub',
        release_date: null,
        score_opencritic: null,
        score_steam_pct: null,
        score_community: null,
        score_review_count: 0,
        guide_count: 0,
        code_count: 0,
        ratings: [],
      },
    ]

    db.game.findMany.mockResolvedValue(mockGames as any)

    const req = new Request('http://localhost/api/games/compare?slug=game-one&slug=game-two')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.games).toHaveLength(2)
    expect(data.data.games[0].userRating.average).toBe(0)
    expect(data.data.games[0].userRating.count).toBe(0)
  })
})
