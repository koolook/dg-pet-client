import 'bootstrap/dist/css/bootstrap.min.css'

import StoreProvider from '@providers/StoreProvider'
import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Dynamically import Bootstrap JavaScript on the client-side
    typeof document !== 'undefined' ? require('bootstrap/dist/js/bootstrap') : null
  }, [])

  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}
