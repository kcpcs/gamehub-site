import { NextRequest, NextResponse } from 'next/server'
import { searchVideos } from '@/lib/video-search'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean)
    const videoTypes = searchParams.get('types')?.split(',').filter(Boolean)
    const sortBy = searchParams.get('sortBy') as 'relevance' | 'date' | 'views' | null
    const timeRange = searchParams.get('timeRange') as 'day' | 'week' | 'month' | 'year' | 'all' | null
    const duration = searchParams.get('duration') as 'short' | 'medium' | 'long' | 'all' | null
    const minViews = searchParams.get('minViews') ? parseInt(searchParams.get('minViews')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required', code: 'INVALID_PARAMS' },
        { status: 400 }
      )
    }

    const results = await searchVideos(query, {
      maxResults: limit,
      filters: {
        query,
        platforms: platforms as any,
        videoTypes: videoTypes as any,
        sortBy: sortBy || undefined,
        timeRange: timeRange || undefined,
        duration: duration || undefined,
        minViews
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        query,
        videos: results,
        count: results.length
      }
    })
  } catch (error) {
    console.error('[GET /api/videos/search]', error)
    return NextResponse.json(
      { success: false, error: 'Search failed', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
