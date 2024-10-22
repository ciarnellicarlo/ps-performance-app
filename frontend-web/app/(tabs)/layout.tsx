import { Poppins } from 'next/font/google'
import '@/styles/globals.scss'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '500'],
  variable: '--font-poppins',
})

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