import React, { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import BackSvg from '../../components/svg/back-svg'
import { useCurrencyContext } from '../../contexts/currency-context'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import BorrowFormContainer from '../../containers/form/borrow-form-container'

const Borrow = () => {
  const { assets } = useCurrencyContext()

  const router = useRouter()
  const asset = useMemo(() => {
    return assets.find(
      (asset) => asset.underlying.symbol === router.query.symbol,
    )
  }, [assets, router.query.symbol])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {asset?.underlying.symbol}</title>
      </Head>

      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full gap-6">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/?mode=borrow"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Borrow
              <div className="flex gap-2">
                <CurrencyIcon
                  currency={asset.underlying}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              <BorrowFormContainer defaultBorrowCurrency={asset.underlying} />
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Borrow
