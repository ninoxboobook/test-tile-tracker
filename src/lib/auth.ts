import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { loginSchema } from './validations/auth'

// 15 minutes
const REFRESH_TOKEN_EXPIRY = 15 * 60

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: REFRESH_TOKEN_EXPIRY,
    updateAge: 0, // Always update the token
  },
  jwt: {
    maxAge: REFRESH_TOKEN_EXPIRY,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const result = loginSchema.safeParse(credentials)
          
          if (!result.success) {
            return null
          }

          const { email, password } = result.data
          
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              username: true,
              password: true
            }
          })

          if (!user?.password) {
            return null
          }

          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error
          }
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
      }

      // Force token refresh when session is updated
      if (trigger === 'update') {
        token.iat = Math.floor(Date.now() / 1000)
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.username = token.username as string
      }
      return session
    }
  },
  events: {
    async signOut({ token }) {
      // Invalidate the token on sign out
      if (token && typeof token.jti === 'string') {
        await prisma.session.delete({
          where: { sid: token.jti }
        })
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
