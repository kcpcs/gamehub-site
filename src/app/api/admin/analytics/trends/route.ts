import { NextRequest, NextResponse } from 'next/server'
import { getTrendAnalysis, getAllTrends, getAnomalyReport } from '@/lib/analytics/trends'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const metric = searchParams.get('metric') || 'page_views'
  const days = parseInt(searchParams.get('days') || '30', 10)
  const type = searchParams.get('type') || 'trend'

  try {
    switch (type) {
      case 'all':
        return NextResponse.json({ success: true, data: await getAllTrends(days) })
      case 'anomalies':
        return NextResponse.json({ success: true, data: await getAnomalyReport(days) })
      default:
        return NextResponse.json({ success: true, data: await getTrendAnalysis(metric, days) })
    }
  } catch (err) {
    console.error('[Admin Analytics Trends]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}