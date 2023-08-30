import React, { useCallback, useMemo, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'
import { formatUnits, parseUnits } from 'viem'
import { useQuery } from 'wagmi'

import Slider from '../../components/slider'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import { Asset } from '../../model/asset'
import { fetchAssets } from '../../api/asset'
import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import { ClientComponent } from '../../components/client-component'
import { fetchDepositApyByEpochsDeposited } from '../../api/market'
import CurrencyAmountInput from '../../components/currency-amount-input'

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

const Deposit: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ asset }) => {
  const { balances, prices } = useCurrencyContext()
  const { deposit } = useDepositContext()

  const [lockEpochs, _setLockEpochs] = useState(0)
  const [value, setValue] = useState('')

  const router = useRouter()

  const setLockEpochs = useCallback(
    (value: number) => {
      _setLockEpochs(value === lockEpochs ? value - 1 : value)
    },
    [lockEpochs],
  )

  const amount = useMemo(
    () => parseUnits(value, asset.underlying.decimals),
    [asset.underlying.decimals, value],
  )

  const { data: proceedsByEpochsDeposited } = useQuery(
    ['deposit-apy', asset, amount], // TODO: useDebounce
    () => fetchDepositApyByEpochsDeposited(asset, amount),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      initialData: [],
    },
  )

  const depositApy = useMemo(() => {
    if (lockEpochs === 0) {
      return 0
    }
    return proceedsByEpochsDeposited[lockEpochs - 1]?.apy ?? 0
  }, [proceedsByEpochsDeposited, lockEpochs])

  const expectedProceeds = useMemo(() => {
    if (lockEpochs === 0) {
      return 0n
    }
    return proceedsByEpochsDeposited[lockEpochs - 1]?.proceeds ?? 0n
  }, [proceedsByEpochsDeposited, lockEpochs])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Deposit {asset.underlying.symbol}</title>
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
            Deposit
            <div className="flex items-center gap-2">
              <img
                src={getLogo(asset.underlying)}
                alt={asset.underlying.name}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <div>{asset.underlying.symbol}</div>
            </div>
          </button>
          <div className="flex flex-1 sm:items-center justify-center">
            <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-950 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
              <div className="flex flex-col gap-4">
                <div className="font-bold text-sm sm:text-lg">
                  How much would you like to deposit?
                </div>
                <CurrencyAmountInput
                  currency={asset.underlying}
                  value={value}
                  onValueChange={setValue}
                  balance={balances[asset.underlying.address] ?? 0n}
                  price={prices[asset.underlying.address] ?? 0}
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
                  <div className="sm:px-6 sm:mb-2">
                    <ClientComponent>
                      <Slider
                        length={proceedsByEpochsDeposited.length}
                        value={lockEpochs}
                        onValueChange={setLockEpochs}
                      />
                    </ClientComponent>
                  </div>
                  <ClientComponent className="flex flex-col sm:flex-row justify-between">
                    {proceedsByEpochsDeposited.map(({ date, proceeds }, i) => (
                      <button
                        key={i}
                        className="flex sm:flex-col items-center gap-1 sm:gap-2 sm:w-[72px]"
                        onClick={() => setLockEpochs(i + 1)}
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
                            formatUnits(proceeds, asset.underlying.decimals),
                          ).toFixed(2)}`}
                        </div>
                      </button>
                    ))}
                  </ClientComponent>
                </div>
              </div>
              <div className="flex p-4 border-solid border-[1.5px] border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-3">
                <div className="flex flex-col flex-1">
                  <label className="font-bold text-sm sm:text-lg">
                    Your interest payout will be
                  </label>
                  <CountUp
                    end={Number(expectedProceeds)}
                    suffix={` ${asset.underlying.symbol}`}
                    className={`flex gap-2 ${
                      lockEpochs === 0 ? 'text-gray-400' : ''
                    } text-xl`}
                    formattingFn={(value) =>
                      `${formatUnits(
                        BigInt(value),
                        asset.underlying.decimals,
                      )} ${asset.underlying.symbol}`
                    }
                    preserveValue
                  />
                </div>
                <div className="flex px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-800 w-fit h-fit rounded font-bold text-xs sm:text-sm gap-1 sm:gap-2">
                  <span className="text-gray-400">APY</span>
                  <div className="text-gray-800 dark:text-white">
                    {depositApy.toFixed(2)}%
                  </div>
                </div>
              </div>
              <button
                disabled={amount === 0n || lockEpochs === 0}
                className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
                onClick={() =>
                  deposit(asset, amount, lockEpochs, expectedProceeds)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Deposit
