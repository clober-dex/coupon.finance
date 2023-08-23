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
import { arbitrum } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import Header from '../components/header'
import { ThemeProvider, useThemeContext } from '../contexts/theme-context'
import { DepositProvider } from '../contexts/deposit-context'
import { BorrowProvider } from '../contexts/borrow-context'
import { couponFinanceChain } from '../utils/dev-chain'
import { TokenProvider } from '../contexts/token-context'
import { WalletProvider } from '../contexts/wallet-context'

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

function MyApp({ Component, pageProps }: AppProps) {
  const { theme } = useThemeContext()
  return (
    <ThemeProvider>
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
          <WalletProvider>
            <TokenProvider>
              <DepositProvider>
                <BorrowProvider>
                  <div className="flex flex-col w-screen min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white">
                    <Header />
                    <Component {...pageProps} />
                  </div>
                </BorrowProvider>
              </DepositProvider>
            </TokenProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default MyApp
