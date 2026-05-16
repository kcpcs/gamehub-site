import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

function verifyInternalToken(req: NextRequest): boolean {
  return req.headers.get('authorization')?.replace('Bearer ', '') === process.env.INTERNAL_API_SECRET
}

/**
 * POST /api/internal/games/import
 * Called by n8n IGDB batch import workflow.
 * Upserts games by igdb_id. Safe to call repeatedly.
 *
 * Body: { games: IGDBGamePayload[] }
 * IGDBGamePayload: { igdb_id, name, slug, cover_url, screenshots, platforms, genres, ... }
 */
export async function POST(req: NextRequest) {
  if (!verifyInternalToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const { games } = await req.json() as { games: Record<string, unknown>[] }

    if (!Array.isArray(games) || games.length === 0) {
      return NextResponse.json({ success: false, error: 'games array required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    let upserted = 0
    const errors: string[] = []

    for (const g of games) {
      try {
        await db.game.upsert({
          where:  { igdb_id: g.igdb_id as number },
          update: {
            name:        g.name as string,
            cover_url:   g.cover_url as string,
            screenshots: g.screenshots ? JSON.stringify(g.screenshots) : '[]',
            platforms:   g.platforms ? JSON.stringify(g.platforms) : '[]',
            genres:      g.genres ? JSON.stringify(g.genres) : '[]',
            tags:        g.tags ? JSON.stringify(g.tags) : '[]',
            developer:   g.developer as string | undefined,
            publisher:   g.publisher as string | undefined,
            release_date: g.release_date ? new Date(g.release_date as string) : undefined,
            score_opencritic: g.score_opencritic as number | undefined,
            description: g.description as string | undefined,
          },
          create: {
            slug:        g.slug as string,
            name:        g.name as string,
            igdb_id:     g.igdb_id as number,
            steam_appid: g.steam_appid as number | undefined,
            cover_url:   g.cover_url as string,
            screenshots: g.screenshots ? JSON.stringify(g.screenshots) : '[]',
            platforms:   g.platforms ? JSON.stringify(g.platforms) : '[]',
            genres:      g.genres ? JSON.stringify(g.genres) : '[]',
            tags:        g.tags ? JSON.stringify(g.tags) : '[]',
            developer:   g.developer as string | undefined,
            publisher:   g.publisher as string | undefined,
            release_date: g.release_date ? new Date(g.release_date as string) : undefined,
            score_opencritic: g.score_opencritic as number | undefined,
            description: g.description as string | undefined,
          },
        })
        upserted++
      } catch (e) {
        errors.push(`igdb_id ${g.igdb_id}: ${(e as Error).message}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: { upserted, errors, total: games.length },
    } satisfies ApiResponse<unknown>)
  } catch (err) {
    console.error('[POST /api/internal/games/import]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
