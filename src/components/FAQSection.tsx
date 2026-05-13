'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              border: '1px solid var(--border)' 
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left transition-all duration-200 hover:bg-opacity-50"
              style={{ backgroundColor: 'transparent' }}
            >
              <span 
                className="font-medium pr-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp 
                  size={20} 
                  style={{ color: 'var(--accent)', flexShrink: 0 }}
                />
              ) : (
                <ChevronDown 
                  size={20} 
                  style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
                />
              )}
            </button>
            {openIndex === index && (
              <div 
                className="px-6 pb-4 text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
