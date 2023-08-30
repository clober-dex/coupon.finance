import React, { useState } from 'react'
import Link from 'next/link'
import { parseUnits } from 'viem'

import { useDepositContext } from '../contexts/deposit-context'
import { Currency, getLogo } from '../model/currency'
import { AssetStatus } from '../model/asset'
import { useCurrencyContext } from '../contexts/currency-context'
import { formatDollarValue, formatUnits } from '../utils/numbers'
import { Epoch } from '../model/epoch'

import WithdrawModal from './modal/withdraw-modal'
import EpochSelect from './epoch-select'
import { ClientComponent } from './client-component'

const Position = ({
  currency,
  apy,
  interestEarned,
  deposited,
  expiry,
  price,
  onWithdraw,
  ...props
}: {
  currency: Currency
  apy: string
  interestEarned: string
  deposited: string
  expiry: string
  price: string
  onWithdraw: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="rounded-xl shadow bg-gray-50 dark:bg-gray-900" {...props}>
      <div className="flex justify-between rounded-t-xl p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={getLogo(currency)}
            alt={currency.name}
            className="w-8 h-8"
          />
          <div className="flex flex-col">
            <div className="font-bold">{currency.symbol}</div>
            <div className="text-gray-500 text-sm">{currency.name}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">{apy}</div>
          <div className="text-xs sm:text-sm">{expiry}</div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Interest</div>
            <div className="text-xs sm:text-sm">${interestEarned}</div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Deposited</div>
            <div className="flex gap-1 text-xs sm:text-sm">
              {deposited}
              <span className="text-gray-500">(${+deposited * +price})</span>
            </div>
          </div>
        </div>
        <button
          className="bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
          onClick={onWithdraw}
        >
          {/*TODO: Use Collect when expired*/}
          Withdraw
        </button>
      </div>
    </div>
  )
}

const Asset = ({
  currency,
  apy,
  available,
  deposited,
  price,
  ...props
}: {
  currency: Currency
  apy: number
  available: bigint
  deposited: bigint
  price: number
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl sm:p-4 bg-gray-50 sm:bg-white dark:bg-gray-900 shadow-md"
      {...props}
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className="flex justify-between w-full sm:w-auto items-center gap-4 bg-white p-4 rounded-t-xl dark:bg-gray-800 dark:sm:bg-gray-900 sm:p-0 mb-2 sm:mb-0">
          <div className="flex items-center gap-3 sm:w-[140px]">
            <img
              src={getLogo(currency)}
              alt={currency.name}
              className="w-8 h-8"
            />
            <div className="flex flex-col gap-0.5 sm:gap-0">
              <div className="font-bold text-sm sm:text-base">
                {currency.symbol}
              </div>
              <div className="text-gray-500 text-xs">{currency.name}</div>
            </div>
          </div>
          <ClientComponent className="text-sm font-bold sm:w-[80px]">
            {apy.toFixed(2)}
          </ClientComponent>
        </div>
        <div className="flex flex-row sm:flex-col w-full sm:w-[136px] justify-between px-4 sm:p-0">
          <div className="sm:hidden text-gray-500 text-xs">Available</div>
          <ClientComponent className="flex flex-row sm:flex-col items-center sm:items-start gap-1 sm:gap-0">
            <div className="text-xs sm:text-sm">
              {formatUnits(available, currency.decimals, price)}{' '}
              {currency.symbol}
            </div>
            <div className="text-xs text-gray-500">
              <span className="sm:hidden">(</span>
              {formatDollarValue(available, currency.decimals, price)}
              <span className="sm:hidden">)</span>
            </div>
          </ClientComponent>
        </div>
        <div className="flex flex-row sm:flex-col w-full sm:w-[120px] justify-between px-4 sm:p-0">
          <div className="sm:hidden text-gray-500 text-xs">Deposited</div>
          <ClientComponent className="flex flex-row sm:flex-col sm:w-[120px] gap-1 sm:gap-0">
            <div className="text-xs sm:text-sm">
              {formatUnits(deposited, currency.decimals, price)}{' '}
              {currency.symbol}
            </div>
            <div className="text-xs text-gray-500">
              <span className="sm:hidden">(</span>
              {formatDollarValue(deposited, currency.decimals, price)}
              <span className="sm:hidden">)</span>
            </div>
          </ClientComponent>
        </div>
      </div>
      <Link
        href={`/deposit/${currency.symbol}`}
        className="flex items-center justify-center bg-green-500 m-4 sm:m-0 sm:h-fit sm:w-24 rounded px-3 py-2 font-bold text-xs text-white"
      >
        Deposit
      </Link>
    </div>
  )
}

