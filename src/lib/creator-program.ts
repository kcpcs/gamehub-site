// @ts-nocheck - Creator enums used as values, needs refactor
// Creator Partnership Program System
// Manages creator applications, partnerships, and content submissions

import { db } from './db'
import type {
  CreatorApplication as PrismaCreatorApplication,
  CreatorProfile as PrismaCreatorProfile,
  ContentSubmission as PrismaContentSubmission,
  CreatorApplicationPlatform,
  CreatorApplicationStatus,
  CreatorProfileTier,
  ContentSubmissionType,
  ContentSubmissionStatus
} from '@prisma/client'

// Re-export Prisma types for convenience
export type CreatorApplication = PrismaCreatorApplication
export type CreatorProfile = PrismaCreatorProfile
export type ContentSubmission = PrismaContentSubmission

/**
 * Submit creator application
 */
export async function submitCreatorApplication(data: {
  user_id: string
  platform: CreatorApplicationPlatform
  channel_url: string
  channel_name: string
  subscriber_count: number
  content_type: string[]
  experience?: string
}): Promise<CreatorApplication> {
  try {
    const existingApplication = await db.creatorApplication.findFirst({
      where: {
        user_id: data.user_id,
        status: { in: [CreatorApplicationStatus.pending, CreatorApplicationStatus.approved] }
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
        status: CreatorApplicationStatus.pending
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
  status: CreatorApplicationStatus.approved | CreatorApplicationStatus.rejected,
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

      if (status === CreatorApplicationStatus.approved) {
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
function determineTier(subscriberCount: number): CreatorProfileTier {
  if (subscriberCount >= 1000000) return CreatorProfileTier.platinum
  if (subscriberCount >= 100000) return CreatorProfileTier.gold
  if (subscriberCount >= 10000) return CreatorProfileTier.silver
  return CreatorProfileTier.bronze
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
  content_type: ContentSubmissionType
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
        status: ContentSubmissionStatus.pending
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
  status: ContentSubmissionStatus.approved | ContentSubmissionStatus.rejected,
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

    if (status === ContentSubmissionStatus.approved && earnings) {
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
  contentType: ContentSubmissionType,
  views: number,
  tier: CreatorProfileTier
): number {
  const baseRates = {
    [ContentSubmissionType.VIDEO]: 0.01,
    [ContentSubmissionType.GUIDE]: 0.005,
    [ContentSubmissionType.CODE]: 0.02
  }

  const tierMultipliers = {
    [CreatorProfileTier.bronze]: 1.0,
    [CreatorProfileTier.silver]: 1.2,
    [CreatorProfileTier.gold]: 1.5,
    [CreatorProfileTier.platinum]: 2.0
  }

  const baseRate = baseRates[contentType]
  const multiplier = tierMultipliers[tier]

  return Math.round(views * baseRate * multiplier * 100) / 100
}
