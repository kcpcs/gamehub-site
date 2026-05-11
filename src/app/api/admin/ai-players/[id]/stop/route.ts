import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const player = await db.aIPlayer.update({
      where: { id },
      data: { status: 'inactive' },
    })

    return NextResponse.json({ success: true, data: player, message: 'AI player stopped' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to stop AI player' }, { status: 500 })
  }
}
