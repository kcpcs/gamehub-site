'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth'
import { LogIn, ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const [error, setError] = useState<string>('')

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google')
    } catch (err) {
      setError('Failed to sign in with Google')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="w-full max-w-md" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <div className="p-8">
          <button className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Sign In
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your account
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <LogIn size={20} />
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 pt-6 border-t flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
