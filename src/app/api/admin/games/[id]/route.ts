import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/games/[id] - 获取单个游戏
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const game = await db.game.findUnique({
      where: { id },
      include: {
        articles: {
          take: 10,
          orderBy: { published_at: 'desc' },
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            published_at: true,
          },
        },
        codes: {
          take: 10,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            code: true,
            reward_desc: true,
            status: true,
          },
        },
        tier_lists: {
          select: {
            id: true,
            category: true,
            patch_version: true,
            total_votes: true,
          },
        },
        _count: {
          select: {
            articles: true,
            codes: true,
            tier_lists: true,
            favorites: true,
            likes: true,
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/games/[id] - 更新游戏
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const game = await db.game.findUnique({ where: { id } })
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    const updatedGame = await db.game.update({
      where: { id },
      data: {
        name: body.name ?? game.name,
        slug: body.slug ?? game.slug,
        cover_url: body.cover_url ?? game.cover_url,
        platforms: body.platforms ?? game.platforms,
        genres: body.genres ?? game.genres,
        description: body.description ?? game.description,
        developer: body.developer ?? game.developer,
        publisher: body.publisher ?? game.publisher,
        release_date: body.release_date ? new Date(body.release_date) : game.release_date,
        score_opencritic: body.score_opencritic ?? game.score_opencritic,
        score_steam_pct: body.score_steam_pct ?? game.score_steam_pct,
        score_community: body.score_community ?? game.score_community,
        score_review_count: body.score_review_count ?? game.score_review_count,
        has_tier_list: body.has_tier_list ?? game.has_tier_list,
      },
    })

    return NextResponse.json({ success: true, data: updatedGame })
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/games/[id] - 删除游戏
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const game = await db.game.findUnique({ where: { id } })
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    await db.game.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Game deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
