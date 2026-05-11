/**
 * OG Image Generation API
 * 使用 next/og (Vercel @vercel/og) 动态生成 OpenGraph 图片
 *
 * 用法:
 *   /api/og?title=GameHub&subtitle=Best%20Gaming%20Guides&type=default
 *   /api/og?title=Genshin+Impact&type=game&image=https://...
 *   /api/og?title=Top+Characters&type=tierlist&game=Genshin+Impact
 *
 * 参数:
 *   title     — 主标题（必填）
 *   subtitle  — 副标题（可选）
 *   type      — 图片类型: default | game | guide | tierlist | codes
 *   image     — 背景图URL（可选）
 *   game      — 游戏名称（可选，用于显示标签）
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'GameHub'
  const subtitle = searchParams.get('subtitle') || ''
  const type = searchParams.get('type') || 'default'
  const image = searchParams.get('image') || ''
  const game = searchParams.get('game') || ''

  // 根据类型选择不同的配色方案
  const themes: Record<string, { accent: string; badge: string; badgeText: string }> = {
    default: { accent: '#7c3aed', badge: '#7c3aed', badgeText: 'Gaming Guide Hub' },
    game: { accent: '#3fb950', badge: '#3fb950', badgeText: 'Game' },
    guide: { accent: '#58a6ff', badge: '#58a6ff', badgeText: 'Guide' },
    tierlist: { accent: '#d29922', badge: '#d29922', badgeText: 'Tier List' },
    codes: { accent: '#f85149', badge: '#f85149', badgeText: 'Redeem Codes' },
  }

  const theme = themes[type] || themes.default

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          background: image
            ? `linear-gradient(to bottom, rgba(13,17,23,0.4), rgba(13,17,23,0.95)), url(${image})`
            : `linear-gradient(135deg, #0d1117 0%, #1a0533 50%, #0d1117 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: '"Segoe UI", "Noto Sans", sans-serif',
        }}
      >
        {/* Logo & Site Name */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: theme.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white',
              fontWeight: 800,
            }}
          >
            G
          </div>
          <span style={{ fontSize: '22px', color: '#e6edf3', fontWeight: 700 }}>
            GameHub
          </span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              background: `${theme.badge}22`,
              border: `2px solid ${theme.badge}88`,
              color: theme.badge,
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            {game || theme.badgeText}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? '42px' : '54px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            maxWidth: '900px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '24px',
              color: '#8b949e',
              marginTop: '16px',
              maxWidth: '800px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Bottom gradient bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.accent}, #9f67ff, ${theme.accent})`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
