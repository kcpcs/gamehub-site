export function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="aspect-video" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      </div>
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="aspect-video" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        <div className="h-3 w-full rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
        <div className="h-3 w-4/5 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
      </div>
    </div>
  )
}

export function GameDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-4 w-24 rounded mb-8" style={{ backgroundColor: 'var(--bg-surface)' }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }} />
          <div className="h-8 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-8 w-20 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-8 w-20 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }} />
          </div>
          <div className="rounded-xl p-6 space-y-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="h-6 w-1/3 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            <div className="space-y-2">
              <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="h-6 w-24 rounded mb-4" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            <div className="space-y-3">
              <div className="h-12 rounded-lg" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-12 rounded-lg" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GuideDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="h-4 w-48 rounded mb-4" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="aspect-video rounded-xl mb-6" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-4 w-1/3 rounded mb-4" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="h-8 w-3/4 rounded mb-6" style={{ backgroundColor: 'var(--bg-surface)' }} />
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
                <div className="h-3 w-32 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
                <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
                <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
                <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'var(--bg-surface)' }} />
              </div>
            ))}
          </div>
        </article>
        
        <aside className="w-full lg:w-72 xl:w-80">
          <div className="rounded-xl p-4 sticky top-20" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            <div className="space-y-2">
              <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-1/2 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export function GamesListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function GuidesListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function CodesListSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-12 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
              <div className="h-4 w-48 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
            </div>
            <div className="h-8 w-24 rounded" style={{ backgroundColor: 'var(--bg-overlay)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}