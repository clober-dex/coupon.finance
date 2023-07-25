import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import Deposit from '../components/deposit'
import Borrow from '../components/borrow'

const Home: NextPage = () => {
  // TODO: add to url params
  const [isDeposit, setIsDeposit] = React.useState(true)

  return (
    <div className="flex flex-1">
      <Head>
        <title>Coupon Finance</title>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex mt-24">
          <button
            className="flex font-bold items-center justify-center text-2xl w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={isDeposit}
            onClick={() => setIsDeposit(true)}
          >
            Deposit
          </button>
          <button
            className="flex font-bold items-center justify-center text-2xl w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={!isDeposit}
            onClick={() => setIsDeposit(false)}
          >
            Borrow
          </button>
        </div>
        {isDeposit ? <Deposit /> : <Borrow />}
      </main>
    </div>
  )
}

export default Home
