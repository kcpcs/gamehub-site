'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

interface UseInfiniteScrollReturn {
  observeRef: (node: HTMLDivElement | null) => void
  isLoading: boolean
  hasMore: boolean
  setHasMore: (value: boolean) => void
}

export function useInfiniteScroll(
  onLoadMore: () => Promise<void | boolean>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 0.1, rootMargin = '100px' } = options
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true)
        try {
          await onLoadMore()
        } finally {
          setIsLoading(false)
        }
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(target)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver, rootMargin, threshold])

  const observeRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current && targetRef.current) {
      observerRef.current.unobserve(targetRef.current)
    }
    targetRef.current = node
    if (node && observerRef.current) {
      observerRef.current.observe(node)
    }
  }, [])

  return { observeRef, isLoading, hasMore, setHasMore }
}