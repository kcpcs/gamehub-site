import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const articleSlug = searchParams.get('slug')
    const gameId = searchParams.get('gameId')
    const userId = searchParams.get('userId')

    let likeCount = 0
    let isLiked = false

    if (articleSlug) {
      const article = await db.article.findFirst({
        where: { slug: articleSlug },
        select: { id: true }
      })

      if (article) {
        likeCount = await db.like.count({
          where: { article_id: article.id }
        })

        if (userId) {
          const userLike = await db.like.findFirst({
            where: { user_id: userId, article_id: article.id }
          })
          isLiked = !!userLike
        }
      }
    } else if (gameId) {
      likeCount = await db.like.count({
        where: { game_id: gameId }
      })

      if (userId) {
        const userLike = await db.like.findFirst({
          where: { user_id: userId, game_id: gameId }
        })
        isLiked = !!userLike
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        count: likeCount,
        isLiked: isLiked
      }
    })
  } catch (err) {
    console.error('[GET /api/articles/likes]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to get likes'
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { articleSlug, gameId, userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User is required'
      }, { status: 400 })
    }

    if (!articleSlug && !gameId) {
      return NextResponse.json({
        success: false,
        error: 'Either article or game is required'
      }, { status: 400 })
    }

    let articleId: string | undefined = undefined

    if (articleSlug) {
      const article = await db.article.findFirst({
        where: { slug: articleSlug },
        select: { id: true }
      })
      if (article) {
        articleId = article.id
      }
    }

    const existingLike = await db.like.findFirst({
      where: {
        user_id: userId,
        ...(articleId ? { article_id: articleId } : {}),
        ...(gameId ? { game_id: gameId } : {})
      }
    })

    if (existingLike) {
      await db.like.delete({
        where: { id: existingLike.id }
      })

      return NextResponse.json({
        success: true,
        data: {
          liked: false,
          count: await db.like.count({
            where: {
              ...(articleId ? { article_id: articleId } : {}),
              ...(gameId ? { game_id: gameId } : {})
            }
          })
        }
      })
    }

    await db.like.create({
      data: {
        user_id: userId,
        article_id: articleId,
        game_id: gameId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        liked: true,
        count: await db.like.count({
          where: {
            ...(articleId ? { article_id: articleId } : {}),
            ...(gameId ? { game_id: gameId } : {})
          }
        })
      }
    })
  } catch (err) {
    console.error('[POST /api/articles/likes]', err)
    return NextResponse.json({
      success: false,
      error: 'Failed to toggle like'
    }, { status: 500 })
  }
}
