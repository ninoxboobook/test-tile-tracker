import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { loginSchema } from './schemas/auth'


const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 

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
              password: true,
              role: true
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await compare(password, user.password)

          if (!isValid) {
            return null
          }

          console.log('User from database:', { ...user, password: '[REDACTED]' })

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
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
      console.log('JWT callback - input:', { token, user, trigger })
      if (trigger === 'signIn' && user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.role = user.role
      } else if (!token.role) {
        // If role is missing, fetch it from the database
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true }
        })
        if (user) {
          token.role = user.role
        }
      }
      console.log('JWT callback - output token:', token)
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - input:', { session, token })
      console.log('Session callback:', { session, token })
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }

      console.log('Session callback - output session:', session)
      console.log('Final session:', session)
      return session
    },
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
