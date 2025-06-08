import '../styles/globals.css'
import '../styles/mood-heatmap.css'
import 'react-tooltip/dist/react-tooltip.css'
import type { AppProps } from 'next/app'
import { Pacifico } from 'next/font/google'
const pacifico = Pacifico({ weight: '400', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={pacifico.className}>
      <Component {...pageProps} />
    </main>
  )
}
