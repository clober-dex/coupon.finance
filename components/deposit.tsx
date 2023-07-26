import React from 'react'
import Link from 'next/link'

import { useDepositContext } from '../contexts/deposit-context'
import { Currency } from '../utils/currency'

const Position = ({
  currency,
  apy,
  interestEarned,
  deposited,
  expiry,
  price,
  ...props
}: {
  currency: Currency
  apy: string
  interestEarned: string
  deposited: string
  expiry: string
  price: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="rounded-xl shadow bg-gray-50 dark:bg-gray-900" {...props}>
      <div className="flex justify-between rounded-t-xl p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <img src={currency.logo} alt={currency.name} className="w-8 h-8" />
          <div className="flex flex-col">
            <div className="font-bold">{currency.symbol}</div>
            <div className="text-gray-500 text-sm">{currency.name}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">{apy}</div>
          <div className="text-sm">{expiry}</div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Earned Interest</div>
            <div className="text-sm">${interestEarned}</div>
          </div>
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>Deposited</div>
            <div className="flex gap-1 text-sm">
              <span>{deposited}</span>
              (${+deposited * +price})
            </div>
          </div>
        </div>
        <button className="bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs">
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
  apy: string
  available: string
  deposited: string
  price: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-gray-800"
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 w-[140px]">
          <img src={currency.logo} alt={currency.name} className="w-8 h-8" />
          <div className="flex flex-col">
            <div className="font-bold">{currency.symbol}</div>
            <div className="text-gray-500 text-xs">{currency.name}</div>
          </div>
        </div>
        <div className="font-bold w-[80px]">{apy}</div>
        <div className="flex flex-col w-[136px]">
          <div className="text-sm">
            {available} {currency.symbol}
          </div>
          <div className="text-xs text-gray-500">${+available * +price}</div>
        </div>
        <div className="flex flex-col w-[152px]">
          <div className="text-sm">
            {deposited} {currency.symbol}
          </div>
          <div className="text-xs text-gray-500">${+deposited * +price}</div>
        </div>
      </div>
      <Link
        href={`/deposit/${currency.symbol}`}
        className="flex items-center justify-center bg-green-500 h-fit w-24 rounded px-3 py-2 font-bold text-xs text-white"
      >
        Deposit
      </Link>
    </div>
  )
}

const Deposit = () => {
  const { positions, assets } = useDepositContext()
  return (
    <div className="flex flex-1 flex-col text-gray-950 dark:text-white ">
      <h1 className="font-bold text-[48px] mt-12 mb-16">
        Term Deposit for the Best Rates in DeFi
      </h1>
      {positions.length > 0 ? (
        <div className="flex flex-col gap-6 mb-20">
          <div className="flex gap-3 items-center">
            <h2 className="font-bold text-2xl">My Positions</h2>
            <div className="font-bold text-sm bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
              {positions.length}
            </div>
          </div>
          <div className="flex gap-8 text-sm shadow w-fit dark:bg-gray-900 px-4 py-3 rounded-lg">
            <div className="flex gap-3">
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
            <div className="flex gap-3">
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
            <div className="flex gap-3">
              <div className="text-gray-500">Average APY</div>
              <div className="font-bold">5.0%</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {positions.map((position, i) => (
              <Position
                key={i}
                currency={position.currency}
                apy={position.apy}
                interestEarned={position.interestEarned}
                deposited={position.deposited}
                expiry={position.expiry}
                price={position.price}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl">Assets to deposit</h2>
          <div className="text-gray-500">
            Provide liquidity and earn interest
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label htmlFor="epoch">How long are you going to deposit?</label>
          <select
            name="epoch"
            id="epoch"
            className="shadow px-3 py-2 bg-white dark:bg-gray-800 rounded-lg outline-none"
          >
            <option value="23-12-31">23-12-31</option>
            <option value="24-06-30">24-06-30</option>
            <option value="24-12-31">24-12-31</option>
            <option value="25-06-30">25-06-30</option>
            <option value="25-12-31">25-12-31</option>
          </select>
        </div>
        <div className="flex flex-col shadow bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-12 gap-4">
          <div className="flex gap-4 text-gray-500 text-xs">
            <div className="w-[156px]">Asset</div>
            <div className="w-[80px]">APY</div>
            <div className="w-[136px]">Available</div>
            <div className="w-[152px]">Total Deposited</div>
          </div>
          <div className="flex flex-col gap-3">
            {assets.map((asset, i) => (
              <Asset
                key={i}
                currency={asset.currency}
                apy={asset.apy}
                available={asset.available}
                deposited={asset.deposited}
                price={asset.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deposit
