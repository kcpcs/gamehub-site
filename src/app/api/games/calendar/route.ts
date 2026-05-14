import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import type { ApiResponse } from '@/types';

const CACHE_TTL = 3600;

export interface ReleaseCalendarEntry {
  game_id: string;
  slug: string;
  name: string;
  cover_url: string;
  release_date: string;
  platforms: string[];
  genres: string[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const days = Number(searchParams.get('days') ?? 30);
  
  const cacheKey = `api:games:calendar:${days}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedCached = typeof cached === 'string' ? JSON.parse(cached) : cached;
      return NextResponse.json(parsedCached as ApiResponse<unknown>);
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + days);

    const games = await db.game.findMany({
      where: {
        release_date: {
          gte: now,
          lte: endDate
        }
      },
      select: {
        id: true,
        slug: true,
        name: true,
        cover_url: true,
        release_date: true,
        platforms: true,
        genres: true
      },
      orderBy: {
        release_date: 'asc'
      }
    });

    const calendarEntries: ReleaseCalendarEntry[] = games.map(game => {
      let platforms: string[] = [];
      let genres: string[] = [];
      
      try {
        platforms = typeof game.platforms === 'string' 
          ? JSON.parse(game.platforms) 
          : Array.isArray(game.platforms) 
            ? game.platforms 
            : [];
      } catch {
        platforms = [];
      }
      
      try {
        genres = typeof game.genres === 'string' 
          ? JSON.parse(game.genres) 
          : Array.isArray(game.genres) 
            ? game.genres 
            : [];
      } catch {
        genres = [];
      }

      return {
        game_id: game.id,
        slug: game.slug,
        name: game.name,
        cover_url: game.cover_url,
        release_date: game.release_date?.toISOString() || '',
        platforms,
        genres
      };
    });

    const response: ApiResponse<{ releases: ReleaseCalendarEntry[] }> = {
      success: true,
      data: { releases: calendarEntries },
      meta: {
        page: 1,
        limit: calendarEntries.length,
        total: calendarEntries.length,
        has_next: false,
        has_prev: false
      }
    };

    await redis.set(cacheKey, JSON.stringify(response), { ex: CACHE_TTL });
    return NextResponse.json(response);

  } catch (error) {
    console.error('[GET /api/games/calendar]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}