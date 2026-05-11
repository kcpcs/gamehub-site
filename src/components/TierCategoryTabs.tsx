'use client'

import { Gamepad2, Sword, Map, Users } from 'lucide-react'

interface TierCategoryTabsProps {
  categories: Array<{ id: string; label: string; icon: 'gamepad' | 'sword' | 'map' | 'users' }>
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function TierCategoryTabs({ categories, activeCategory, onCategoryChange }: TierCategoryTabsProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'gamepad':
        return <Gamepad2 className="w-4 h-4" />
      case 'sword':
        return <Sword className="w-4 h-4" />
      case 'map':
        return <Map className="w-4 h-4" />
      case 'users':
        return <Users className="w-4 h-4" />
      default:
        return <Gamepad2 className="w-4 h-4" />
    }
  }

  return (
    <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeCategory === category.id
              ? 'scale-105'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeCategory === category.id ? 'var(--accent)' : 'transparent',
            color: activeCategory === category.id ? 'white' : 'var(--text-secondary)',
          }}
        >
          {getIcon(category.icon)}
          {category.label}
        </button>
      ))}
    </div>
  )
}