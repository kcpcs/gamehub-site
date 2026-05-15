import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/admin-auth'

interface BackupMetadata {
  id: string
  filename: string
  size: number
  created_at: string
  type: 'full' | 'incremental'
  status: 'completed' | 'failed' | 'in_progress'
}

const BACKUP_DIR = path.join(process.cwd(), 'backups')

function safeBackupPath(filename: string): string {
  const safeName = path.basename(filename)
  if (!safeName || safeName.includes('..') || safeName !== filename) {
    throw new Error('Invalid filename')
  }
  const resolved = path.resolve(BACKUP_DIR, safeName)
  if (!resolved.startsWith(path.resolve(BACKUP_DIR))) {
    throw new Error('Path traversal detected')
  }
  return resolved
}

async function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

// GET /api/admin/backup - 获取备份列表或创建备�?
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'list'

    if (action === 'list') {
      await ensureBackupDir()
      
      const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
          const filePath = path.join(BACKUP_DIR, f)
          const stats = fs.statSync(filePath)
          return {
            id: f.replace('.json', ''),
            filename: f,
            size: stats.size,
            created_at: stats.mtime.toISOString(),
            type: 'full' as const,
            status: 'completed' as const,
          }
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      return NextResponse.json({
        success: true,
        data: files,
      })
    }

    if (action === 'download') {
      const filename = searchParams.get('filename')
      if (!filename) {
        return NextResponse.json(
          { success: false, error: 'filename is required' },
          { status: 400 }
        )
      }

      let filePath: string
      try {
        filePath = safeBackupPath(filename)
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid filename' },
          { status: 400 }
        )
      }
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { success: false, error: 'Backup file not found' },
          { status: 404 }
        )
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${path.basename(filename)}"`,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Backup list error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list backups' },
      { status: 500 }
    )
  }
}

// POST /api/admin/backup - 创建备份
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    await ensureBackupDir()

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.json`
    const filePath = path.join(BACKUP_DIR, filename)

    const [games, articles, codes, users, tierLists, comments] = await Promise.all([
      db.game.findMany({ include: { articles: true, codes: true, tier_lists: true } }),
      db.article.findMany({ include: { game: true, author: true } }),
      db.gameCode.findMany({ include: { game: true } }),
      db.user.findMany(),
      db.tierList.findMany({ include: { game: true } }),
      db.comment.findMany({ include: { article: true } }),
    ])

    const backup = {
      version: '1.0',
      created_at: new Date().toISOString(),
      database: {
        games,
        articles,
        codes,
        users,
        tierLists,
        comments,
      },
      metadata: {
        total_games: games.length,
        total_articles: articles.length,
        total_codes: codes.length,
        total_users: users.length,
        total_tier_lists: tierLists.length,
        total_comments: comments.length,
      },
    }

    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2))

    const stats = fs.statSync(filePath)

    return NextResponse.json({
      success: true,
      data: {
        id: filename.replace('.json', ''),
        filename,
        size: stats.size,
        created_at: stats.mtime.toISOString(),
        type: 'full',
        status: 'completed',
        metadata: backup.metadata,
      },
      message: 'Backup created successfully',
    })
  } catch (error) {
    console.error('Backup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/backup - 删除备份
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)
    const searchParams = request.nextUrl.searchParams
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'filename is required' },
        { status: 400 }
      )
    }

    await ensureBackupDir()

    let filePath: string
    try {
      filePath = safeBackupPath(filename)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid filename' },
        { status: 400 }
      )
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Backup file not found' },
        { status: 404 }
      )
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully',
    })
  } catch (error) {
    console.error('Delete backup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete backup' },
      { status: 500 }
    )
  }
}
