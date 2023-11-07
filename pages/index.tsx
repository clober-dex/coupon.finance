import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import DepositContainer from '../containers/deposit-container'
import BorrowContainer from '../containers/borrow-container'
import { useCurrencyContext } from '../contexts/currency-context'

const Home = () => {
  const router = useRouter()
  const { assetStatuses, epochs } = useCurrencyContext()

  return (
    <div className="flex flex-1">
      <Head>
        <title>Coupon Finance</title>
      </Head>

      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex mt-24">
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode !== 'strategy'}
            onClick={() => router.replace('/', undefined, { shallow: true })}
          >
            Earn
          </button>
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode === 'strategy'}
            onClick={() =>
              router.replace('/?mode=strategy', undefined, { shallow: true })
            }
          >
            Strategy
          </button>
        </div>
        {router.query.mode !== 'strategy' ? (
          <DepositContainer assetStatuses={assetStatuses} epochs={epochs} />
        ) : (
          <BorrowContainer assetStatuses={assetStatuses} epochs={epochs} />
        )}
      </main>
    </div>
  )
}

export default Home
