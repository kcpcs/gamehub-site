const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GameHub',
  url: siteUrl,
  description: 'The fastest gaming guide hub. Live redeem codes, AI-powered tier lists, walkthroughs and patch notes.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'GameHub',
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
    },
  },
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GameHub',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://twitter.com/gamehub',
    'https://github.com/gamehub',
  ],
}

export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  author?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/guides/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'GameHub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GameHub',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    image: article.image ? [article.image] : [],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/guides/${article.slug}`,
    },
  }
}

export function generateGameSchema(game: {
  name: string
  slug: string
  description?: string
  image?: string
  genre?: string[]
  platform?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: `${siteUrl}/games/${game.slug}`,
    image: game.image,
    genre: game.genre,
    gamePlatform: game.platform,
    publisher: {
      '@type': 'Organization',
      name: 'GameHub',
    },
  }
}