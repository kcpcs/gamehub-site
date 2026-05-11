import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },
  outputFileTracingIncludes: {
    "/api/admin/auth/login": ["./dev.db"],
    "/api/admin/dashboard": ["./dev.db"],
    "/api/admin/games": ["./dev.db"],
    "/api/admin/games/[id]": ["./dev.db"],
    "/api/admin/articles": ["./dev.db"],
    "/api/admin/articles/[id]": ["./dev.db"],
    "/api/admin/codes": ["./dev.db"],
    "/api/admin/codes/[id]": ["./dev.db"],
    "/api/admin/users": ["./dev.db"],
    "/api/admin/roles": ["./dev.db"],
    "/api/admin/roles/[id]": ["./dev.db"],
    "/api/admin/subscribers": ["./dev.db"],
    "/api/admin/subscribers/[id]": ["./dev.db"],
    "/api/admin/ai-players": ["./dev.db"],
    "/api/admin/ai-players/stats": ["./dev.db"],
    "/api/admin/ai-players/activity-logs": ["./dev.db"],
    "/api/admin/ai-scheduler": ["./dev.db"],
    "/api/admin/import-export": ["./dev.db"],
    "/api/admin/backup": ["./dev.db"],
    "/api/admin/logs": ["./dev.db"],
    "/api/admin/audit-logs": ["./dev.db"],
    "/api/admin/admin-users": ["./dev.db"],
    "/api/admin/admin-users/[id]": ["./dev.db"],
    "/api/games": ["./dev.db"],
    "/api/games/[slug]": ["./dev.db"],
    "/api/guides": ["./dev.db"],
    "/api/guides/[slug]": ["./dev.db"],
    "/api/articles/likes": ["./dev.db"],
    "/api/codes/[game]": ["./dev.db"],
    "/api/comments/[slug]": ["./dev.db"],
    "/api/tierlist/[game]": ["./dev.db"],
    "/api/tierlist/vote": ["./dev.db"],
    "/api/search": ["./dev.db"],
    "/api/subscribe": ["./dev.db"],
    "/api/subscribe/discord": ["./dev.db"],
    "/api/health": ["./dev.db"],
    "/api/internal/articles": ["./dev.db"],
    "/api/internal/codes/import": ["./dev.db"],
    "/api/internal/games/import": ["./dev.db"],
    "/api/internal/generate": ["./dev.db"],
    "/api/internal/patch-notes": ["./dev.db"],
    "/api/auth/login": ["./dev.db"],
    "/api/auth/register": ["./dev.db"],
    "/api/auth/[...nextauth]": ["./dev.db"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
