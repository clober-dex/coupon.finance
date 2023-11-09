import React, { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import DepositContainer from '../containers/deposit-container'
import BorrowContainer from '../containers/borrow-container'
import { useCurrencyContext } from '../contexts/currency-context'

const Home = () => {
  const router = useRouter()
  const { assetStatuses, epochs } = useCurrencyContext()

  const selected = useMemo(() => {
    return !router.query.mode || router.query.mode === 'deposit'
      ? 'deposit'
      : 'borrow'
  }, [router.query.mode])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Coupon Finance</title>
      </Head>
      <div className="fixed w-full flex gap-16 items-end justify-center pb-1 bg-white dark:bg-gray-900 z-50 h-12 md:hidden">
        <button
          onClick={() => {
            router.replace('/', undefined, { shallow: true })
          }}
          disabled={selected === 'deposit'}
          className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
        >
          Earn
        </button>
        <button
          onClick={() => {
            router.replace('/?mode=borrow', undefined, {
              shallow: true,
            })
          }}
          disabled={selected === 'borrow'}
          className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
        >
          Strategies
        </button>
      </div>

      <main className="flex flex-1 flex-col justify-center items-center pt-12 md:pt-0">
        {selected === 'deposit' ? (
          <DepositContainer assetStatuses={assetStatuses} epochs={epochs} />
        ) : (
          <BorrowContainer assetStatuses={assetStatuses} epochs={epochs} />
        )}
      </main>
    </div>
  )
}

export default Home
