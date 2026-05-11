'use client'

export function HowToRedeem({ gameName }: { gameName: string }) {
  const steps = [
    {
      step: 1,
      title: 'Open the Game',
      description: `Launch ${gameName} on your device.`
    },
    {
      step: 2,
      title: 'Go to Settings',
      description: 'Click on the Settings icon in the top right corner.'
    },
    {
      step: 3,
      title: 'Select Account',
      description: 'Click on the Account tab.'
    },
    {
      step: 4,
      title: 'Redeem Code',
      description: 'Enter your code in the Redeem Code field and click Confirm.'
    }
  ]

  return (
    <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        How to Redeem Codes
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
                {item.title}
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
          Alternatively, you can redeem codes on the official website. Make sure you're logged into your account first.
        </p>
      </div>
    </div>
  )
}
