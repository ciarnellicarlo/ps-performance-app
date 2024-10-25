import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '500'],
  variable: '--font-poppins',
})

export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    viewportFit: 'cover',
  },
  title: 'PlayStation Performance',  // Your app title
  description: 'Explore game benchmarks by resolution and FPS for every PlayStation version.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}