const Deposit = ({
  assetStatuses,
  epochs,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}) => {
  const { prices } = useCurrencyContext()
  const { positions } = useDepositContext()
  const [withdrawPosition, setWithdrawPosition] = useState<{
    currency: Currency
    amount: string
  } | null>(null)
  const [epoch, setEpoch] = useState(epochs[0])
  return (
    <div className="flex flex-1 flex-col w-full sm:w-fit">
      <h1 className="flex justify-center text-center font-bold text-lg sm:text-[48px] sm:leading-[48px] mt-8 sm:mt-12 mb-8 sm:mb-16">
        Term Deposit <br className="flex sm:hidden" /> for the Best Rates in
        DeFi
      </h1>
      {positions.length > 0 ? (
        <div className="flex flex-col gap-6 mb-12 sm:mb-20 px-4 sm:p-0">
          <div className="flex gap-2 sm:gap-3 items-center">
            <h2 className="font-bold text-base sm:text-2xl">My Positions</h2>
            <div className="font-bold text-sm bg-gray-200 dark:bg-gray-700 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1">
              {positions.length}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-sm shadow sm:w-fit bg-white dark:bg-gray-900 px-4 py-3 rounded-xl sm:rounded-lg">
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Total Deposit</div>
              <div className="font-bold">
                $
                {positions.reduce(
                  (acc, position) =>
                    +position.price * +position.deposited + acc,
                  0,
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Total Earned</div>
              <div className="font-bold">
                $
                {positions.reduce(
                  (acc, position) =>
                    +position.price * +position.interestEarned + acc,
                  0,
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Average APY</div>
              <div className="font-bold">5.0%</div>
            </div>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-6">
            {positions.map((position, i) => (
              <Position
                key={i}
                currency={position.currency}
                apy={position.apy}
                interestEarned={position.interestEarned}
                deposited={position.deposited}
                expiry={position.expiry}
                price={position.price}
                onWithdraw={() =>
                  setWithdrawPosition({
                    currency: position.currency,
                    amount: position.deposited,
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:p-0">
        <div className="flex items-center gap-6 justify-between">
          <h2 className="font-bold text-base sm:text-2xl">Assets to deposit</h2>
          <div className="flex items-center gap-6">
            <label htmlFor="epoch" className="hidden sm:flex">
              How long are you going to deposit?
            </label>
            <EpochSelect
              epochs={epochs}
              value={epoch}
              onValueChange={setEpoch}
            />
          </div>
        </div>
        <div className="flex flex-col mb-12 gap-4">
          <div className="hidden sm:flex gap-4 text-gray-500 text-xs">
            <div className="w-[156px]">Asset</div>
            <div className="w-[80px]">APY</div>
            <div className="w-[136px]">Available</div>
            <div className="w-[152px]">Total Deposited</div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-3">
            {assetStatuses
              .filter(({ epochId }) => epoch.id === epochId)
              .map((assetStatus, i) => (
                <Asset
                  key={i}
                  currency={assetStatus.underlying}
                  apy={0}
                  available={parseUnits(
                    assetStatus.totalAvailable,
                    assetStatus.underlying.decimals,
                  )}
                  deposited={parseUnits(
                    assetStatus.totalDeposits,
                    assetStatus.underlying.decimals,
                  )}
                  price={prices[assetStatus.underlying.address] ?? 0}
                />
              ))}
          </div>
        </div>
      </div>
      <WithdrawModal
        position={withdrawPosition}
        onClose={() => setWithdrawPosition(null)}
      />
    </div>
  )
}

export default Deposit
