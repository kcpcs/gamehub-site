import { NextRequest, NextResponse } from 'next/server'
import { getVideoRecommendations, getTrendingVideos, getSimilarVideos } from '@/lib/video-recommendations'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get('type') || 'recommended'
    const videoId = searchParams.get('videoId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const excludeIds = searchParams.get('excludeIds')?.split(',').filter(Boolean) || []

    let videos = []

    switch (type) {
      case 'trending':
        videos = await getTrendingVideos(limit)
        break

      case 'similar':
        if (videoId) {
          videos = await getSimilarVideos(videoId, limit)
        } else {
          return NextResponse.json(
            { success: false, error: 'videoId required for similar type', code: 'INVALID_PARAMS' },
            { status: 400 }
          )
        }
        break

      case 'recommended':
      default:
        const session = await auth()
        if (session?.user) {
          videos = await getVideoRecommendations(session.user.id as string, limit, excludeIds)
        } else {
          videos = await getTrendingVideos(limit)
        }
        break
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        videos,
        count: videos.length
      }
    })
  } catch (error) {
    console.error('[GET /api/recommend/videos]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
