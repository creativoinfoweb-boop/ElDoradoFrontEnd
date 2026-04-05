import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Cinzel } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ClerkWrapper from '@/components/ClerkWrapper'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
})

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'El Dorado — Copy Trading XAU/USD',
  description: 'Copia automaticamente i trade professionali su oro XAU/USD con MetaTrader 5. Performance verificate, privacy totale, setup in 3 minuti.',
  keywords: ['copy trading', 'gold trading', 'XAU/USD', 'MetaTrader 5', 'forex', 'automatico', 'El Dorado'],
  authors: [{ name: 'El Dorado' }],
  openGraph: {
    title: 'El Dorado — Copy Trading XAU/USD',
    description: '71% win rate verificato. Copia i trade in automatico su MetaTrader 5. Trial 7 giorni gratuito.',
    type: 'website',
    locale: 'it_IT',
  },
}

export const viewport: Viewport = {
  themeColor: '#F0B429',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cinzel.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkWrapper>
          <Providers>{children}</Providers>
        </ClerkWrapper>
      </body>
    </html>
  )
}
