export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const robots = `User-agent: *
Allow: /
Allow: /games/
Allow: /codes/
Allow: /guides/
Allow: /tier-list/
Allow: /api/

Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/

Sitemap: ${baseUrl}/sitemap.xml
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}