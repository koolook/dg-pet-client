import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'

import { useEffect } from 'react'
import type { AppProps } from 'next/app'

import StoreProvider from '@providers/StoreProvider'
import StartupWidget from '@widgets/startup'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Dynamically import Bootstrap JavaScript on the client-side
    typeof document !== 'undefined' ? require('bootstrap/dist/js/bootstrap') : null
  }, [])

  return (
    <StoreProvider>
      <StartupWidget />
      <Component {...pageProps} />
    </StoreProvider>
  )
}
