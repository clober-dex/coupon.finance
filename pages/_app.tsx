import React from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, goerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import Header from '../components/header'
import { ThemeProvider, useThemeContext } from '../contexts/theme-context'
import { DepositProvider } from '../contexts/deposit-context'
import { BorrowProvider } from '../contexts/borrow-context'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()], // TODO: add alchemyProvider
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
        theme={theme === 'light' ? lightTheme() : darkTheme()}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <DepositProvider>
          <BorrowProvider>
            <div className="flex flex-col w-screen min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white">
              <Header />
              <Component {...pageProps} />
            </div>
          </BorrowProvider>
        </DepositProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default MyApp
