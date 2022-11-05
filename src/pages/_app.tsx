import { ChakraProvider } from '@chakra-ui/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

import theme from '../styles/theme'
import { trpc } from '../utils/trpc'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default trpc.withTRPC(MyApp)
