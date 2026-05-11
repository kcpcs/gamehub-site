'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, LogOut, Settings, BookOpen } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface UserButtonProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function UserButton({ user }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-semibold transition-colors"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        <User size={16} />
        Sign In
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-colors hover:opacity-80"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <User size={16} />
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 top-12 w-64 rounded-xl shadow-xl z-50 overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {user.name || 'User'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/saved"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onClick={() => setIsOpen(false)}
              >
                <BookOpen size={16} />
                Saved Items
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                Settings
              </Link>
              <button
                onClick={async () => {
                  setIsOpen(false)
                  await signOut()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: 'var(--danger)' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
