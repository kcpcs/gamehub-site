'use client'

import { useState } from 'react'
import { Check, Crown, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$5',
    period: '/month',
    priceId: 'price_monthly',
    features: [
      'Unlimited guide access',
      'Early access to new content',
      'Ad-free experience',
      'Priority support',
      'Download guides as PDF',
      'AI-powered game assistance'
    ]
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: '$45',
    period: '/year',
    priceId: 'price_yearly',
    popular: true,
    savings: '25%',
    features: [
      'Everything in Monthly',
      'Exclusive yearly content',
      '24/7 VIP support',
      'Early beta access',
      'Custom tier lists',
      'Team subscription options'
    ]
  }
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/canceled`
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <Crown className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--accent-light)' }} />
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Upgrade to Pro
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Unlock the full GameHub experience with unlimited access to all guides, 
            exclusive content, and premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative rounded-2xl p-8"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)'
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <span className="flex items-center gap-1">
                    <Zap size={14} /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {plan.price}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>
                  {plan.savings && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: 'var(--success)', color: 'white' }}
                    >
                      Save {plan.savings}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={18} style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className="w-full py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: plan.popular ? 'var(--accent)' : 'var(--bg-raised)',
                  color: 'white'
                }}
              >
                {loading === plan.id ? 'Redirecting...' : `Subscribe ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Cancel anytime. All plans include a 7-day money-back guarantee.
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Questions? Contact us at support@gamehub.com
          </p>
        </div>
      </div>
    </div>
  )
}
