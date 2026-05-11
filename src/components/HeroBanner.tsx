'use client'

import { useState, useEffect } from 'react'
import { Play, ChevronRight, Sparkles } from 'lucide-react'

interface HeroBannerProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundVideo?: string
  backgroundImage?: string
  overlayGradient?: string
}

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundVideo,
  backgroundImage,
  overlayGradient = 'from-black/80 via-black/50 to-transparent',
}: HeroBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative h-[600px] overflow-hidden rounded-3xl">
      {/* Background Video */}
      {backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Background Image */}
      {backgroundImage && !backgroundVideo && (
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.05)`,
          }}
        />
      )}

      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient}`} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        {/* Animated Icons */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--accent-light)' }}>
            Featured Content
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl mb-8 max-w-2xl transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {subtitle}
        </p>

        {/* CTA Button */}
        <a
          href={ctaLink}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-1000 delay-400 hover:scale-105 hover:shadow-lg ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          }}
        >
          <Play className="w-5 h-5" fill="currentColor" />
          <span>{ctaText}</span>
          <ChevronRight className="w-5 h-5" />
        </a>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)' }} />
    </section>
  )
}