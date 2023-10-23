import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'
import { useQuery } from 'wagmi'
import Link from 'next/link'
import Image from 'next/image'

import Slider from '../../components/slider'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchDepositApyByEpochsDeposited } from '../../apis/market'
import CurrencyAmountInput from '../../components/currency-amount-input'
import { formatUnits } from '../../utils/numbers'

const Deposit = () => {
  const { balances, prices, assets } = useCurrencyContext()
  const { deposit } = useDepositContext()

  const [epochs, _setEpochs] = useState(0)
  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const [value, setValue] = useState('')

  const router = useRouter()
  const asset = useMemo(() => {
    return (
      assets.find((asset) => asset.underlying.symbol === router.query.symbol) ||
      assets[0]
    )
  }, [assets, router.query.symbol])

  const [amount, userBalance] = useMemo(
    () => [
      parseUnits(value, asset.underlying.decimals ?? 18),
      balances[asset.underlying.address] ?? 0n,
    ],
    [asset.underlying.address, asset.underlying.decimals, balances, value],
  )

  const { data: proceedsByEpochsDeposited } = useQuery(
    ['deposit-simulate', asset, amount], // TODO: useDebounce
    () => (asset ? fetchDepositApyByEpochsDeposited(asset, amount) : []),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const [apy, proceed] = useMemo(() => {
    return epochs && proceedsByEpochsDeposited
      ? [
          proceedsByEpochsDeposited[epochs - 1].apy ?? 0,
          proceedsByEpochsDeposited[epochs - 1].proceeds ?? 0n,
        ]
      : [0, 0n]
  }, [epochs, proceedsByEpochsDeposited])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Deposit {asset?.underlying.symbol}</title>
      </Head>
      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-24 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Deposit
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={getLogo(asset.underlying)}
                    alt={asset.underlying.name}
                    fill
                  />
                </div>
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-1 sm:items-center justify-center">
              <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-950 sm:dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    How much would you like to deposit?
                  </div>
                  <CurrencyAmountInput
                    currency={asset.underlying}
                    value={value}
                    onValueChange={setValue}
                    availableAmount={userBalance}
                    price={prices[asset.underlying.address]}
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-sm sm:text-lg">
                      Select expiration date.
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      The longer you deposit, the more interest you earn!
                    </div>
                  </div>
                  <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4 sm:h-[116px]">
                    {proceedsByEpochsDeposited === undefined ? (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div
                          className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="sm:px-6 sm:mb-2">
                      <div>
                        <Slider
                          length={proceedsByEpochsDeposited?.length ?? 0}
                          value={epochs}
                          onValueChange={setEpochs}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between">
                      {(proceedsByEpochsDeposited ?? []).map(
                        ({ date, proceeds }, i) => (
                          <button
                            key={i}
                            className="flex sm:flex-col items-center gap-1 sm:gap-2 sm:w-[72px]"
                            onClick={() => setEpochs(i + 1)}
                          >
                            <div className="text-sm w-20 sm:w-fit text-start">
                              {date}
                            </div>
                            <div
                              className={
                                'px-2 py-1 rounded-full text-xs bg-green-500 text-green-500 bg-opacity-10'
                              }
                            >
                              {`+${Number(
                                formatUnits(
                                  proceeds,
                                  asset.underlying.decimals,
                                  prices[asset.underlying.address],
                                ),
                              ).toFixed(2)}`}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex p-4 border-solid border-[1.5px] border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-3">
                  <div className="flex flex-col flex-1">
                    <label className="font-bold text-sm sm:text-lg">
                      Your interest payout will be
                    </label>
                    <CountUp
                      end={Number(proceed)}
                      suffix={` ${asset.underlying.symbol}`}
                      className={`flex gap-2 ${
                        epochs === 0 ? 'text-gray-400' : ''
                      } text-xl`}
                      formattingFn={(value) =>
                        `${formatUnits(
                          BigInt(value),
                          asset.underlying.decimals,
                          prices[asset.underlying.address],
                        )} ${asset.underlying.symbol}`
                      }
                      preserveValue
                    />
                  </div>
                  <div className="flex px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-800 w-fit h-fit rounded font-bold text-xs sm:text-sm gap-1 sm:gap-2">
                    <span className="text-gray-400">APY</span>
                    <div className="text-gray-800 dark:text-white">
                      {apy.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <button
                  disabled={
                    amount === 0n || epochs === 0 || amount > userBalance
                  }
                  className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
                  onClick={async () => {
                    const hash = await deposit(asset, amount, epochs, proceed)
                    if (hash) {
                      await router.replace('/?mode=deposit')
                    }
                  }}
                >
                  {amount > userBalance
                    ? `Insufficient ${asset.underlying.symbol} balance`
                    : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Deposit
