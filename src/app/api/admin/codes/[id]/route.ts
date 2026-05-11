import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/codes/[id] - 获取单个兑换码
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const code = await db.gameCode.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        submitted_by: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: code })
  } catch (error) {
    console.error('Error fetching code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch code' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/codes/[id] - 更新兑换码
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const code = await db.gameCode.findUnique({ where: { id } })
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code not found' },
        { status: 404 }
      )
    }

    const updatedCode = await db.gameCode.update({
      where: { id },
      data: {
        code: body.code ?? code.code,
        game_id: body.game_id ?? code.game_id,
        reward_desc: body.reward_desc ?? code.reward_desc,
        source: body.source ?? code.source,
        status: body.status ?? code.status,
        expires_at: body.expires_at ? new Date(body.expires_at) : code.expires_at,
      },
    })

    return NextResponse.json({ success: true, data: updatedCode })
  } catch (error) {
    console.error('Error updating code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update code' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/codes/[id] - 删除兑换码
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const code = await db.gameCode.findUnique({ where: { id } })
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code not found' },
        { status: 404 }
      )
    }

    await db.gameCode.delete({ where: { id } })

    await db.game.update({
      where: { id: code.game_id },
      data: { code_count: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      message: 'Code deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete code' },
      { status: 500 }
    )
  }
}
