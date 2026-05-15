import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/admin-auth'

const SETTINGS_PATH = path.join(process.cwd(), 'site-settings.json')

const DEFAULT_SETTINGS = {
  siteName: 'GameHub',
  tagline: 'Your Ultimate Gaming Guide Hub',
  defaultLanguage: 'en',
  seo: {
    defaultTitle: 'GameHub - Gaming Guides, Tier Lists & Codes',
    defaultDescription: 'Discover the best gaming guides, tier lists, redemption codes, and strategies for your favorite games.',
    defaultKeywords: ['gaming', 'guides', 'tier lists', 'game codes', 'walkthroughs'],
  },
  socialLinks: {
    twitter: '',
    discord: '',
    youtube: '',
    reddit: '',
  },
  features: {
    aiPlayersEnabled: true,
    commentsEnabled: true,
    codeSubmissionEnabled: true,
  },
  smtp: {
    host: '',
    port: 587,
    user: '',
    configured: false,
  },
  apiKeys: {
    igdbConfigured: false,
    steamConfigured: false,
    openaiConfigured: false,
  },
}

function readSettings(): any {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (error) {
    console.error('Error reading settings file:', error)
  }
  return { ...DEFAULT_SETTINGS }
}

function writeSettings(settings: any): void {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8')
}

// GET /api/admin/settings - 获取网站设置
export async function GET() {
  try {
    await requireAdmin(request)
    const settings = readSettings()

    // Enrich with environment-detected status
    settings.apiKeys = {
      igdbConfigured: !!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET),
      steamConfigured: !!process.env.STEAM_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    }

    settings.smtp = {
      ...settings.smtp,
      configured: !!(settings.smtp.host && settings.smtp.user),
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - 更新网站设置
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()

    // Read current settings and merge with incoming
    const current = readSettings()

    const updated = {
      ...current,
      ...body,
      // Deep merge nested objects
      seo: { ...current.seo, ...(body.seo || {}) },
      socialLinks: { ...current.socialLinks, ...(body.socialLinks || {}) },
      features: { ...current.features, ...(body.features || {}) },
      smtp: { ...current.smtp, ...(body.smtp || {}) },
    }

    // Don't persist apiKeys status (it's read from env)
    delete updated.apiKeys

    writeSettings(updated)

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Settings saved successfully',
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
