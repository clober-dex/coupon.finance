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
        {!router.query.mode || router.query.mode === 'deposit' ? (
          <DepositContainer assetStatuses={assetStatuses} epochs={epochs} />
        ) : (
          <BorrowContainer assetStatuses={assetStatuses} epochs={epochs} />
        )}
      </main>
    </div>
  )
}

export default Home
