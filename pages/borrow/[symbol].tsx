import React, { useCallback, useMemo, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'

import Slider from '../../components/slider'
import BackSvg from '../../components/svg/back-svg'
import { Currency, getLogo } from '../../model/currency'
import { Asset } from '../../model/asset'
import { fetchAssets } from '../../api/asset'
import CurrencySelect from '../../components/currency-select'
import { useCurrencyContext } from '../../contexts/currency-context'
import { MAX_EPOCHS } from '../../utils/epoch'
import CurrencyAmountInput from '../../components/currency-amount-input'

const dummy = [
  { date: '24-06-30', profit: '102.37' },
  { date: '24-12-31', profit: '102.37' },
  { date: '25-06-30', profit: '102.37' },
  { date: '25-12-31', profit: '102.37' },
]

export const getServerSideProps: GetServerSideProps<{
  asset: Asset
}> = async ({ params }) => {
  const assets = await fetchAssets()
  const asset = assets.find(
    ({ underlying }) => underlying.symbol === params?.symbol,
  )
  if (!asset) {
    return {
      notFound: true,
    }
  }

  return {
    props: { asset },
  }
}

const Borrow: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ asset }) => {
  const { balances, prices } = useCurrencyContext()
  const [epochs, _setEpochs] = useState(0)
  const [collateralValue, setCollateralValue] = useState('')
  const [loanValue, setLoanValue] = useState('')
  const [collateral, setCollateral] = useState<Currency | undefined>(undefined)
  const [showCollateralSelect, setShowCollateralSelect] = useState(false)

  const router = useRouter()

  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const collateralAmount = useMemo(
    () => parseUnits(collateralValue, collateral?.decimals ?? 18),
    [collateralValue, collateral?.decimals],
  )

  const loanAmount = useMemo(
    () => parseUnits(loanValue, asset.underlying.decimals),
    [loanValue, asset.underlying.decimals],
  )

  console.log(collateralAmount, loanAmount)

  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {asset.underlying.symbol}</title>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.svg" rel="icon" />
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex flex-1 flex-col w-full">
          <button
            className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-24 mb-2 sm:mb-2 ml-4 sm:ml-6"
            onClick={() => router.back()}
          >
            <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
            Borrow
            <div className="flex gap-2">
              <img
                src={getLogo(asset.underlying)}
                alt={asset.underlying.name}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <div>{asset.underlying.symbol}</div>
            </div>
          </button>
          {showCollateralSelect ? (
            <CurrencySelect
              currencies={asset.collaterals || []}
              onBack={() => setShowCollateralSelect(false)}
              onCurrencySelect={(currency) => {
                setCollateral(currency)
                setShowCollateralSelect(false)
              }}
            />
          ) : (
            <div className="flex flex-1 sm:items-center justify-center">
              <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    How much collateral would you like to add?
                  </div>
                  <CurrencyAmountInput
                    currency={collateral}
                    value={collateralValue}
                    onValueChange={setCollateralValue}
                    balance={
                      collateral ? balances[collateral?.address] ?? 0n : 0n
                    }
                    price={collateral ? prices[collateral?.address] ?? 0 : 0}
                    onCurrencyClick={() => setShowCollateralSelect(true)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    How much would you like to borrow?
                  </div>
                  <CurrencyAmountInput
                    currency={asset.underlying}
                    value={loanValue}
                    onValueChange={setLoanValue}
                    price={prices[asset.underlying.address] ?? 0}
                    balance={218390000n}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    Select expiration date.
                  </div>
                  <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="sm:px-6 sm:mb-2">
                      <Slider
                        key={`borrow-slider-${selected}`}
                        count={MAX_EPOCHS}
                        value={epochs}
                        onValueChange={setEpochs}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between">
                      {dummy.map(({ date }, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center gap-2 w-[72px]"
                          onClick={() => setEpochs(i + 1)}
                        >
                          <div className="text-sm">{date}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                      <span className="text-gray-500">APY</span>
                      <div className="flex gap-1">
                        <div className="text-gray-800 dark:text-white">
                          3.15%
                        </div>
                        <div className="text-gray-400">
                          (10.1234 {asset.underlying.symbol} in interest)
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                      <span className="text-gray-500">LTV</span>
                      <div className="text-yellow-500">15.24%</div>
                    </div>
                  </div>
                </div>
                <button
                  disabled={true}
                  className="font-bold text-base sm:text-xl disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Borrow
