interface PlatformIconProps {
  platform: string
  size?: 'sm' | 'md' | 'lg'
}

export function PlatformIcon({ platform, size = 'md' }: PlatformIconProps) {
  const sizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  const iconSize = sizes[size]

  const icons: Record<string, React.ReactNode> = {
    PC: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    PS5: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    PS4: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Xbox: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M7 12l3-3 3 3 3-3 3 3M5 18h14" />
        <circle cx="12" cy="18" r="3" />
      </svg>
    ),
    Switch: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="6" y="2" width="4" height="20" rx="2" />
        <rect x="14" y="2" width="4" height="20" rx="2" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    Mobile: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="22" x2="12" y2="24" />
        <circle cx="12" cy="17" r="1.5" />
      </svg>
    ),
    iOS: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="22" x2="12" y2="24" />
        <circle cx="12" cy="17" r="1.5" />
        <circle cx="12" cy="5" r="1" />
      </svg>
    ),
    Android: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M12 6v4M12 14v4" />
        <circle cx="12" cy="12" r="1.5" />
        <path d="M8 22l2-2 4 4 4-4 2 2" />
      </svg>
    ),
    default: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
      </svg>
    )
  }

  return icons[platform] || icons.default
}