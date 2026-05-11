'use client'

import { useState } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes = '100vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const isPicsum = src.includes('picsum.photos')
  const isExternal = src.startsWith('http') || src.startsWith('//')

  if (isPicsum || isExternal) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: 'var(--bg-overlay)' }}
          />
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${
            fill ? 'object-cover' : ''
          } ${className}`}
          style={{
            width: fill ? '100%' : '100%',
            height: fill ? '100%' : 'auto',
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
    >
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${
          fill ? 'object-cover' : ''
        }`}
      />
    </div>
  )
}

export function GameCardImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`aspect-video ${className}`}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )
}

export function ArticleCardImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`aspect-video ${className}`}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )
}

export function AvatarImage({
  src,
  alt,
  size = 40,
  className = '',
}: {
  src?: string | null
  alt: string
  size?: number
  className?: string
}) {
  if (!src) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: 'var(--accent)',
          color: 'white',
          fontSize: size * 0.4,
        }}
      >
        {alt[0]?.toUpperCase() || '?'}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      sizes={`${size}px`}
    />
  )
}