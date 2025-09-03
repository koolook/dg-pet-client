import type { AppProps } from 'next/app'
import { useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import StoreProvider from '@providers/StoreProvider'
import { ErrorContainer } from '@widgets/ErrorContainer'
import StartupWidget from '@widgets/startup'

import '../styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Dynamically import Bootstrap JavaScript on the client-side
    // eslint-disable-next-line
    typeof document !== 'undefined' ? require('bootstrap/dist/js/bootstrap') : null
  }, [])

  return (
    <StoreProvider>
      <ErrorContainer>
        <StartupWidget />
        <Component {...pageProps} />
      </ErrorContainer>
    </StoreProvider>
  )
}
