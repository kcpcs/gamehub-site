import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/games/[id] - 获取单个游戏详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const game = await db.game.findUnique({
      where: { id },
      include: {
        articles: true,
        codes: true,
        tier_lists: true,
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

// PATCH /api/admin/games/[id] - 更新单个游戏
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const game = await db.game.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        cover_url: body.cover_url,
        platforms: body.platforms,
        genres: body.genres,
        description: body.description,
        developer: body.developer,
        publisher: body.publisher,
        release_date: body.release_date ? new Date(body.release_date) : undefined,
      },
    })

    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/games/[id] - 删除单个游戏
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await db.game.delete({
      where: { id },
    })

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
