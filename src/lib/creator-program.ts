// Creator Partnership Program System
// Manages creator applications, partnerships, and content submissions

import { db } from './db'

export interface CreatorApplication {
  id: string
  user_id: string
  platform: 'YOUTUBE' | 'TWITCH' | 'TIKTOK' | 'OTHER'
  channel_url: string
  channel_name: string
  subscriber_count: number
  content_type: string[]
  experience: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: Date
  updated_at: Date
}

export interface CreatorProfile {
  id: string
  user_id: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  total_views: number
  total_earnings: number
  pending_earnings: number
  payment_email: string
  payment_method?: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO'
  created_at: Date
  updated_at: Date
}

export interface ContentSubmission {
  id: string
  creator_id: string
  content_type: 'VIDEO' | 'GUIDE' | 'CODE'
  title: string
  description: string
  url?: string
  game_id?: string
  status: 'pending' | 'approved' | 'rejected'
  review_notes?: string
  earnings?: number
  created_at: Date
  updated_at: Date
}

/**
 * Submit creator application
 */
export async function submitCreatorApplication(data: {
  user_id: string
  platform: 'YOUTUBE' | 'TWITCH' | 'TIKTOK' | 'OTHER'
  channel_url: string
  channel_name: string
  subscriber_count: number
  content_type: string[]
  experience: string
}): Promise<CreatorApplication> {
  try {
    const existingApplication = await db.creatorApplication.findFirst({
      where: {
        user_id: data.user_id,
        status: { in: ['pending', 'approved'] }
      }
    })

    if (existingApplication) {
      throw new Error('You already have an active application')
    }

    const application = await db.creatorApplication.create({
      data: {
        user_id: data.user_id,
        platform: data.platform,
        channel_url: data.channel_url,
        channel_name: data.channel_name,
        subscriber_count: data.subscriber_count,
        content_type: data.content_type,
        experience: data.experience,
        status: 'pending'
      }
    })

    return application
  } catch (error) {
    console.error('[submitCreatorApplication]', error)
    throw error
  }
}

/**
 * Get creator application status
 */
export async function getCreatorApplication(userId: string): Promise<CreatorApplication | null> {
  try {
    const application = await db.creatorApplication.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
    return application
  } catch (error) {
    console.error('[getCreatorApplication]', error)
    return null
  }
}

/**
 * Approve or reject creator application (admin only)
 */
export async function reviewCreatorApplication(
  applicationId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<void> {
  try {
    await db.$transaction(async (tx) => {
      const application = await tx.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status,
          rejection_reason: rejectionReason
        }
      })

      if (status === 'approved') {
        await tx.creatorProfile.create({
          data: {
            user_id: application.user_id,
            tier: determineTier(application.subscriber_count),
            total_views: 0,
            total_earnings: 0,
            pending_earnings: 0
          }
        })
      }
    })
  } catch (error) {
    console.error('[reviewCreatorApplication]', error)
    throw error
  }
}

/**
 * Determine creator tier based on subscriber count
 */
function determineTier(subscriberCount: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (subscriberCount >= 1000000) return 'platinum'
  if (subscriberCount >= 100000) return 'gold'
  if (subscriberCount >= 10000) return 'silver'
  return 'bronze'
}

/**
 * Get creator profile
 */
export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  try {
    const profile = await db.creatorProfile.findFirst({
      where: { user_id: userId }
    })
    return profile
  } catch (error) {
    console.error('[getCreatorProfile]', error)
    return null
  }
}

/**
 * Submit content for review (creator only)
 */
export async function submitContent(data: {
  creator_id: string
  content_type: 'VIDEO' | 'GUIDE' | 'CODE'
  title: string
  description: string
  url?: string
  game_id?: string
}): Promise<ContentSubmission> {
  try {
    const submission = await db.contentSubmission.create({
      data: {
        creator_id: data.creator_id,
        content_type: data.content_type,
        title: data.title,
        description: data.description,
        url: data.url,
        game_id: data.game_id,
        status: 'pending'
      }
    })

    return submission
  } catch (error) {
    console.error('[submitContent]', error)
    throw error
  }
}

/**
 * Get creator submissions
 */
export async function getCreatorSubmissions(creatorId: string): Promise<ContentSubmission[]> {
  try {
    const submissions = await db.contentSubmission.findMany({
      where: { creator_id: creatorId },
      orderBy: { created_at: 'desc' }
    })
    return submissions
  } catch (error) {
    console.error('[getCreatorSubmissions]', error)
    return []
  }
}

/**
 * Review content submission (admin only)
 */
export async function reviewContentSubmission(
  submissionId: string,
  status: 'approved' | 'rejected',
  reviewNotes?: string,
  earnings?: number
): Promise<void> {
  try {
    await db.contentSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        review_notes: reviewNotes,
        earnings
      }
    })

    if (status === 'approved' && earnings) {
      const submission = await db.contentSubmission.findUnique({
        where: { id: submissionId }
      })

      if (submission) {
        await db.creatorProfile.update({
          where: { id: submission.creator_id },
          data: {
            pending_earnings: { increment: earnings }
          }
        })
      }
    }
  } catch (error) {
    console.error('[reviewContentSubmission]', error)
    throw error
  }
}

/**
 * Calculate earnings based on content type and views
 */
export function calculateEarnings(
  contentType: 'VIDEO' | 'GUIDE' | 'CODE',
  views: number,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
): number {
  const baseRates = {
    VIDEO: 0.01,
    GUIDE: 0.005,
    CODE: 0.02
  }

  const tierMultipliers = {
    bronze: 1.0,
    silver: 1.2,
    gold: 1.5,
    platinum: 2.0
  }

  const baseRate = baseRates[contentType]
  const multiplier = tierMultipliers[tier]

  return Math.round(views * baseRate * multiplier * 100) / 100
}
