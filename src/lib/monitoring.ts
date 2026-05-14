
export function captureError(error: Error, context?: Record<string, string>) {
  console.error('[ERROR]', error.message, context)
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  }
}

export function trackEvent(name: string, properties?: Record<string, string | number>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[EVENT]', name, properties)
  }
}

export function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  return fn().finally(() => {
    const duration = performance.now() - start
    console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`)
  })
}
