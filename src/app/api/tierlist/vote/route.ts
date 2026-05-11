import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { validateBody, tierVoteSchema } from '@/lib/validations'
import type { ApiResponse } from '@/types'

/**
 * POST /api/tierlist/vote
 * Body: TierVote  — requires auth (session cookie)
 * Upserts the user's vote for a tier entry.
 */
export async function POST(req: NextRequest) {
  // TODO: replace with real session check once auth is wired up
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const result = await validateBody(req, tierVoteSchema)
    if (!result.success) return result.error
    const body = result.data

    const vote = await db.tierVote.upsert({
      where:  { entry_id_user_id: { entry_id: body.entry_id, user_id: userId } },
      update: { grade: body.grade },
      create: { entry_id: body.entry_id, tier_list_id: body.tier_list_id, user_id: userId, grade: body.grade },
    })

    // Invalidate tier list cache
    const entry = await db.tierEntry.findUnique({ where: { id: body.entry_id }, select: { tier_list: { select: { game: { select: { slug: true } }, category: true } } } })
    if (entry) {
      await redis.del(`api:tierlist:${entry.tier_list.game.slug}:${entry.tier_list.category}`)
    }

    return NextResponse.json({ success: true, data: vote } satisfies ApiResponse<typeof vote>)
  } catch (err) {
    console.error('[POST /api/tierlist/vote]', err)
    return NextResponse.json({ success: false, error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
