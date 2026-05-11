import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ApiResponse } from '@/types'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing subscriber ID', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    await db.subscriber.delete({ where: { id } })

    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error('[DELETE /api/admin/subscribers/[id]]', err)
    return NextResponse.json({ success: false, error: 'Failed to delete subscriber', code: 'SERVER_ERROR' }, { status: 500 })
  }
}