import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import BackSvg from '../../components/svg/back-svg'
import { useCurrencyContext } from '../../contexts/currency-context'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { GmxYieldForm } from '../../components/form/gmx-yield-form'

const GmxYield = () => {
  const { prices, assets } = useCurrencyContext()

  const router = useRouter()
  const asset = useMemo(() => {
    return assets.find(
      (asset) => asset.underlying.symbol === router.query.symbol,
    )
  }, [assets, router.query.symbol])

  const [collateral1Value, setCollateral1Value] = useState('')
  const [collateral2Value, setCollateral2Value] = useState('')
  const [collateral3Value, setCollateral3Value] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [epochs, setEpochs] = useState(1)
  const borrowApy = 10.1
  const borrowLTV = 42.3

  return (
    <div className="flex flex-1">
      <Head>
        <title>GMX {asset?.underlying.name} Yield Farming</title>
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
              GMX {asset.underlying.name} Yield Farming
              <div className="flex gap-2">
                <CurrencyIcon
                  currency={asset.underlying}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              <GmxYieldForm
                collateral1Currency={asset.underlying}
                collateral1Value={collateral1Value}
                setCollateral1Value={setCollateral1Value}
                maxCollateral1Amount={100n}
                collateral1Price={prices[asset.underlying.address]}
                collateral2Currency={asset.underlying}
                collateral2Value={collateral2Value}
                setCollateral2Value={setCollateral2Value}
                maxCollateral2Amount={100n}
                collateral2Price={prices[asset.underlying.address]}
                collateral3Currency={asset.underlying}
                collateral3Value={collateral3Value}
                setCollateral3Value={setCollateral3Value}
                maxCollateral3Amount={100n}
                collateral3Price={prices[asset.underlying.address]}
                borrowCurrency={asset.underlying}
                borrowValue={borrowValue}
                setBorrowValue={setBorrowValue}
                maxBorrowAmount={100n}
                borrowPrice={prices[asset.underlying.address]}
                borrowApy={borrowApy}
                borrowLTV={borrowLTV}
                interestsByEpochsBorrowed={undefined}
                epochs={epochs}
                setEpochs={setEpochs}
                actionButtonProps={{
                  disabled: false,
                  onClick: async () => {},
                  text: 'Confirm',
                }}
              />
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GmxYield
