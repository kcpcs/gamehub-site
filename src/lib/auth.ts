import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const passwordHash = user.password_hash
        if (!passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
    async signIn({ user, account }) {
      if (!account) return true
      if (account.provider === 'credentials') {
        return true
      }

      const existingUser = await db.user.findUnique({
        where: { email: user.email || '' },
      })

      if (existingUser) {
        return true
      }

      await db.user.create({
        data: {
          email: user.email || '',
          username: user.name || 'NewUser',
        },
      })

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin',
  },
})

export async function requireAuth(request: Request) {
  const session = await auth()
  if (!session?.user) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return session
}

export async function requireAdmin(request: Request) {
  const session = await auth()
  if (!session?.user) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return session
}

export function getSession() {
  return auth()
}