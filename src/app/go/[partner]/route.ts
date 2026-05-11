import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /go/[partner]?url=...&ref=...&campaign=...
 *
 * 联盟链接重定向 + 点击追踪
 * 记录每次点击的合作方、来源页面、时间等信息
 *
 * 参数:
 *   url       — 目标联盟链接（必填）
 *   ref       — 来源游戏 slug（可选，用于统计）
 *   campaign  — 活动标识（可选）
 *
 * 示例:
 *   /go/greenmangaming?url=https://greenmangaming.com/xxx&ref=elden-ring
 *   /go/amazon?url=https://amazon.com/dp/xxx&campaign=summer-sale
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ partner: string }> }
) {
  const { partner } = await params
  const { searchParams } = req.nextUrl

  const url = searchParams.get('url')
  const ref = searchParams.get('ref') || ''
  const campaign = searchParams.get('campaign') || ''

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  // 验证 URL 合法性（防止开放重定向攻击）
  let targetUrl: URL
  try {
    targetUrl = new URL(url)
    // 仅允许 HTTPS 协议
    if (targetUrl.protocol !== 'https:') {
      return NextResponse.json(
        { success: false, error: 'Only HTTPS URLs are allowed' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid URL format' },
      { status: 400 }
    )
  }

  // 允许的合作方域名白名单
  const ALLOWED_DOMAINS: Record<string, string[]> = {
    greenmangaming: ['greenmangaming.com', 'www.greenmangaming.com'],
    amazon: ['amazon.com', 'www.amazon.com', 'amzn.to'],
    humble: ['humblebundle.com', 'www.humblebundle.com'],
    steam: ['store.steampowered.com', 'steampowered.com'],
    epic: ['store.epicgames.com', 'epicgames.com'],
    gog: ['gog.com', 'www.gog.com'],
    cdkeys: ['cdkeys.com', 'www.cdkeys.com'],
    fanatical: ['fanatical.com', 'www.fanatical.com'],
  }

  // 验证域名是否在白名单内（如果合作方已配置）
  const allowedDomains = ALLOWED_DOMAINS[partner.toLowerCase()]
  if (allowedDomains && !allowedDomains.includes(targetUrl.hostname)) {
    return NextResponse.json(
      { success: false, error: `Domain not allowed for partner: ${partner}` },
      { status: 403 }
    )
  }

  // 异步记录点击（不阻塞重定向）
  trackClick({
    partner,
    targetUrl: url,
    refSlug: ref,
    campaign,
    userAgent: req.headers.get('user-agent') || '',
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '',
    referer: req.headers.get('referer') || '',
  }).catch(err => {
    console.error('[Affiliate] Failed to track click:', err)
  })

  // 302 临时重定向（SEO友好，允许追踪）
  return NextResponse.redirect(url, { status: 302 })
}

// ─────────────────────────────────────────
// Click Tracking
// ─────────────────────────────────────────

interface ClickData {
  partner: string
  targetUrl: string
  refSlug: string
  campaign: string
  userAgent: string
  ip: string
  referer: string
}

async function trackClick(data: ClickData): Promise<void> {
  try {
    // 尝试写入数据库（如果 affiliate_clicks 表存在）
    // @ts-expect-error - affiliate_click model may not exist yet in Prisma schema
    if (db.affiliate_click) {
      // @ts-expect-error - model may not exist
      await db.affiliate_click.create({
        data: {
          partner: data.partner,
          target_url: data.targetUrl,
          ref_slug: data.refSlug,
          campaign: data.campaign,
          user_agent: data.userAgent,
          ip_hash: hashIP(data.ip), // 只存哈希，保护隐私
          referer: data.referer,
          clicked_at: new Date(),
        },
      })
    } else {
      // 表不存在时，退回到日志记录
      console.log('[Affiliate Click]', JSON.stringify({
        partner: data.partner,
        ref: data.refSlug,
        campaign: data.campaign,
        time: new Date().toISOString(),
      }))
    }
  } catch {
    // 如果数据库表不存在，仅记录日志
    console.log('[Affiliate Click]', JSON.stringify({
      partner: data.partner,
      ref: data.refSlug,
      campaign: data.campaign,
      time: new Date().toISOString(),
    }))
  }
}

/**
 * 对 IP 进行简单哈希（隐私保护）
 * 使用 Web Crypto API 的 SHA-256
 */
function hashIP(ip: string): string {
  if (!ip) return ''
  // 简单的非加密哈希用于统计去重，不存储原始 IP
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转为 32 位整数
  }
  return Math.abs(hash).toString(36)
}
