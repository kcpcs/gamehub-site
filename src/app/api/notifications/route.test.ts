import { describe, it, expect, vi, beforeEach } from 'vitest'

// 必须在任何导入之前定义 mock
vi.mock('@/lib/db', () => ({
  db: {
    notification: {
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
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
import { GET, PATCH, DELETE } from './route'

describe('GET /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return notifications with pagination', async () => {
    const mockNotifications = [
      { id: 'notif-1', title: 'Test', message: 'Test message', read: false },
    ]

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.findMany.mockResolvedValue(mockNotifications as any)
    db.notification.count
      .mockResolvedValueOnce(1) // total
      .mockResolvedValueOnce(1) // unread

    const req = new Request('http://localhost/api/notifications?page=1&limit=10')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.notifications).toEqual(mockNotifications)
    expect(data.data.unreadCount).toBe(1)
  })

  it('should filter unread notifications', async () => {
    const mockNotifications = [
      { id: 'notif-1', title: 'Test', message: 'Test message', read: false },
    ]

    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.findMany.mockResolvedValue(mockNotifications as any)
    db.notification.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)

    const req = new Request('http://localhost/api/notifications?unread=true')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/notifications')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})

describe('PATCH /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should mark all notifications as read', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.updateMany.mockResolvedValue({ count: 5 } as any)
    db.notification.count.mockResolvedValue(0)

    const req = new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ all: true }),
    })

    const response = await PATCH(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.unreadCount).toBe(0)
  })

  it('should mark specific notifications as read', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.updateMany.mockResolvedValue({ count: 2 } as any)
    db.notification.count.mockResolvedValue(3)

    const req = new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ ids: ['notif-1', 'notif-2'] }),
    })

    const response = await PATCH(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return 400 for invalid request', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })

    const req = new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({}),
    })

    const response = await PATCH(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ all: true }),
    })

    const response = await PATCH(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})

describe('DELETE /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete all read notifications', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.deleteMany.mockResolvedValue({ count: 5 } as any)

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ all: true }),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.deletedCount).toBe(5)
  })

  it('should delete specific notifications', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.deleteMany.mockResolvedValue({ count: 2 } as any)

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ ids: ['notif-1', 'notif-2'] }),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should delete old notifications', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })
    db.notification.deleteMany.mockResolvedValue({ count: 10 } as any)

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ olderThan: '2024-01-01' }),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return 400 for invalid date', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ olderThan: 'invalid-date' }),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('should return 400 for invalid request', async () => {
    vi.mocked(getSession).mockReturnValue({ user: { id: 'user-1' } })

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({}),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getSession).mockReturnValue(null as any)

    const req = new Request('http://localhost/api/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ all: true }),
    })

    const response = await DELETE(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized')
  })
})
