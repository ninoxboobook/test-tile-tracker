import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { CookieConsentBanner } from '@/components/ui/cookie-consent'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Test Tile Tracker',
  description: 'A web application for potters to track and manage test tiles',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/zmu6flc.css"></link>
        <meta name="apple-mobile-web-app-title" content="Test Tile Tracker" />
        <meta property="og:title" content="Test Tile Tracker" />
        <meta property="og:site_name" content="Test Tile Tracker" />
        <meta property="og:url" content="https://testtiletracker.com" />
        <meta property="og:description" content="Build, organise and search your personal library of test tiles, decorations and clay." />
        <meta property="og:type" content="website" />
        <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-CGNF8CNWSD"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CGNF8CNWSD', {
              'analytics_storage': 'denied'  // Default to denied until consent is given
            });
          `}
            </Script>
          </head>
          <body className="bg-sand antialiased">
            <SessionProvider session={session}>
              {children}
              <CookieConsentBanner />
            </SessionProvider>
          </body>
        </html>
        )
}
