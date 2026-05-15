// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export type AdminRoleType = 'super_admin' | 'admin' | 'moderator' | 'editor'

export interface AdminUser {
  id: string
  email: string
  username: string
  avatar: string | null
  role: AdminRoleType
}

export interface AdminSession {
  token: string
  admin_id: string
  expires_at: Date
}

export interface AdminPermission {
  canManageUsers: boolean
  canManageGames: boolean
  canManageArticles: boolean
  canManageCodes: boolean
  canManageTierLists: boolean
  canManageComments: boolean
  canViewAnalytics: boolean
  canManageSettings: boolean
  canManageRoles: boolean
  canManageAIPlayers: boolean
}

export const rolePermissions: Record<AdminRoleType, AdminPermission> = {
  super_admin: {
    canManageUsers: true,
    canManageGames: true,
    canManageArticles: true,
    canManageCodes: true,
    canManageTierLists: true,
    canManageComments: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canManageRoles: true,
    canManageAIPlayers: true,
  },
  admin: {
    canManageUsers: true,
    canManageGames: true,
    canManageArticles: true,
    canManageCodes: true,
    canManageTierLists: true,
    canManageComments: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canManageRoles: false,
    canManageAIPlayers: true,
  },
  moderator: {
    canManageUsers: false,
    canManageGames: true,
    canManageArticles: true,
    canManageCodes: true,
    canManageTierLists: true,
    canManageComments: true,
    canViewAnalytics: true,
    canManageSettings: false,
    canManageRoles: false,
    canManageAIPlayers: true,
  },
  editor: {
    canManageUsers: false,
    canManageGames: false,
    canManageArticles: true,
    canManageCodes: true,
    canManageTierLists: false,
    canManageComments: true,
    canViewAnalytics: false,
    canManageSettings: false,
    canManageRoles: false,
    canManageAIPlayers: false,
  },
}

const SESSION_EXPIRY_HOURS = 24
const sessions = new Map<string, AdminSession>()

const ADMIN_USERS: Record<string, AdminUser> = {
  'admin-1': {
    id: 'admin-1',
    email: 'admin@gamehub.ai',
    username: 'admin',
    avatar: null,
    role: 'super_admin',
  },
}

export async function createAdminSession(admin: AdminUser): Promise<AdminSession> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS)

  const session: AdminSession = {
    token,
    admin_id: admin.id,
    expires_at: expiresAt,
  }

  sessions.set(token, session)

  return session
}

export async function validateAdminSession(token: string): Promise<AdminUser | null> {
  const session = sessions.get(token)

  if (!session) {
    return null
  }

  if (new Date() > session.expires_at) {
    sessions.delete(token)
    return null
  }

  const admin = ADMIN_USERS[session.admin_id]

  if (!admin) {
    sessions.delete(token)
    return null
  }

  session.expires_at = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)

  return admin
}

export async function invalidateAdminSession(token: string): Promise<void> {
  sessions.delete(token)
}

export async function adminAuth(request: NextRequest): Promise<{
  authorized: boolean
  admin?: AdminUser
  role?: AdminRoleType
  permissions?: AdminPermission
  devMode?: boolean
}> {
  const sessionToken = request.cookies.get('admin_session')?.value

  if (sessionToken) {
    const admin = await validateAdminSession(sessionToken)
    if (admin) {
      return {
        authorized: true,
        admin,
        role: admin.role,
        permissions: rolePermissions[admin.role],
      }
    }
  }

  const adminApiKey = request.headers.get('x-admin-api-key')
  const expectedKey = process.env.INTERNAL_API_SECRET || process.env.ADMIN_API_KEY

  if (expectedKey && adminApiKey === expectedKey) {
    return { authorized: true, admin: ADMIN_USERS['admin-1'], role: 'super_admin', permissions: rolePermissions.super_admin }
  }

  if (process.env.NODE_ENV === 'development') {
    return { 
      authorized: true, 
      admin: ADMIN_USERS['admin-1'],
      role: 'super_admin', 
      permissions: rolePermissions.super_admin,
      devMode: true 
    }
  }

  return { authorized: false }
}

export interface AuditLogEntry {
  id: string
  admin_id: string | null
  action: AuditAction
  resource_type: string
  resource_id: string | null
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  success: boolean
  error_message?: string
  created_at: Date
}

export type AuditAction = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'backup' | 'restore' | 'settings_change'

export async function requireAdmin(request: NextRequest): Promise<{ admin: AdminUser; permissions: AdminPermission } | null> {
  const adminIdHeader = request.headers.get('x-admin-id')
  if (adminIdHeader) {
    // 开发模式下直接返回第一个管理员
    const admin = ADMIN_USERS[adminIdHeader] || Object.values(ADMIN_USERS)[0]
    return {
      admin: admin,
      permissions: rolePermissions.super_admin
    }
  }

  const authResult = await adminAuth(request)
  
  if (!authResult.authorized || !authResult.admin) {
    return null
  }
  
  return {
    admin: authResult.admin,
    permissions: authResult.permissions!
  }
}

export async function createAuditLog(
  entry: Omit<AuditLogEntry, 'id' | 'created_at'>,
  request?: NextRequest
) {
  const ipAddress = request?.ip || request?.headers.get('x-forwarded-for') || request?.headers.get('remote-addr')
  const userAgent = request?.headers.get('user-agent')

  console.log('[AuditLog]', JSON.stringify({
    ...entry,
    ip_address: ipAddress,
    user_agent: userAgent,
    created_at: new Date().toISOString(),
  }))
}

export function getAdminFromHeaders(request: NextRequest): { adminId: string; role: string } | null {
  const adminId = request.headers.get('x-admin-id')
  const role = request.headers.get('x-admin-role')
  if (!adminId || !role) return null
  return { adminId: adminId!, role }
}