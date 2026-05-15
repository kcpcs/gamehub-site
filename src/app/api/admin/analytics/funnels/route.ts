import { NextRequest, NextResponse } from 'next/server'
import { getFunnelAnalysis, getDailyConversionRate, FUNNEL_DEFINITIONS } from '@/lib/analytics/funnels'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const funnel = searchParams.get('funnel') || 'visit_to_register'
  const days = parseInt(searchParams.get('days') || '30', 10)
  const type = searchParams.get('type') || 'funnel'

  try {
    if (type === 'definitions') {
      return NextResponse.json({ success: true, data: FUNNEL_DEFINITIONS })
    }

    if (type === 'daily_conversion') {
      const data = await getDailyConversionRate(days)
      return NextResponse.json({ success: true, data })
    }

    const data = await getFunnelAnalysis(funnel, days)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[Admin Analytics Funnels]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}