'use client'

import { useState, useEffect, useRef } from 'react'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  placeholderColor?: string
  aspectRatio?: string
  onLoad?: () => void
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  placeholderColor = 'var(--bg-overlay)',
  aspectRatio = 'auto',
  onLoad,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getSrcSet = () => {
    const baseUrl = src.replace(/t_[^/]+\/(\w+\.\w+)$/, 't_')
    const fileName = src.match(/t_[^/]+\/(\w+\.\w+)$/)?.[1] || ''
    
    if (!fileName) return src
    
    return [
      `${baseUrl}cover_small/${fileName} 480w`,
      `${baseUrl}cover_big/${fileName} 720w`,
      `${baseUrl}1080p/${fileName} 1080w`,
      `${baseUrl}original/${fileName} 1920w`,
    ].join(', ')
  }

  const getSizes = () => {
    return '(max-width: 640px) 480px, (max-width: 1024px) 720px, (max-width: 1280px) 1080px, 1920px'
  }

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
        <img
          src={src}
          srcSet={getSrcSet()}
          sizes={getSizes()}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => {
            setIsLoaded(true)
            onLoad?.()
          }}
          loading="lazy"
        />
      )}
    </div>
  )
}