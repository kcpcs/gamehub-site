'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  placeholderColor?: string
  aspectRatio?: string
  onLoad?: () => void
  priority?: boolean
  width?: number
  height?: number
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  placeholderColor = 'var(--bg-overlay)',
  aspectRatio = 'auto',
  onLoad,
  priority = false,
  width,
  height,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const isExternal = src.startsWith('http') || src.startsWith('//')

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: placeholderColor }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-transparent border-t-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Responsive image */}
      {isInView && (
        isExternal ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            width={width}
            height={height}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
            priority={priority}
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 720px, (max-width: 1280px) 1080px, 1920px"
          />
        )
      )}
    </div>
  )
}