'use client'

import { useLanguage } from '@/lib/language-context'

export function HowToRedeem({ gameName }: { gameName: string }) {
  const { t } = useLanguage()

  const steps = [
    {
      step: 1,
      titleKey: 'redeem_step_open_game',
      description: `Launch ${gameName} on your device.`
    },
    {
      step: 2,
      titleKey: 'redeem_step_settings',
      description: 'Click on the Settings icon in the top right corner.'
    },
    {
      step: 3,
      titleKey: 'redeem_step_account',
      description: 'Click on the Account tab.'
    },
    {
      step: 4,
      titleKey: 'redeem_step_redeem',
      description: 'Enter your code in the Redeem Code field and click Confirm.'
    }
  ]

  return (
    <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        {t('how_to_redeem_codes')}
      </h2>
      <div className="grid gap-4">
        {steps.map((item) => (
          <div key={item.step} className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {t(item.titleKey)}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('redeem_alternative')}
        </p>
      </div>
    </div>
  )
}
