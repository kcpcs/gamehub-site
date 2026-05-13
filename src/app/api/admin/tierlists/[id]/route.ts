import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/tierlists/[id] - 获取单个Tier List详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const tierList = await db.tierList.findUnique({
      where: { id },
      include: {
        game: true,
        entries: true,
      },
    })

    if (!tierList) {
      return NextResponse.json(
        { success: false, error: 'Tier List not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: tierList })
  } catch (error) {
    console.error('Error fetching tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tier list' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/tierlists/[id] - 更新单个Tier List
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const tierList = await db.tierList.update({
      where: { id },
      data: {
        category: body.category,
        patch_version: body.patch_version,
        is_community: body.is_community,
      },
    })

    return NextResponse.json({ success: true, data: tierList })
  } catch (error) {
    console.error('Error updating tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tier list' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tierlists/[id] - 删除单个Tier List
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const tierList = await db.tierList.findUnique({ where: { id } })
    if (!tierList) {
      return NextResponse.json(
        { success: false, error: 'Tier List not found' },
        { status: 404 }
      )
    }

    await db.tierList.delete({
      where: { id },
    })

    await db.game.update({
      where: { id: tierList.game_id },
      data: { has_tier_list: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Tier List deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tier list' },
      { status: 500 }
    )
  }
}
