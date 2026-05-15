import { db } from '@/lib/db'

export async function GET() {
  try {
    const [games, articles] = await Promise.all([
      db.game.findMany({ select: { slug: true, updated_at: true } }),
      db.article.findMany({ 
        where: { status: 'published' },
        select: { slug: true, updated_at: true } 
      }),
    ])

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const currentDate = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/games</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/codes</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/tier-list</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>`

    games.forEach(game => {
      const lastMod = game.updated_at?.toISOString().split('T')[0] || currentDate
      sitemap += `
  <url>
    <loc>${baseUrl}/games/${game.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/codes/${game.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>`
    })

    articles.forEach(article => {
      const lastMod = article.updated_at?.toISOString().split('T')[0] || currentDate
      sitemap += `
  <url>
    <loc>${baseUrl}/guides/${article.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    })
  }
}