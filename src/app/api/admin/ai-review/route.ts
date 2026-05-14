import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import type { ReviewStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ReviewStatus | undefined

    const where: any = {}
    if (status) {
      where.status = status
    }

    const reviews = await db.aIContentReviewQueue.findMany({
      where,
      include: {
        ai_player: {
          select: {
            username: true,
            avatar_url: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
    })

    return NextResponse.json({ reviews }, { status: 200 })
  } catch (error) {
    console.error('[AI Review API] Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const body = await request.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const review = await db.aIContentReviewQueue.findUnique({
      where: { id },
      include: { ai_player: true }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (review.status !== 'pending') {
      return NextResponse.json({ error: 'Review already processed' }, { status: 400 })
    }

    let newStatus: ReviewStatus
    if (action === 'approve') {
      newStatus = 'approved'
      
      await db.$transaction(async (tx) => {
        await tx.aIContentReviewQueue.update({
          where: { id },
          data: { status: 'approved' }
        })

        switch (review.action_type) {
          case 'post': {
            const targetGame = await tx.game.findFirst({
              where: { articles: { some: {} } },
              select: { id: true, name: true }
            })

            if (targetGame) {
              const slug = generateSlug(review.ai_player.username)
              const title = generatePostTitle(review.generated_content)

              const article = await tx.article.create({
                data: {
                  slug,
                  title,
                  article_type: 'guide',
                  status: 'published',
                  source_type: 'ai',
                  game_id: targetGame.id,
                  cover_url: review.ai_player.avatar_url || review.ai_player.avatar || '',
                  cover_alt: title,
                  content: review.generated_content,
                  excerpt: review.generated_content.substring(0, 150) + '...',
                  read_time: Math.max(1, Math.ceil(review.generated_content.length / 1000)),
                  seo_title: title + ' | GameHub',
                  seo_description: review.generated_content.substring(0, 160),
                  seo_keywords: JSON.stringify(extractKeywords(review.generated_content)),
                  quality_score: review.confidence_score,
                  ai_generated: true,
                  ai_player_id: review.ai_player.id,
                  published_at: new Date(),
                },
              })

              await tx.aIActivityLog.create({
                data: {
                  player_id: review.ai_player.id,
                  activity_type: 'post',
                  target_type: 'article',
                  target_id: article.slug,
                  content: review.generated_content,
                  success: true,
                },
              })

              await tx.aIPlayer.update({
                where: { id: review.ai_player.id },
                data: {
                  total_posts: { increment: 1 },
                  last_activity_at: new Date(),
                },
              })
            }
            break
          }
          case 'comment': {
            await tx.comment.create({
              data: {
                article_slug: review.target_id || '',
                author_username: review.ai_player.username,
                author_avatar: review.ai_player.avatar_url || review.ai_player.avatar,
                content: review.generated_content,
                ai_generated: true,
                ai_player_id: review.ai_player.id,
              },
            })

            await tx.aIActivityLog.create({
              data: {
                player_id: review.ai_player.id,
                activity_type: 'comment',
                target_type: 'article',
                target_id: review.target_id || '',
                content: review.generated_content,
                success: true,
              },
            })

            await tx.aIPlayer.update({
              where: { id: review.ai_player.id },
              data: {
                total_comments: { increment: 1 },
                last_activity_at: new Date(),
              },
            })
            break
          }
          case 'reply': {
            await tx.comment.create({
              data: {
                article_slug: '',
                author_username: review.ai_player.username,
                author_avatar: review.ai_player.avatar_url || review.ai_player.avatar,
                content: review.generated_content,
                parent_id: review.target_id,
                ai_generated: true,
                ai_player_id: review.ai_player.id,
              },
            })

            await tx.aIActivityLog.create({
              data: {
                player_id: review.ai_player.id,
                activity_type: 'reply',
                target_type: 'comment',
                target_id: review.target_id || '',
                content: review.generated_content,
                success: true,
              },
            })
            break
          }
        }
      })
    } else if (action === 'reject') {
      newStatus = 'rejected'
      await db.aIContentReviewQueue.update({
        where: { id },
        data: { status: 'rejected' }
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, status: newStatus }, { status: 200 })
  } catch (error) {
    console.error('[AI Review API] Error processing review:', error)
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 })
  }
}

function generateSlug(username: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ai-post-${username.toLowerCase()}-${timestamp}-${random}`
}

function generatePostTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim()
  const title = firstLine.replace(/^[#*]+/, '').trim()
  return title.length > 10 ? title : `My thoughts on gaming: ${title}`
}

function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
  const freq: Record<string, number> = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
}
