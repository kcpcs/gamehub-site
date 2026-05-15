import { NextRequest, NextResponse } from 'next/server'
import { getPageViewStats } from '@/lib/analytics/tracker'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7', 10)
  const path = searchParams.get('path') || undefined

  try {
    const stats = await getPageViewStats({ days, path })
    return NextResponse.json({ success: true, data: stats })
  } catch (err) {
    console.error('[Admin Analytics Behavior]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}