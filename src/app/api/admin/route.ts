import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'GameHub Admin API v1.0',
    endpoints: {
      dashboard: '/api/admin/dashboard',
      games: {
        list: 'GET /api/admin/games',
        create: 'POST /api/admin/games',
        batch: 'PATCH /api/admin/games',
        single: 'GET /api/admin/games/[id]',
        update: 'PATCH /api/admin/games/[id]',
        delete: 'DELETE /api/admin/games/[id]',
      },
      articles: {
        list: 'GET /api/admin/articles',
        create: 'POST /api/admin/articles',
        batch: 'PATCH /api/admin/articles',
        single: 'GET /api/admin/articles/[id]',
        update: 'PATCH /api/admin/articles/[id]',
        delete: 'DELETE /api/admin/articles/[id]',
      },
      codes: {
        list: 'GET /api/admin/codes',
        create: 'POST /api/admin/codes',
        batch: 'PATCH /api/admin/codes',
        single: 'GET /api/admin/codes/[id]',
        update: 'PATCH /api/admin/codes/[id]',
        delete: 'DELETE /api/admin/codes/[id]',
      },
      users: {
        list: 'GET /api/admin/users',
        batch: 'PATCH /api/admin/users',
      },
      'ai-players': {
        list: 'GET /api/admin/ai-players',
        create: 'POST /api/admin/ai-players',
        single: 'GET /api/admin/ai-players/[id]',
        update: 'PATCH /api/admin/ai-players/[id]',
        delete: 'DELETE /api/admin/ai-players/[id]',
        start: 'POST /api/admin/ai-players/[id]/start',
        stop: 'POST /api/admin/ai-players/[id]/stop',
        batch: 'POST /api/admin/ai-players/batch',
        stats: 'GET /api/admin/ai-players/stats',
        logs: 'GET /api/admin/ai-players/activity-logs',
      },
      'ai-scheduler': {
        status: 'GET /api/admin/ai-scheduler',
        action: 'POST /api/admin/ai-scheduler',
      },
    },
  })
}
