import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import '../styles/globals.scss'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '500'],
  variable: '--font-poppins',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${poppins.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp