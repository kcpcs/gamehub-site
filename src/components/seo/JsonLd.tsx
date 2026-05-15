/**
 * JSON-LD 结构化数据组件（Server Component）
 * 用于在页面中注入 Schema.org 结构化数据
 * 
 * 使用方式：
 *   <JsonLdScript data={schemaObject} />
 * 
 * 注意：这是 Server Component，适合在 layout.tsx 或 server page 中使用
 */

interface JsonLdScriptProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─────────────────────────────────────────
// Schema 生成器
// ─────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SITE_NAME = 'GameHub'

/**
 * 全站 WebSite Schema（用于首页）
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'The fastest gaming guide hub. Live redeem codes, AI-powered tier lists, walkthroughs and patch notes.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: getOrganizationSchema(),
  }
}

/**
 * Organization Schema
 */
export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/gamehub',
      'https://discord.gg/gamehub',
    ],
  }
}

/**
 * VideoGame Schema（游戏详情）
 */
export function getVideoGameSchema(game: {
  name: string
  slug: string
  description?: string
  image?: string
  genres?: string[]
  platforms?: string[]
  developer?: string
  publisher?: string
  releaseDate?: string
  rating?: number
  ratingCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    url: `${SITE_URL}/games/${game.slug}`,
    description: game.description,
    image: game.image,
    genre: game.genres,
    gamePlatform: game.platforms,
    ...(game.developer && {
      author: { '@type': 'Organization', name: game.developer },
    }),
    ...(game.publisher && {
      publisher: { '@type': 'Organization', name: game.publisher },
    }),
    ...(game.releaseDate && { datePublished: game.releaseDate }),
    ...(game.rating && game.ratingCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: game.rating,
        bestRating: 100,
        worstRating: 0,
        ratingCount: game.ratingCount,
      },
    }),
  }
}

/**
 * Article Schema（攻略/文章）
 */
export function getArticleSchema(article: {
  title: string
  slug: string
  excerpt: string
  content?: string
  coverImage?: string
  publishedAt?: string
  updatedAt?: string
  authorName?: string
  readTime?: number
  gameName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/guides/${article.slug}`,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': article.authorName === SITE_NAME ? 'Organization' : 'Person',
      name: article.authorName || SITE_NAME,
    },
    publisher: getOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/guides/${article.slug}`,
    },
    ...(article.readTime && {
      timeRequired: `PT${article.readTime}M`,
      wordCount: article.readTime * 200,
    }),
    ...(article.gameName && { about: { '@type': 'VideoGame', name: article.gameName } }),
  }
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}` }),
    })),
  }
}

/**
 * CollectionPage Schema（游戏库、攻略列表等）
 */
export function getCollectionPageSchema(page: {
  name: string
  description: string
  url: string
  itemCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    description: page.description,
    url: page.url.startsWith('http') ? page.url : `${SITE_URL}${page.url}`,
    ...(page.itemCount && { numberOfItems: page.itemCount }),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }
}

/**
 * FAQPage Schema（兑换码页面的 FAQ）
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * ItemList Schema（Tier List、排行榜等）
 */
export function getItemListSchema(list: {
  name: string
  description: string
  url: string
  items: { name: string; position: number; url?: string; image?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.name,
    description: list.description,
    url: list.url.startsWith('http') ? list.url : `${SITE_URL}${list.url}`,
    numberOfItems: list.items.length,
    itemListElement: list.items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      ...(item.url && { url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}` }),
      ...(item.image && { image: item.image }),
    })),
  }
}

export { SITE_URL, SITE_NAME }
