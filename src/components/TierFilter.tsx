'use client'

import { Filter, X } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface TierFilterProps {
  filters: FilterOption[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
  filterType?: string
}

export function TierFilter({ filters, selectedFilters, onFilterChange, filterType = 'Role' }: TierFilterProps) {
  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId]
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">{filterType}:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedFilters.includes(filter.id) ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: selectedFilters.includes(filter.id) ? 'var(--accent)' : 'var(--bg-surface)',
              color: selectedFilters.includes(filter.id) ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${selectedFilters.includes(filter.id) ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {filter.label}
            {filter.count && (
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedFilters.length > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:text-accent-light"
          style={{ color: 'var(--text-muted)' }}
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}
    </div>
  )
}