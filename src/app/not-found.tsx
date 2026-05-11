import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
          404
        </div>
        
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Go Home
          </Link>
          <Link
            href="/games"
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              color: 'var(--text-primary)',
              border: '1px solid var(--border)'
            }}
          >
            Browse Games
          </Link>
        </div>
        
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Popular Pages
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/guides" className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:scale-105" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              Guides
            </Link>
            <Link href="/codes" className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:scale-105" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              Codes
            </Link>
            <Link href="/tier-list" className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:scale-105" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              Tier Lists
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}