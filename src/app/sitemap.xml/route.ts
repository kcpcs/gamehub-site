import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const [games, articles] = await Promise.all([
    db.game.findMany({ select: { slug: true, updated_at: true } }),
    db.article.findMany({ 
      where: { status: 'published' },
      select: { slug: true, updated_at: true }
    })
  ])

  const gameUrls = games.map(game => `
    <url>
      <loc>${baseUrl}/games/${game.slug}</loc>
      <lastmod>${new Date(game.updated_at).toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>
  `).join('')

  const articleUrls = articles.map(article => `
    <url>
      <loc>${baseUrl}/guides/${article.slug}</loc>
      <lastmod>${new Date(article.updated_at).toISOString()}</lastmod>
      <priority>0.9</priority>
    </url>
  `).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/games</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/codes</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/tier-list</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>
  ${gameUrls}
  ${articleUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}