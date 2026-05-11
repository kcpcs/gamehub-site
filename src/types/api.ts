// ============================================================
// API RESPONSE TYPES  —  READ-ONLY CONTRACT
// All API routes MUST return these shapes. Trae CN must consume these.
// ============================================================

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  success: false
  error: string
  code?: string   // e.g. 'NOT_FOUND', 'UNAUTHORIZED', 'VALIDATION_ERROR'
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  has_next: boolean
  has_prev: boolean
}

// ── Convenience helpers (used in components) ─────────────────

export function isApiSuccess<T>(r: ApiResponse<T>): r is ApiSuccess<T> {
  return r.success === true
}

export function isApiError<T>(r: ApiResponse<T>): r is ApiError {
  return r.success === false
}
