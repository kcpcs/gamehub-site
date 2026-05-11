import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type') || 'article'
  const title = searchParams.get('title') || 'GameHub'
  const game = searchParams.get('game') || ''
  const score = searchParams.get('score')

  const fontData = await fetch(
    new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2')
  ).then(res => res.arrayBuffer())

  let bgColor = '#0d1117'
  let accentColor = '#7c3aed'

  if (type === 'game') {
    bgColor = '#161b22'
    accentColor = '#22c55e'
  } else if (type === 'tier-list') {
    bgColor = '#1c2333'
    accentColor = '#f59e0b'
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: bgColor,
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#e6edf3',
              letterSpacing: '-0.5px',
            }}
          >
            GameHub
          </span>
        </div>

        {game && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#8b949e',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {game}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '900px',
          }}
        >
          <h1
            style={{
              fontSize: type === 'article' ? '56px' : '64px',
              fontWeight: 'bold',
              color: '#e6edf3',
              lineHeight: 1.1,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h1>

          {score && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: getScoreColor(Number(score)),
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {score}
              </div>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#8b949e',
                }}
              >
                / 100
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle at center, ${accentColor}40 0%, transparent 70%)`,
            borderRadius: '0 0 0 100%',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle at center, ${accentColor}20 0%, transparent 70%)`,
            borderRadius: '100% 0 0 0',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontData,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e'
  if (score >= 75) return '#84cc16'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}
