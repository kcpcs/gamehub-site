import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const gameUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  cover_url: z.string().url().optional(),
  platforms: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  screenshots: z.array(z.string()).optional(),
  description: z.string().max(5000).optional(),
  developer: z.string().max(100).optional(),
  publisher: z.string().max(100).optional(),
  release_date: z.string().optional(),
})

// GET /api/admin/games/[id] - 获取单个游戏
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

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

    // 解析 JSON 字符串字段
    const parsedGame = {
      ...game,
      screenshots: game.screenshots ? JSON.parse(game.screenshots) : [],
      platforms: game.platforms ? JSON.parse(game.platforms) : [],
      genres: game.genres ? JSON.parse(game.genres) : [],
      tags: game.tags ? JSON.parse(game.tags) : [],
    }

    return NextResponse.json({ success: true, data: parsedGame })
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    const validation = gameUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const existingGame = await db.game.findUnique({ where: { id } })
    if (!existingGame) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    const data: any = {}
    const { name, slug, cover_url, platforms, genres, tags, screenshots, description, developer, publisher, release_date } = validation.data

    if (name !== undefined) data.name = name
    if (slug !== undefined) {
      // 检查 slug 是否重复
      const duplicate = await db.game.findFirst({ where: { slug, NOT: { id } } })
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Slug already in use' },
          { status: 409 }
        )
      }
      data.slug = slug
    }
    if (cover_url !== undefined) data.cover_url = cover_url
    if (platforms !== undefined) data.platforms = JSON.stringify(platforms)
    if (genres !== undefined) data.genres = JSON.stringify(genres)
    if (tags !== undefined) data.tags = JSON.stringify(tags)
    if (screenshots !== undefined) data.screenshots = JSON.stringify(screenshots)
    if (description !== undefined) data.description = description
    if (developer !== undefined) data.developer = developer
    if (publisher !== undefined) data.publisher = publisher
    if (release_date !== undefined) data.release_date = release_date ? new Date(release_date) : null

    const updatedGame = await db.game.update({
      where: { id },
      data,
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

// DELETE /api/admin/games/[id] - 删除单个游戏
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    // 先删除关联数据
    await db.tierEntry.deleteMany({ where: { tier_list: { game_id: id } } })
    await db.tierVote.deleteMany({ where: { tier_list: { game_id: id } } })
    await db.tierList.deleteMany({ where: { game_id: id } })
    await db.gameCode.deleteMany({ where: { game_id: id } })
    await db.like.deleteMany({ where: { article: { game_id: id } } })
    await db.comment.deleteMany({ where: { article: { game_id: id } } })
    await db.article.deleteMany({ where: { game_id: id } })
    await db.favorite.deleteMany({ where: { game_id: id } })
    await db.affiliateClick.deleteMany({ where: { game_id: id } })

    await db.game.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Game deleted' })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
