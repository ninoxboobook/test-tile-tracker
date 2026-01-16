import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/schemas/auth'
import { sendWelcomeEmail } from '@/lib/email-templates'

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    }
  )

  const data = await response.json()
  return data.success === true
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Verify captcha token first
    const captchaToken = body.captchaToken
    if (!captchaToken) {
      return NextResponse.json(
        { message: 'Captcha verification required' },
        { status: 400 }
      )
    }

    const isCaptchaValid = await verifyTurnstileToken(captchaToken)
    if (!isCaptchaValid) {
      return NextResponse.json(
        { message: 'Captcha verification failed' },
        { status: 400 }
      )
    }

    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, username } = result.data

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
    })

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username'
      return NextResponse.json(
        { message: `This ${field} is already registered` },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
      select: {
        id: true,
        email: true,
        username: true,
      }
    })

    await sendWelcomeEmail(user.email, user.username);

    return NextResponse.json(
      { message: 'Registration successful', user },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
