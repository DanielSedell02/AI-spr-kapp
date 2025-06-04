import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: 'AI Language Learning App',
  description: 'Learn languages through AI-powered conversations and personalized feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
} 