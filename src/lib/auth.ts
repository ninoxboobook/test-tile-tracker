import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'hello@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          console.log('Login attempt:', {
            email: credentials?.email,
            timestamp: new Date().toISOString()
          })

          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          const user = await prisma.users.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              username: true,
              password: true
            }
          })

          console.log('User found:', user ? 'yes' : 'no')

          if (!user || !user?.password) {
            console.log('User not found or no password')
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          console.log('Password check:', isPasswordValid ? 'passed' : 'failed')

          if (!isPasswordValid) {
            console.log('Password incorrect')
            return null
          }

          console.log('Login successful for user:', user.email)
          
          // Return the user object that will be saved in the JWT
          return {
            id: user.id,
            email: user.email,
            username: user.username
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          username: user.username
        }
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
}
