import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { SSRProvider } from 'react-aria'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { darkTheme } from '../styles/theme'
import { CSSResetsGlobalStyle } from '../styles/resets'
import { CSSBaseGlobalStyle } from '../styles/base'
import '../styles/fonts.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <SSRProvider>
            <>
              <CSSResetsGlobalStyle />
              <CSSBaseGlobalStyle />
            </>
            <Component {...pageProps} />
          </SSRProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
