import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/tierlists/[id] - 获取单个排行榜
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tierList = await db.tierList.findUnique({
      where: { id },
      include: {
        game: {
          select: { id: true, name: true, slug: true, cover_url: true },
        },
        entries: {
          orderBy: { avg_score: 'desc' },
        },
        _count: {
          select: { entries: true, votes: true },
        },
      },
    })

    if (!tierList) {
      return NextResponse.json(
        { success: false, error: 'Tier list not found' },
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

// PATCH /api/admin/tierlists/[id] - 更新排行榜
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const tierList = await db.tierList.findUnique({ where: { id } })
    if (!tierList) {
      return NextResponse.json(
        { success: false, error: 'Tier list not found' },
        { status: 404 }
      )
    }

    const { patch_version, is_community, entries } = body

    // Update tier list basic fields
    const updatedTierList = await db.tierList.update({
      where: { id },
      data: {
        ...(patch_version !== undefined && { patch_version }),
        ...(is_community !== undefined && { is_community }),
      },
    })

    // If entries provided, sync them
    if (entries && Array.isArray(entries)) {
      // Delete existing entries that are not in the new list
      const existingEntryIds = entries.filter((e: any) => e.id).map((e: any) => e.id)

      await db.tierEntry.deleteMany({
        where: {
          tier_list_id: id,
          ...(existingEntryIds.length > 0 && { id: { notIn: existingEntryIds } }),
        },
      })

      // Upsert entries
      for (const entry of entries) {
        if (entry.id) {
          await db.tierEntry.update({
            where: { id: entry.id },
            data: {
              name: entry.name,
              image_url: entry.image_url || '',
              grade: entry.grade as any,
              description: entry.description || null,
            },
          })
        } else {
          await db.tierEntry.create({
            data: {
              tier_list_id: id,
              name: entry.name,
              image_url: entry.image_url || '',
              grade: entry.grade as any,
              description: entry.description || null,
            },
          })
        }
      }
    }

    // Return updated tier list with entries
    const result = await db.tierList.findUnique({
      where: { id },
      include: {
        game: { select: { id: true, name: true, slug: true } },
        entries: { orderBy: { avg_score: 'desc' } },
      },
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error updating tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tier list' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tierlists/[id] - 删除排行榜
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tierList = await db.tierList.findUnique({ where: { id } })
    if (!tierList) {
      return NextResponse.json(
        { success: false, error: 'Tier list not found' },
        { status: 404 }
      )
    }

    // Delete votes first (foreign key constraint)
    await db.tierVote.deleteMany({ where: { tier_list_id: id } })
    // Delete entries
    await db.tierEntry.deleteMany({ where: { tier_list_id: id } })
    // Delete tier list
    await db.tierList.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Tier list deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting tier list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tier list' },
      { status: 500 }
    )
  }
}
