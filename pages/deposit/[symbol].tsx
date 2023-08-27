import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { formatUnits, isAddressEqual } from 'viem'

import Slider from '../../components/slider'
import NumberInput from '../../components/number-input'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import { Asset } from '../../model/asset'
import { fetchAssets } from '../../api/asset'
import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import { calculateDepositApy, Market } from '../../model/market'
import { fetchMarkets } from '../../api/clober'
import { ClientComponent } from '../../components/client-component'

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

  const [proceeds, setProceeds] = useState<
    { date: string; profit: string; apy: number; proceed: bigint }[]
  >([])
  const [selectedEpochIndex, _setSelectedEpochIndex] = useState(0)
  const [value, setValue] = useState('')

  const router = useRouter()

  const setSelected = useCallback(
    (value: number) => {
      _setSelectedEpochIndex(value === selectedEpochIndex ? value - 1 : value)
    },
    [selectedEpochIndex],
  )

  const onBlurValue = useCallback(() => {
    if (!balances || !balances[asset.underlying.address]) {
      return
    }
    setValue(
      BigInt(value) * 10n ** BigInt(asset.underlying.decimals) >
        balances[asset.underlying.address]
        ? formatUnits(
            balances[asset.underlying.address] ?? 0n,
            asset.underlying.decimals,
          )
        : value,
    )
  }, [asset.underlying.address, asset.underlying.decimals, balances, value])

  const setMaxValue = useCallback(() => {
    setValue(
      formatUnits(
        balances[asset.underlying.address] ?? 0n,
        asset.underlying.decimals,
      ),
    )
  }, [asset.underlying.address, asset.underlying.decimals, balances])

  const amount = useMemo(() => {
    const big = new BigNumber(10).pow(asset.underlying.decimals).times(value)
    return big.isNaN() ? 0n : BigInt(big.toFixed(0))
  }, [asset.underlying.decimals, value])

  const depositApy = useMemo(() => {
    return proceeds[selectedEpochIndex - 1]?.apy || 0
  }, [proceeds, selectedEpochIndex])

  useEffect(() => {
    fetchMarkets().then((markets) => {
      const currentTimestamp = Math.floor(new Date().getTime() / 1000)
      const selectedMarkets = markets
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            asset.substitutes[0].address,
          ),
        )
        .sort((a, b) => Number(a.epoch) - Number(b.epoch))

      setProceeds(
        selectedMarkets
          .map((_, i) => selectedMarkets.slice(0, i + 1))
          .map((markets) => {
            const { apy, proceeds, epochEnd } = calculateDepositApy(
              asset.substitutes[0],
              markets.map(
                (market) =>
                  new Market(
                    market.address,
                    market.orderToken,
                    market.takerFee,
                    market.quoteUnit,
                    market.epoch,
                    market.startTimestamp,
                    market.endTimestamp,
                    market.quoteToken,
                    market.baseToken,
                    market.quotePrecisionComplement,
                    market.basePrecisionComplement,
                    market.bids,
                    market.asks,
                  ),
              ),
              new BigNumber(value).isNaN() ? 0n : amount,
              currentTimestamp,
            )
            return {
              date: epochEnd.toISOString().slice(2, 10).replace(/-/g, '/'),
              profit: (
                Number(proceeds) /
                10 ** asset.underlying.decimals
              ).toFixed(4),
              apy: isNaN(apy) ? 0 : apy,
              proceed: proceeds,
            }
          }),
      )
    })
  }, [amount, asset.substitutes, asset.underlying.decimals, value])

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
            <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
              <div className="flex flex-col gap-4">
                <div className="font-bold text-sm sm:text-lg">
                  How much would you like to deposit?
                </div>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex flex-col flex-1 justify-between gap-2">
                    <NumberInput
                      className="text-xl sm:text-2xl placeholder-gray-400 outline-none bg-transparent w-40 sm:w-auto"
                      value={value}
                      onValueChange={setValue}
                      onBlur={onBlurValue}
                      placeholder="0.0000"
                    />
                    <div className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                      <ClientComponent>
                        <>
                          ~$ {Number(value) * prices[asset.underlying.address]}
                        </>
                      </ClientComponent>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                      <img
                        src={getLogo(asset.underlying)}
                        alt={asset.underlying.name}
                        className="w-5 h-5"
                      />
                      <div className="text-sm sm:text-base">
                        {asset.underlying.symbol}
                      </div>
                    </div>
                    <div className="flex text-xs sm:text-sm gap-1 sm:gap-2">
                      <div className="text-gray-500">Available</div>
                      <div>
                        <ClientComponent>
                          <>
                            {formatUnits(
                              balances[asset.underlying.address] || 0n,
                              asset.underlying.decimals,
                            )}
                          </>
                        </ClientComponent>
                      </div>
                      <button className="text-green-500" onClick={setMaxValue}>
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
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
                <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="sm:px-6 sm:mb-2">
                    <Slider
                      value={selectedEpochIndex}
                      onValueChange={setSelected}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    {proceeds.map(({ date, profit }, i) => (
                      <button
                        key={i}
                        className="flex sm:flex-col items-center gap-1 sm:gap-2 sm:w-[72px]"
                        onClick={() => setSelected(i + 1)}
                      >
                        <div className="text-sm w-20 sm:w-fit text-start">
                          {date}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedEpochIndex === i + 1
                              ? 'bg-gray-100 dark:bg-white dark:bg-opacity-10'
                              : selectedEpochIndex <= i + 1
                              ? 'bg-green-500 text-green-500 bg-opacity-10'
                              : 'bg-red-500 text-red-500 bg-opacity-10'
                          }`}
                        >
                          {selectedEpochIndex <= i + 1
                            ? `+${profit}`
                            : `-${profit}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex p-4 border-solid border-[1.5px] border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-3">
                <div className="flex flex-col flex-1">
                  <label className="font-bold text-sm sm:text-lg">
                    Your interest payout will be
                  </label>
                  <CountUp
                    end={proceeds
                      .slice(0, selectedEpochIndex)
                      .reduce((acc, { profit }) => acc + +profit, 0)}
                    suffix={` ${asset.underlying.symbol}`}
                    className={`flex gap-2 ${
                      selectedEpochIndex === 0 ? 'text-gray-400' : ''
                    } text-xl`}
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
                disabled={amount === 0n || selectedEpochIndex === 0}
                className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
                onClick={() =>
                  deposit(
                    asset,
                    amount,
                    selectedEpochIndex,
                    proceeds
                      .slice(0, selectedEpochIndex)
                      .reduce((acc, { proceed }) => acc + proceed, 0n),
                    10,
                  )
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
