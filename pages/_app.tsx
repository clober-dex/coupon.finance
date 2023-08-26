import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import {
  configureChains,
  createConfig,
  useAccount,
  useBalance,
  WagmiConfig,
} from 'wagmi'
import { arbitrum } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { Hydrate, QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/query-core'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Header from '../components/header'
import { ThemeProvider, useThemeContext } from '../contexts/theme-context'
import { DepositProvider } from '../contexts/deposit-context'
import { BorrowProvider } from '../contexts/borrow-context'
import { couponFinanceChain } from '../utils/dev-chain'
import Panel from '../components/panel'
import { TransactionProvider } from '../contexts/transaction-context'
import { registerUser } from '../api/user'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.BUILD === 'dev' ? couponFinanceChain : arbitrum],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Coupon Finance',
  projectId: '02ce97122c1a439551ac55ae3a834a93',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const WalletProvider = ({ children }: React.PropsWithChildren) => {
  const { theme } = useThemeContext()
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={
          theme === 'light'
            ? lightTheme({
                accentColor: '#22C55E',
              })
            : darkTheme({
                accentColor: '#22C55E',
                overlayBlur: 'small',
              })
        }
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

const AccountProvider = ({ children }: React.PropsWithChildren) => {
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })
  useEffect(() => {
    async function register() {
      await registerUser(userAddress, balance?.value)
    }
    register()
  }, [balance?.value, userAddress])
  return children
}

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient())
  const [open, setOpen] = useState(false)
  return (
    <ThemeProvider>
      <WalletProvider>
        <AccountProvider>
          <TransactionProvider>
            <DepositProvider>
              <BorrowProvider>
                <div className="flex flex-col w-screen min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white">
                  <Panel open={open} setOpen={setOpen} />
                  <Header onMenuClick={() => setOpen(true)} />
                  <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                      <Component {...pageProps} />
                      {process.env.BUILD === 'dev' && (
                        <ReactQueryDevtools
                          initialIsOpen={false}
                          position="bottom-right"
                        />
                      )}
                    </Hydrate>
                  </QueryClientProvider>
                </div>
              </BorrowProvider>
            </DepositProvider>
          </TransactionProvider>
        </AccountProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default MyApp
