import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGNF8CNWSD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CGNF8CNWSD');
          `}
        </Script>
      </head>
      <body className="bg-sand antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
