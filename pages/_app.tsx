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
import { configureChains, createConfig, useAccount, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { identify } from '@web3analytic/funnel-sdk'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

import HeaderContainer from '../containers/header-container'
import { ThemeProvider, useThemeContext } from '../contexts/theme-context'
import { DepositProvider } from '../contexts/deposit-context'
import { BorrowProvider } from '../contexts/borrow-context'
import Panel from '../components/panel'
import {
  CurrencyProvider,
  useCurrencyContext,
} from '../contexts/currency-context'
import { TransactionProvider } from '../contexts/transaction-context'
import { supportChains } from '../constants/chain'
import { ChainProvider } from '../contexts/chain-context'
import { Footer } from '../components/footer'
import { CouponUserBalanceModal } from '../components/modal/coupon-user-balance-modal'
import {
  AdvancedContractProvider,
  useAdvancedContractContext,
} from '../contexts/advanced-contract-context'
import { SubgraphProvider } from '../contexts/subgraph-context'
import { ModeProvider, useModeContext } from '../contexts/mode-context'
import { SwapProvider } from '../contexts/swap-context'
import ErrorBoundary from '../components/error-boundary'
import { PointProvider } from '../contexts/point-context'

const inter = Inter({ subsets: ['latin'] })

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportChains,
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
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

const Web3AnalyticWrapper = ({ children }: React.PropsWithChildren) => {
  const { address } = useAccount()

  useEffect(() => {
    if (!address) {
      return
    }
    identify(process.env.NEXT_PUBLIC_WEB3_ANALYTIC_API_KEY || '', address)
  }, [address])

  return <>{children}</>
}

const HeaderWrapper = () => {
  const [open, setOpen] = useState(false)
  const { setTheme } = useThemeContext()
  const router = useRouter()
  const { selectedMode, onSelectedModeChange } = useModeContext()
  return (
    <>
      <Panel
        open={open}
        setOpen={setOpen}
        setTheme={setTheme}
        router={router}
        selectedMode={selectedMode}
        onSelectedModeChange={onSelectedModeChange}
      />
      <HeaderContainer onMenuClick={() => setOpen(true)} setTheme={setTheme} />
    </>
  )
}

const CouponWidgetWrapper = () => {
  const { address } = useAccount()
  const { coupons, assets } = useCurrencyContext()
  const { sellCoupons } = useAdvancedContractContext()

  return address ? (
    <CouponUserBalanceModal
      assets={assets}
      couponBalances={coupons}
      sellCoupons={sellCoupons}
    />
  ) : (
    <></>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ErrorBoundary>
        <Head>
          <title>Coupon Finance</title>
          <link href="/favicon.svg" rel="icon" />
        </Head>
        <ThemeProvider>
          <WalletProvider>
            <ChainProvider>
              <Web3AnalyticWrapper>
                <TransactionProvider>
                  <SubgraphProvider>
                    <PointProvider>
                      <CurrencyProvider>
                        <DepositProvider>
                          <BorrowProvider>
                            <AdvancedContractProvider>
                              <SwapProvider>
                                <ModeProvider>
                                  <div
                                    className={`${inter.className} flex flex-col w-screen min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white`}
                                  >
                                    <HeaderWrapper />
                                    <div className="mb-auto pt-12 lg:pt-16">
                                      <Component {...pageProps} />
                                      <CouponWidgetWrapper />
                                    </div>
                                    <Footer />
                                  </div>
                                </ModeProvider>
                              </SwapProvider>
                            </AdvancedContractProvider>
                          </BorrowProvider>
                        </DepositProvider>
                      </CurrencyProvider>
                    </PointProvider>
                  </SubgraphProvider>
                </TransactionProvider>
              </Web3AnalyticWrapper>
            </ChainProvider>
          </WalletProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  )
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
