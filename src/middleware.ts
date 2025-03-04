import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const headers = new Headers(request.headers);

  // Allow access to docs regardless of auth status
  if (request.nextUrl.pathname.startsWith('/docs')) {
    return NextResponse.next()
  }

  // Allow access to auth-related endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Allow access to public profile regardless of auth status
  if (request.nextUrl.pathname.startsWith('/profile/')) {
    headers.set("x-current-path", request.nextUrl.pathname);
    return NextResponse.next({ headers })
  }

  // Allow access to test tiles pages (except edit and new) regardless of auth status
  if (request.nextUrl.pathname.match(/^\/test-tiles\/[^/]+$/) && !request.nextUrl.pathname.endsWith('/new')) {
    headers.set("x-current-path", request.nextUrl.pathname);
    return NextResponse.next({ headers })
  }
  if (request.nextUrl.pathname === '/test-tiles/new') {
    return NextResponse.next()
  }

  // Allow access to collection pages (except edit) regardless of auth status
  if (request.nextUrl.pathname.match(/^\/collections\/[^/]+$/) && !request.nextUrl.pathname.endsWith('/new')) {
    headers.set("x-current-path", request.nextUrl.pathname);
    return NextResponse.next({ headers })
  }
  if (request.nextUrl.pathname === '/collections/new') {
    return NextResponse.next()
  }

  // Allow access to clay body pages (except edit) regardless of auth status
  if (request.nextUrl.pathname.match(/^\/clay-bodies\/[^/]+$/) && !request.nextUrl.pathname.endsWith('/new')) {
    headers.set("x-current-path", request.nextUrl.pathname);
    return NextResponse.next({ headers })
  }
  if (request.nextUrl.pathname === '/clay-bodies/new') {
    return NextResponse.next()
  }

  // Allow access to decoration pages (except edit) regardless of auth status
  if (request.nextUrl.pathname.match(/^\/decorations\/[^/]+$/) && !request.nextUrl.pathname.endsWith('/new')) {
    headers.set("x-current-path", request.nextUrl.pathname);
    return NextResponse.next({ headers })
  }
  if (request.nextUrl.pathname === '/decorations/new') {
    return NextResponse.next()
  }

  // Allow access to images regardless of auth status
  if (request.nextUrl.pathname.startsWith('/images')) {
    return NextResponse.next()
  }

  // Handle public routes
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/privacy-policy') ||
    request.nextUrl.pathname.startsWith('/terms-of-service') ||
    request.nextUrl.pathname.startsWith('/account-deleted') ||
    request.nextUrl.pathname.startsWith('/reset-password') ||
    request.nextUrl.pathname.includes('web-app-manifest-192x192.png') ||
    request.nextUrl.pathname.includes('web-app-manifest-512x512.png') ||
    request.nextUrl.pathname.includes('apple-icon.png')
  ) {
    // Redirect to dashboard if already authenticated (except for specific pages)
    if (token &&
      !request.nextUrl.pathname.startsWith('/privacy-policy') &&
      !request.nextUrl.pathname.startsWith('/terms-of-service') &&
      !request.nextUrl.pathname.startsWith('/account-deleted') &&
      !request.nextUrl.pathname.startsWith('/reset-password') &&
      !request.nextUrl.pathname.includes('web-app-manifest-192x192.png') &&
      !request.nextUrl.pathname.includes('web-app-manifest-512x512.png') &&
      !request.nextUrl.pathname.includes('apple-icon.png')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes that require authentication
  if (!token) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  }

  // Block access to edit pages for non-owners (handled in page component)
  if (request.nextUrl.pathname.match(/^\/test-tiles\/[^/]+\/edit$/)) {
    return NextResponse.next({ headers })
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
    return NextResponse.next()
  }

  // Protect dashboard routes
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(url)
  }

  // Check token expiration
  const now = Math.floor(Date.now() / 1000)
  if (token.exp && typeof token.exp === 'number' && token.exp < now) {
    // Token has expired, redirect to login
    const url = new URL('/login', request.url)
    url.searchParams.set('error', 'SessionExpired')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/admin/:path*'
  ],
}
