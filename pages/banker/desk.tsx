import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { isAddressEqual } from 'viem'
import { useQuery } from 'wagmi'

import { Currency } from '../../model/currency'
import { useCurrencyContext } from '../../contexts/currency-context'
import { SwapForm } from '../../components/form/swap-form'
import { useAdvancedContractContext } from '../../contexts/advanced-contract-context'
import {
  BigDecimal,
  formatUnits,
  parseUnits,
  toPlacesString,
} from '../../utils/numbers'
import CurrencyAmountInput from '../../components/input/currency-amount-input'
import Slider from '../../components/slider'
import {
  currentTimestampInSeconds,
  formatDate,
  getDaysBetweenDates,
  getNextMonthStartTimestamp,
  SECONDS_IN_MONTH,
} from '../../utils/date'
import { DotSvg } from '../../components/svg/dot-svg'
import {
  ActionButton,
  ActionButtonProps,
} from '../../components/button/action-button'
import { CurrencyDropdown } from '../../components/dropdown/currency-dropdown'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import DownSvg from '../../components/svg/down-svg'
import { fetchMarkets } from '../../apis/market'
import { useChainContext } from '../../contexts/chain-context'
import { useDepositContext } from '../../contexts/deposit-context'
import { BankerPositionCard } from '../../components/card/banker-position-card'

