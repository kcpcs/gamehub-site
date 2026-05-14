'use client'

export default function AchievementsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb placeholder */}
      <div className="mb-8">
        <div className="h-5 w-40 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      </div>

      {/* Title placeholder */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        <div className="h-5 w-96 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      </div>

      {/* Stats grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="rounded-xl p-6" 
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="text-center space-y-2">
              <div className="h-10 w-24 mx-auto rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-5 w-32 mx-auto rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Achievements grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="rounded-xl p-6" 
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="h-5 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                  <div className="h-6 w-12 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                </div>
                <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
