import React, { useCallback, useEffect, useState } from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { SessionProvider, signIn } from 'next-auth/react'
import {
  configureChains,
  ConnectorData,
  createConfig,
  useAccount,
  WagmiConfig,
} from 'wagmi'
import { arbitrumGoerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { identify } from '@web3analytic/funnel-sdk'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Header from '../components/header'
import { ThemeProvider, useThemeContext } from '../contexts/theme-context'
import { DepositProvider } from '../contexts/deposit-context'
import { BorrowProvider } from '../contexts/borrow-context'
import { couponFinanceChain } from '../utils/dev-chain'
import Panel from '../components/panel'
import { CurrencyProvider } from '../contexts/currency-context'
import { TransactionProvider } from '../contexts/transaction-context'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.BUILD === 'dev' ? couponFinanceChain : arbitrumGoerli],
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

const AccountProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter()
  const callbackUrl = (router.query.callbackUrl as string) ?? '/'
  const login = useCallback(
    async ({ address }: { address: `0x${string}` }) => {
      const response = await signIn('credentials', {
        address,
        redirect: false,
      })
      if (!response?.error) {
        await router.push(callbackUrl)
      }
    },
    [callbackUrl, router],
  )

  const { connector: activeConnector } = useAccount({
    onConnect({ address }) {
      if (address) {
        login({ address })
      }
    },
  })

  useEffect(() => {
    const handleConnectorUpdate = ({ account }: ConnectorData) => {
      if (account) {
        login({ address: account })
      }
    }
    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }
    return () => activeConnector?.off('change', handleConnectorUpdate) as any
  }, [activeConnector, login])
  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Head>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.svg" rel="icon" />
      </Head>
      <ThemeProvider>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <WalletProvider>
            <AccountProvider>
              <Web3AnalyticWrapper>
                <TransactionProvider>
                  <CurrencyProvider>
                    <DepositProvider>
                      <BorrowProvider>
                        <div className="flex flex-col w-screen min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white">
                          <Panel open={open} setOpen={setOpen} />
                          <Header onMenuClick={() => setOpen(true)} />
                          <Component {...pageProps} />
                          <Link
                            target="_blank"
                            href="https://github.com/clober-dex/coupon.finance"
                            className="fixed right-4 bottom-4 bg-gray-200 dark:bg-gray-800 rounded-full text-xs px-4 py-1"
                          >
                            #
                            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(
                              0,
                              7,
                            )}
                          </Link>
                        </div>
                      </BorrowProvider>
                    </DepositProvider>
                  </CurrencyProvider>
                </TransactionProvider>
              </Web3AnalyticWrapper>
            </AccountProvider>
          </WalletProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
