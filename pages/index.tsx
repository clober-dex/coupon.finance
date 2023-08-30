import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Deposit from '../components/deposit'
import Borrow from '../components/borrow'
import { Asset } from '../model/asset'
import { fetchAssets } from '../api/asset'
import { fetchMarkets } from '../api/market'

export const getServerSideProps: GetServerSideProps<{
  assets: Asset[]
  dates: string[]
}> = async () => {
  const [assets, markets] = await Promise.all([fetchAssets(), fetchMarkets()])
  return {
    props: {
      assets,
      dates: markets
        .map((market) => market.endTimestamp)
        .sort()
        .filter((date, index, self) => self.indexOf(date) === index)
        .map((timestamp) =>
          new Date(Number(timestamp) * 1000).toISOString().slice(0, 10),
        ),
    },
  }
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assets, dates }) => {
  const router = useRouter()

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
          <Deposit assets={assets} dates={dates} />
        ) : (
          <Borrow assets={assets} dates={dates} />
        )}
      </main>
    </div>
  )
}

export default Home
