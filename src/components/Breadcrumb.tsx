import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items

  return (
    <nav className="flex items-center gap-1.5 text-sm overflow-x-auto py-2" aria-label="Breadcrumb">
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1

        return (
          <div key={index} className="flex items-center gap-1.5 shrink-0">
            {index > 0 && (
              <ChevronRight size={14} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
            )}

            {isLast || !item.href ? (
              <span
                className="font-medium px-2.5 py-1 rounded-lg"
                style={{
                  color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isLast ? 'var(--bg-elevated)' : 'transparent'
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="px-2.5 py-1 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label === 'Home' ? (
                  <Home size={14} />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export function getGameBreadcrumbs(gameName: string, gameSlug: string) {
  return [
    { label: 'Games', href: '/games' },
    { label: gameName, href: `/games/${gameSlug}` }
  ]
}

export function getGuideBreadcrumbs(gameName: string, gameSlug: string, guideTitle: string) {
  return [
    { label: 'Guides', href: '/guides' },
    { label: gameName, href: `/guides?game=${gameSlug}` },
    { label: guideTitle }
  ]
}

export function getCodesBreadcrumbs(gameName: string, gameSlug: string) {
  return [
    { label: 'Codes', href: '/codes' },
    { label: gameName, href: `/codes/${gameSlug}` }
  ]
}

export function getTierListBreadcrumbs(gameName: string, gameSlug: string, category?: string) {
  return [
    { label: 'Tier Lists', href: '/tier-list' },
    { label: gameName, href: `/tier-list/${gameSlug}` },
    ...(category ? [{ label: category.charAt(0).toUpperCase() + category.slice(1) }] : [])
  ]
}
