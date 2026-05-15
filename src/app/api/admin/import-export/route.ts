import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

// POST /api/admin/import-export - 批量导入数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data, mode = 'create' } = body

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, data' },
        { status: 400 }
      )
    }

    const result = { created: 0, updated: 0, skipped: 0, errors: [] as string[] }

    switch (type) {
      case 'games':
        for (const item of data) {
          try {
            if (!item.name || !item.slug) {
              result.errors.push(`Missing required fields: name, slug`)
              result.skipped++
              continue
            }

            const existing = await db.game.findUnique({ where: { slug: item.slug } })

            if (existing && mode === 'skip') {
              result.skipped++
              continue
            }

            if (existing) {
              await db.game.update({
                where: { id: existing.id },
                data: {
                  name: item.name || existing.name,
                  cover_url: item.cover_url || existing.cover_url,
                  platforms: item.platforms || existing.platforms,
                  genres: item.genres || existing.genres,
                  description: item.description || existing.description,
                  developer: item.developer,
                  publisher: item.publisher,
                },
              })
              result.updated++
            } else {
              await db.game.create({
                data: {
                  name: item.name,
                  slug: item.slug,
                  cover_url: item.cover_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20guide%20cover%20art%20${encodeURIComponent(item.name || item.slug)}%20gaming%20dark%20theme%20fantasy%20style&image_size=landscape_16_9`,
                  platforms: item.platforms || [],
                  genres: item.genres || [],
                  description: item.description,
                  developer: item.developer,
                  publisher: item.publisher,
                },
              })
              result.created++
            }
          } catch (err) {
            result.errors.push(`Failed to process game: ${item.name || item.slug}`)
            result.skipped++
          }
        }
        break

      case 'articles':
        for (const item of data) {
          try {
            if (!item.title || !item.slug) {
              result.errors.push(`Missing required fields: title, slug`)
              result.skipped++
              continue
            }

            const existing = await db.article.findUnique({ where: { slug: item.slug } })

            if (existing && mode === 'skip') {
              result.skipped++
              continue
            }

            if (existing) {
              await db.article.update({
                where: { id: existing.id },
                data: {
                  title: item.title || existing.title,
                  content: item.content || existing.content,
                  article_type: item.article_type || existing.article_type,
                  status: item.status || existing.status,
                },
              })
              result.updated++
            } else {
              await db.article.create({
                data: {
                  title: item.title,
                  slug: item.slug,
                  content: item.content || '',
                  article_type: item.article_type || 'guide',
                  status: item.status || 'draft',
                  excerpt: item.excerpt || '',
                  cover_url: item.cover_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20guide%20cover%20art%20${encodeURIComponent(item.name || item.slug)}%20gaming%20dark%20theme%20fantasy%20style&image_size=landscape_16_9`,
                  cover_alt: item.cover_alt || item.title || '',
                  seo_title: item.seo_title || item.title || '',
                  seo_description: item.seo_description || item.excerpt || '',
                  published_at: item.status === 'published' ? new Date() : null,
                },
              })
              result.created++
            }
          } catch (err) {
            result.errors.push(`Failed to process article: ${item.title || item.slug}`)
            result.skipped++
          }
        }
        break

      case 'codes':
        for (const item of data) {
          try {
            if (!item.code || !item.game_id) {
              result.errors.push(`Missing required fields: code, game_id`)
              result.skipped++
              continue
            }

            const existing = await db.gameCode.findFirst({
              where: { code: item.code, game_id: item.game_id },
            })

            if (existing && mode === 'skip') {
              result.skipped++
              continue
            }

            if (existing) {
              await db.gameCode.update({
                where: { id: existing.id },
                data: {
                  reward_desc: item.reward_desc || existing.reward_desc,
                  status: item.status || existing.status,
                },
              })
              result.updated++
            } else {
              await db.gameCode.create({
                data: {
                  code: item.code,
                  game_id: item.game_id,
                  reward_desc: item.reward_desc || '',
                  source: item.source || 'official',
                  status: item.status || 'active',
                  expires_at: item.expires_at ? new Date(item.expires_at) : null,
                },
              })
              result.created++
            }
          } catch (err) {
            result.errors.push(`Failed to process code: ${item.code}`)
            result.skipped++
          }
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: `Unknown import type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Import completed: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import data' },
      { status: 500 }
    )
  }
}

// GET /api/admin/import-export - 导出数据
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const format = searchParams.get('format') || 'json'
    const ids = searchParams.get('ids')

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'type is required' },
        { status: 400 }
      )
    }

    let data: any[] = []
    const where = ids ? { id: { in: ids.split(',') } } : {}

    switch (type) {
      case 'games':
        data = await db.game.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            cover_url: true,
            platforms: true,
            genres: true,
            description: true,
            developer: true,
            publisher: true,
            guide_count: true,
            code_count: true,
            created_at: true,
          },
        })
        break

      case 'articles':
        data = await db.article.findMany({
          where,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            article_type: true,
            status: true,
            view_count: true,
            read_time: true,
            game_id: true,
            created_at: true,
            published_at: true,
          },
        })
        break

      case 'codes':
        data = await db.gameCode.findMany({
          where,
          select: {
            id: true,
            code: true,
            game_id: true,
            reward_desc: true,
            status: true,
            source: true,
            expires_at: true,
            created_at: true,
          },
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: `Unknown export type: ${type}` },
          { status: 400 }
        )
    }

    if (format === 'csv') {
      if (data.length === 0) {
        return NextResponse.json({ success: true, data: '' })
      }

      const headers = Object.keys(data[0])
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = (row as any)[header]
            if (value === null || value === undefined) return ''
            if (Array.isArray(value)) return JSON.stringify(value)
            if (typeof value === 'string' && value.includes(',')) return `"${value}"`
            return String(value)
          }).join(',')
        )
      ]

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
