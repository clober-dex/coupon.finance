import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { dehydrate, QueryClient } from '@tanstack/query-core'
import { useQuery } from '@tanstack/react-query'

import Deposit from '../components/deposit'
import Borrow from '../components/borrow'
import { Asset } from '../model/asset'
import { fetchAssets } from '../api/asset'
import { fetchUser } from '../api/user'
import { fetchBalances } from '../api/balances'
import { fetchPrices } from '../api/prices'

export const getServerSideProps: GetServerSideProps<{
  userAddress: string | null
  balance: string
  assets: Asset[]
}> = async () => {
  const { userAddress, balance } = await fetchUser()

  const queryClient = new QueryClient()

  const [, , assets] = await Promise.all([
    queryClient.prefetchQuery(['balances'], () =>
      fetchBalances(userAddress, balance),
    ),
    queryClient.prefetchQuery(['prices'], () => fetchPrices()),
    fetchAssets(),
  ])

  return {
    props: {
      userAddress: userAddress || null,
      balance: (balance || '0').toString(),
      assets,
      dehydratedProps: dehydrate(queryClient),
    },
  }
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ userAddress, balance, assets }) => {
  const { data: balances } = useQuery(['balances'], () =>
    fetchBalances(userAddress as `0x${string}` | null, BigInt(balance)),
  )
  const { data: prices } = useQuery(['prices'], () => fetchPrices())
  const router = useRouter()
  console.log('balances', balances)

  return (
    <div className="flex flex-1">
      <Head>
        <title>Coupon Finance</title>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.svg" rel="icon" />
      </Head>

      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex mt-24">
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode !== 'borrow'}
            onClick={() => router.replace('/', undefined, { shallow: true })}
          >
            Deposit
          </button>
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode === 'borrow'}
            onClick={() =>
              router.replace('/?mode=borrow', undefined, { shallow: true })
            }
          >
            Borrow
          </button>
        </div>
        {router.query.mode !== 'borrow' ? (
          <Deposit assets={assets} prices={prices || {}} />
        ) : (
          <Borrow assets={assets} prices={prices || {}} />
        )}
      </main>
    </div>
  )
}

export default Home
