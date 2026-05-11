/**
 * API 请求验证 Schemas
 * 使用 Zod 进行运行时类型校验，保护 API 端点安全
 */

import { z } from 'zod'

// ─────────────────────────────────────────
// Codes API
// ─────────────────────────────────────────

export const codeSubmissionSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(50, 'Code must not exceed 50 characters')
    .transform(val => val.trim().toUpperCase()),
  reward_desc: z
    .string()
    .min(3, 'Reward description must be at least 3 characters')
    .max(200, 'Reward description must not exceed 200 characters')
    .transform(val => val.trim()),
  source_url: z
    .string()
    .url('Must be a valid URL')
    .max(500)
    .optional()
    .or(z.literal('')),
})

export type CodeSubmissionInput = z.infer<typeof codeSubmissionSchema>

// ─────────────────────────────────────────
// Subscribe API
// ─────────────────────────────────────────

export const subscribeSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .transform(val => val.toLowerCase().trim()),
  games: z
    .array(z.string().max(100))
    .max(20, 'Cannot subscribe to more than 20 games')
    .optional()
    .default([]),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>

// ─────────────────────────────────────────
// Tier List Vote API
// ─────────────────────────────────────────

export const tierVoteSchema = z.object({
  entry_id: z.string().min(1, 'entry_id is required'),
  tier_list_id: z.string().min(1, 'tier_list_id is required'),
  grade: z.enum(['S', 'A', 'B', 'C', 'D', 'F'], {
    message: 'Grade must be one of: S, A, B, C, D, F',
  }),
})

export type TierVoteInput = z.infer<typeof tierVoteSchema>

// ─────────────────────────────────────────
// Search API
// ─────────────────────────────────────────

export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long')
    .transform(val => val.trim()),
  type: z
    .enum(['all', 'game', 'guide', 'code'])
    .optional()
    .default('all'),
  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(20),
})

export type SearchQueryInput = z.infer<typeof searchQuerySchema>

// ─────────────────────────────────────────
// Games Import API (Internal)
// ─────────────────────────────────────────

export const gameImportItemSchema = z.object({
  igdb_id: z.number().int().positive(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  cover_url: z.string().url().optional().or(z.literal('')),
  screenshots: z.array(z.string().url()).max(10).optional().default([]),
  platforms: z.array(z.string()).optional().default([]),
  genres: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).max(20).optional().default([]),
  developer: z.string().max(100).optional(),
  publisher: z.string().max(100).optional(),
  release_date: z.string().optional(),
  steam_appid: z.number().int().positive().optional(),
  score_opencritic: z.number().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
})

export const gameImportSchema = z.object({
  games: z.array(gameImportItemSchema).min(1).max(500),
})

export type GameImportInput = z.infer<typeof gameImportSchema>

// ─────────────────────────────────────────
// Comment API
// ─────────────────────────────────────────

export const commentSchema = z.object({
  article_id: z.string().min(1, 'article_id is required'),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment must not exceed 2000 characters')
    .transform(val => val.trim()),
  parent_id: z.string().optional(),
})

export type CommentInput = z.infer<typeof commentSchema>

// ─────────────────────────────────────────
// Helper: Parse and validate request body
// ─────────────────────────────────────────

/**
 * 验证请求体，返回解析结果或错误响应
 *
 * 用法:
 *   const result = await validateBody(req, codeSubmissionSchema)
 *   if (!result.success) return result.error
 *   const data = result.data
 */
export async function validateBody<T>(
  req: Request,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; error: Response }> {
  try {
    const rawBody = await req.json()
    const parsed = schema.safeParse(rawBody)

    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))

      const response = Response.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors,
        },
        { status: 400 },
      )

      return { success: false, error: response }
    }

    return { success: true, data: parsed.data }
  } catch {
    const response = Response.json(
      { success: false, error: 'Invalid JSON body', code: 'PARSE_ERROR' },
      { status: 400 },
    )
    return { success: false, error: response }
  }
}

/**
 * 验证 URL 查询参数
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>,
): { success: true; data: T } | { success: false; error: Response } {
  const raw: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    raw[key] = value
  })

  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    const response = Response.json(
      {
        success: false,
        error: 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
      { status: 400 },
    )

    return { success: false, error: response }
  }

  return { success: true, data: parsed.data }
}
