import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
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
              email: credentials.email
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

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Password check:', isCorrectPassword ? 'passed' : 'failed')

          if (!isCorrectPassword) {
            console.log('Password incorrect')
            return null
          }

          console.log('Login successful for user:', user.email)
          
          // Return the user object that will be saved in the JWT
          return {
            id: user.id,
            email: user.email,
            name: user.username
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
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
}
