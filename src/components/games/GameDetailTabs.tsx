'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GameGuideList } from './GameGuideList'
import { GameCodesList } from './GameCodesList'
import { GameTierList } from './GameTierList'
import { GameVideosSection } from './GameVideosSection'
import { useLanguage } from '@/lib/language-context'

interface GameDetailTabsProps {
  gameSlug: string
  hasGuides?: boolean
  hasCodes?: boolean
  hasTierList?: boolean
}

type TabType = 'overview' | 'guides' | 'codes' | 'videos' | 'tierlist'

export function GameDetailTabs({
  gameSlug,
  hasGuides = true,
  hasCodes = true,
  hasTierList = true
}: GameDetailTabsProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('videos')

  const tabs: { id: TabType; labelKey: string }[] = [
    { id: 'videos', labelKey: 'videos' },
    { id: 'guides', labelKey: 'guides' },
    { id: 'codes', labelKey: 'codes' },
    ...(hasTierList ? [{ id: 'tierlist' as TabType, labelKey: 'tier_list' }] : []),
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? ''
                : 'hover:bg-opacity-50'
            }`}
            style={
              activeTab === tab.id
                ? {
                    color: 'var(--accent-light)',
                    borderBottom: '2px solid var(--accent)',
                    marginBottom: '-2px',
                  }
                : { color: 'var(--text-secondary)' }
            }
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'videos' && (
          <GameVideosSection gameSlug={gameSlug} />
        )}
        {activeTab === 'guides' && (
          <div>
            <div className="mb-4">
              <Link
                href="/guides"
                className="text-sm font-medium"
                style={{ color: 'var(--accent-light)' }}
              >
                {t('view_all_guides')}
              </Link>
            </div>
            <GameGuideList gameSlug={gameSlug} />
          </div>
        )}
        {activeTab === 'codes' && (
          <div>
            <div className="mb-4">
              <Link
                href={`/codes/${gameSlug}`}
                className="text-sm font-medium"
                style={{ color: 'var(--accent-light)' }}
              >
                {t('view_all_codes')}
              </Link>
            </div>
            <GameCodesList gameSlug={gameSlug} />
          </div>
        )}
        {activeTab === 'tierlist' && (
          <GameTierList gameSlug={gameSlug} />
        )}
      </div>
    </div>
  )
}
