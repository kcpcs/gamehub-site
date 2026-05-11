interface ArticleWithGame {
  id: string
  slug: string
  title: string
  article_type: string
  excerpt: string
  read_time: number
  view_count: number
  share_count: number
  published_at: Date | null
  game?: {
    id: string
    slug: string
    name: string
    cover_url: string
  } | null
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
  articleTitle: string
  articleUrl?: string
  datePublished?: string
  dateModified?: string
  author?: string
}

export function FAQSchema({
  faqs,
  articleTitle,
  articleUrl,
  datePublished,
  dateModified,
  author
}: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: author ? {
          '@type': 'Person',
          name: author
        } : undefined,
        datePublished: datePublished,
        dateModified: dateModified
      }
    })),
    ...(articleUrl && {
      url: articleUrl
    }),
    ...(datePublished && {
      datePublished: datePublished
    }),
    ...(dateModified && {
      dateModified: dateModified
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

export function extractFAQsFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = []
  const lines = content.split('\n')

  let currentQuestion = ''
  let currentAnswer = ''
  let inAnswer = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('## Q:') || trimmedLine.startsWith('## **Q:') || /^[Qq]\.\s/.test(trimmedLine)) {
      if (currentQuestion && currentAnswer) {
        const cleanQuestion = currentQuestion
          .replace(/^##\s*/, '')
          .replace(/\*\*Q:\*\*\s*/i, '')
          .replace(/^Q:\s*/i, '')
          .trim()

        const cleanAnswer = currentAnswer.trim()

        if (cleanQuestion && cleanAnswer && cleanAnswer.length > 20) {
          faqs.push({
            question: cleanQuestion,
            answer: cleanAnswer
          })
        }
      }

      currentQuestion = trimmedLine.replace(/^##\s*/, '').replace(/\*\*Q:\*\*\s*/i, '').replace(/^Q:\s*/i, '')
      currentAnswer = ''
      inAnswer = true
    } else if (inAnswer && trimmedLine.startsWith('**A:**')) {
      currentAnswer = trimmedLine.replace('**A:**', '').trim()
    } else if (inAnswer && trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*')) {
      if (currentAnswer) {
        currentAnswer += ' ' + trimmedLine
      }
    } else if (inAnswer && (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('##'))) {
      inAnswer = false
    }
  }

  if (currentQuestion && currentAnswer) {
    const cleanQuestion = currentQuestion
      .replace(/^##\s*/, '')
      .replace(/\*\*Q:\*\*\s*/i, '')
      .replace(/^Q:\s*/i, '')
      .trim()

    const cleanAnswer = currentAnswer.trim()

    if (cleanQuestion && cleanAnswer && cleanAnswer.length > 20) {
      faqs.push({
        question: cleanQuestion,
        answer: cleanAnswer
      })
    }
  }

  return faqs
}

export function ArticleSchema({
  article,
  url
}: {
  article: ArticleWithGame
  url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.game?.cover_url || 'https://gamehub.com/og-image.jpg',
    author: {
      '@type': 'Organization',
      name: 'GameHub'
    },
    publisher: {
      '@type': 'Organization',
      name: 'GameHub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gamehub.com/logo.png'
      }
    },
    datePublished: article.published_at ? new Date(article.published_at).toISOString() : undefined,
    dateModified: article.published_at ? new Date(article.published_at).toISOString() : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    articleSection: article.article_type,
    wordCount: Math.round(article.read_time * 200),
    timeRequired: `PT${article.read_time}M`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

export function BreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