const CouponUtilsForm = ({
  currencies,
  depositCurrency,
  setDepositCurrency,
  maxDepositAmount,
  dates,
  inputCurrencyAmount,
  setInputCurrencyAmount,
  epochs,
  setEpochs,
  actionButtonProps,
  depositAssetPrice,
}: {
  currencies: Currency[]
  depositCurrency?: Currency
  setDepositCurrency: (currency: Currency) => void
  maxDepositAmount: bigint
  dates: string[]
  inputCurrencyAmount: string
  setInputCurrencyAmount: (value: string) => void
  epochs: number
  setEpochs: (value: number) => void
  actionButtonProps: ActionButtonProps
  depositAssetPrice?: BigDecimal
}) => {
  const currentTimestamp = currentTimestampInSeconds()
  const leftMonthInSecond =
    getNextMonthStartTimestamp(currentTimestamp) - currentTimestamp
  const minPosition =
    (leftMonthInSecond /
      (leftMonthInSecond + SECONDS_IN_MONTH * dates.length)) *
    100

  return (
    <>
      <div className="flex flex-col bg-white gap-4 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 sm:pb-4 w-full sm:w-[480px]">
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            How much would you like to deposit?
          </div>
          <CurrencyAmountInput
            currency={depositCurrency}
            value={inputCurrencyAmount}
            onValueChange={setInputCurrencyAmount}
            availableAmount={maxDepositAmount}
            price={depositAssetPrice}
            disabled={!depositCurrency}
          >
            <CurrencyDropdown
              selectedCurrency={depositCurrency}
              currencies={currencies}
              onCurrencySelect={(currency) => {
                setDepositCurrency(currency)
              }}
            >
              {depositCurrency ? (
                <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                  <CurrencyIcon
                    currency={depositCurrency}
                    className="w-5 h-5"
                  />
                  <div className="text-sm sm:text-base">
                    {depositCurrency.symbol}
                  </div>
                </div>
              ) : (
                <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                  Select token <DownSvg />
                </div>
              )}
            </CurrencyDropdown>
          </CurrencyAmountInput>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-gray-500 text-xs sm:text-sm">
              Select the number of days you want to deposit
            </div>
          </div>
          <div className="flex justify-between flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 pb-8 sm:pb-0 sm:h-[90px]">
            {!depositCurrency ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              </div>
            ) : (
              <></>
            )}
            {depositCurrency && dates.length > 0 ? (
              <div className="sm:px-6 sm:mb-2 mr-4 sm:mr-0">
                <div>
                  <Slider
                    segments={dates.length}
                    minPosition={minPosition}
                    value={epochs}
                    onValueChange={setEpochs}
                    renderControl={() => (
                      <div className="flex w-[110px] flex-col items-center gap-2 shrink-0">
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                          {getDaysBetweenDates(
                            new Date(dates[epochs]),
                            new Date(currentTimestamp * 1000),
                          )}{' '}
                          Days
                        </div>
                        <DotSvg />
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                          {dates[epochs]}
                        </div>
                      </div>
                    )}
                  >
                    <div className="flex w-[96px] flex-col items-center gap-3 shrink-0">
                      <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                        {getDaysBetweenDates(
                          new Date(dates[epochs]),
                          new Date(currentTimestamp * 1000),
                        )}{' '}
                        Days
                      </div>
                      <DotSvg />
                      <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                        {dates[epochs]}
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
    </>
  )
}

const Desk = () => {
  const { selectedChain } = useChainContext()
  const { positions, collect } = useDepositContext()
  const {
    mintSubstitute,
    burnSubstitute,
    mintCoupon,
    burnCoupon,
    unWrapCouponERC20ToERC1155,
  } = useAdvancedContractContext()
  const {
    assets,
    prices,
    balances,
    epochs: allEpochs,
    coupons: allCoupons,
  } = useCurrencyContext()
  const [mode, _setMode] = useState<'substitute' | 'coupon'>('substitute')
  const [inputCurrency, setInputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState('')
  const [outputCurrency, setOutputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [showInputCurrencySelect, setShowInputCurrencySelect] = useState(false)

  const [epochs, setEpochs] = useState(0)

  const currencies = useMemo(() => {
    return [
      ...(mode === 'substitute'
        ? [
            ...assets.map((asset) => asset.underlying),
            ...assets.map((asset) => asset.substitutes).flat(),
          ]
        : assets.map((asset) => asset.underlying)),
    ]
  }, [assets, mode])

  const setMode = useCallback((mode: 'substitute' | 'coupon') => {
    _setMode(mode)
    setInputCurrency(undefined)
    setInputCurrencyAmount('')
    setOutputCurrency(undefined)
  }, [])

  const [inputAmount, substitute] = useMemo(
    () => [
      parseUnits(inputCurrencyAmount, inputCurrency?.decimals ?? 18),
      inputCurrency
        ? assets.find((asset) =>
            isAddressEqual(asset.underlying.address, inputCurrency.address),
          )?.substitutes?.[0]
        : undefined,
    ],
    [assets, inputCurrency, inputCurrencyAmount],
  )

  const buttonText = useMemo(() => {
    if (!inputCurrency || !outputCurrency) {
      return 'Select Token'
    }
    const underlyingAddresses = assets
      .map((asset) => asset.underlying)
      .map((currency) => currency.address)
    if (mode === 'substitute') {
      const substituteAddresses = assets
        .map((asset) => asset.substitutes)
        .flat()
        .map((currency) => currency.address)
      if (
        substituteAddresses.includes(inputCurrency.address) &&
        underlyingAddresses.includes(outputCurrency.address) &&
        inputCurrency.symbol.includes(outputCurrency.symbol)
      ) {
        return 'Burn Substitute'
      } else if (
        underlyingAddresses.includes(inputCurrency.address) &&
        substituteAddresses.includes(outputCurrency.address) &&
        outputCurrency.symbol.includes(inputCurrency.symbol)
      ) {
        return 'Mint Substitute'
      }
    }
    return 'Cannot Convert'
  }, [assets, inputCurrency, mode, outputCurrency])

  useEffect(() => {
    setInputCurrency(undefined)
    setInputCurrencyAmount('')
    setOutputCurrency(undefined)
  }, [mode])

  useEffect(() => {
    if (mode === 'substitute' && inputCurrency) {
      setOutputCurrency(
        currencies
          .filter(
            (currency) =>
              !isAddressEqual(currency.address, inputCurrency.address),
          )
          .find((currency) => currency.symbol.includes(inputCurrency.symbol)) ||
          currencies
            .filter(
              (currency) =>
                !isAddressEqual(currency.address, inputCurrency.address),
            )
            .find((currency) => inputCurrency.symbol.includes(currency.symbol)),
      )
    }
  }, [currencies, inputCurrency, inputCurrency?.address, mode])

  const { data: allMarkets } = useQuery(
    ['desk-markets', selectedChain],
    async () => {
      return fetchMarkets(selectedChain.id)
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    },
  )
  const now = currentTimestampInSeconds()

  return (
    <div className="flex flex-1">
      <Head>
        <title>The Banker&apos;s Desk</title>
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16">
          The Banker&apos;s Desk
        </h1>

        <div className="flex w-full flex-col items-center gap-4 sm:gap-6 p-4 pb-0">
          <div className="relative flex gap-4 mt-8">
            <button
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
              onClick={() => {
                setMode('substitute')
              }}
              disabled={'substitute' === mode}
            >
              Substitute
            </button>
            <button
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
              onClick={() => {
                setMode('coupon')
              }}
              disabled={'coupon' === mode}
            >
              Coupon
            </button>
          </div>
          <div className="flex flex-col w-fit">
            <div className="flex flex-col w-full lg:flex-row gap-4">
              <div className="flex flex-col">
                {mode === 'substitute' ? (
                  <div className="flex flex-col rounded-2xl px-6 py-8 sm:w-[528px] lg:w-[480px] bg-white dark:bg-gray-900">
                    <SwapForm
                      inputCurrencies={currencies}
                      outputCurrencies={[]}
                      balances={balances}
                      prices={prices}
                      showInputCurrencySelect={showInputCurrencySelect}
                      setShowInputCurrencySelect={setShowInputCurrencySelect}
                      inputCurrency={inputCurrency}
                      setInputCurrency={setInputCurrency}
                      inputCurrencyAmount={inputCurrencyAmount}
                      setInputCurrencyAmount={setInputCurrencyAmount}
                      availableInputCurrencyBalance={
                        inputCurrency
                          ? balances[inputCurrency.address] ?? 0n
                          : 0n
                      }
                      showOutputCurrencySelect={false}
                      setShowOutputCurrencySelect={() => {}}
                      outputCurrency={outputCurrency}
                      setOutputCurrency={setOutputCurrency}
                      outputCurrencyAmount={inputCurrencyAmount}
                      showSlippageSelect={false}
                      actionButtonProps={{
                        disabled:
                          buttonText === 'Cannot Convert' ||
                          buttonText === 'Select Token' ||
                          inputAmount === 0n,
                        onClick: async () => {
                          if (!inputCurrency || !outputCurrency) {
                            return
                          }
                          if (buttonText === 'Burn Substitute') {
                            await burnSubstitute(
                              inputCurrency,
                              outputCurrency,
                              inputAmount,
                            )
                          } else if (buttonText === 'Mint Substitute') {
                            await mintSubstitute(
                              inputCurrency,
                              outputCurrency,
                              inputAmount,
                            )
                          }
                        },
                        text: buttonText,
                      }}
                    />
                  </div>
                ) : (
                  <CouponUtilsForm
                    currencies={currencies}
                    depositCurrency={inputCurrency}
                    setDepositCurrency={setInputCurrency}
                    maxDepositAmount={
                      inputCurrency ? balances[inputCurrency.address] ?? 0n : 0n
                    }
                    dates={
                      allMarkets
                        ? allMarkets
                            .filter(
                              (market) =>
                                substitute &&
                                isAddressEqual(
                                  substitute.address,
                                  market.quoteToken.address,
                                ),
                            )
                            .slice(0, 13)
                            .map(({ endTimestamp }) =>
                              formatDate(new Date(endTimestamp * 1000)),
                            )
                        : []
                    }
                    inputCurrencyAmount={inputCurrencyAmount}
                    setInputCurrencyAmount={setInputCurrencyAmount}
                    epochs={epochs}
                    setEpochs={setEpochs}
                    actionButtonProps={{
                      disabled: !inputCurrency || inputAmount === 0n,
                      onClick: async () => {
                        if (!inputCurrency) {
                          return
                        }
                        const asset = assets.find((asset) =>
                          isAddressEqual(
                            asset.underlying.address,
                            inputCurrency.address,
                          ),
                        )
                        if (asset) {
                          await mintCoupon(
                            asset,
                            inputAmount,
                            allEpochs[0].id + epochs,
                          )
                        }
                      },
                      text: 'Mint Coupon',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {'coupon' === mode ? (
            <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px]">
              <div className="flex flex-col gap-6 mb-8 px-4 lg:p-0">
                <div className="flex gap-2 sm:gap-3 items-center">
                  <h2 className="font-bold text-base sm:text-2xl">
                    My Positions
                  </h2>
                </div>
                <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
                  {positions
                    .filter(({ interest }) => interest === 0n)
                    .sort(
                      (a, b) =>
                        Number(a.toEpoch.endTimestamp) -
                        Number(b.toEpoch.endTimestamp),
                    )
                    .map((position, index) => {
                      const coupons = allCoupons.filter(
                        ({ market }) =>
                          isAddressEqual(
                            market.quoteToken.address,
                            position.substitute.address,
                          ) &&
                          position.toEpoch.endTimestamp >= market.endTimestamp,
                      )
                      return (
                        <BankerPositionCard
                          key={index}
                          position={position}
                          price={prices[position.underlying.address]}
                        >
                          {coupons.map((coupon, index) => {
                            const { market, erc1155Balance } = coupon
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-1 self-stretch"
                              >
                                <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
                                  {market.baseToken.symbol}
                                </div>
                                <div
                                  className={`text-sm sm:text-base font-bold ${
                                    erc1155Balance >= position.amount
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                  }`}
                                >
                                  {toPlacesString(
                                    formatUnits(
                                      erc1155Balance,
                                      market.baseToken.decimals,
                                    ),
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          {position.toEpoch.endTimestamp < now ? (
                            <button
                              className="w-full bg-blue-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-blue-500 font-bold px-3 py-2 rounded text-sm"
                              onClick={async () => {
                                await collect(position)
                              }}
                              disabled={false}
                            >
                              Collect Deposit
                            </button>
                          ) : coupons.some(({ balance }) => {
                              return balance < position.amount
                            }) ? (
                            <button
                              className="w-full bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
                              disabled={true}
                            >
                              Insufficient Coupon
                            </button>
                          ) : coupons.some(({ erc1155Balance }) => {
                              return erc1155Balance < position.amount
                            }) ? (
                            <button
                              className="w-full bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
                              onClick={async () => {
                                await unWrapCouponERC20ToERC1155(
                                  position.amount,
                                  coupons,
                                )
                              }}
                              disabled={false}
                            >
                              Unwrap
                            </button>
                          ) : (
                            <button
                              className="w-full bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
                              onClick={async () => {
                                await burnCoupon(
                                  position.tokenId,
                                  position.toEpoch.id,
                                )
                              }}
                              disabled={false}
                            >
                              Withdraw
                            </button>
                          )}
                        </BankerPositionCard>
                      )
                    })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  )
}

export default Desk
