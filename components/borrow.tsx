import React from 'react'

import { useBorrowContext } from '../contexts/borrow-context'

const Position = ({
  name,
  symbol,
  logo,
  apy,
  borrowed,
  collateral,
  collateralSymbol,
  expiry,
  price,
  // collateralPrice,
  ltv,
  liquidationThreshold,
  ...props
}: {
  name: string
  symbol: string
  logo: string
  apy: string
  borrowed: string
  collateral: string
  collateralSymbol: string
  expiry: string
  price: string
  collateralPrice: string
  ltv: string
  liquidationThreshold: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="rounded-xl shadow bg-gray-50 dark:bg-gray-900" {...props}>
      <div className="flex justify-between rounded-t-xl p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <img src={logo} alt={name} className="w-8 h-8" />
          <div className="flex flex-col">
            <div className="font-bold">{symbol}</div>
            <div className="text-gray-500 text-sm">{name}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">{apy}</div>
          <div className="text-sm">{expiry}</div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>Borrow Amount</div>
            <div className="flex gap-1 text-sm">
              <span>{borrowed}</span>
              (${+borrowed * +price})
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Collateral</div>
            <div className="text-sm">
              ${collateral} {collateralSymbol}
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>LTV</div>
            <div className="flex text-green-500 text-sm">{ltv}</div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Liquidation Threshold</div>
            <div className="flex text-sm">{liquidationThreshold}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs">
            Borrow More
          </button>
          <button className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs">
            Repay
          </button>
        </div>
      </div>
    </div>
  )
}

const Asset = ({
  name,
  symbol,
  logo,
  apy,
  available,
  borrowed,
  liquidationThreshold,
  price,
  ...props
}: {
  name: string
  symbol: string
  logo: string
  apy: string
  available: string
  borrowed: string
  liquidationThreshold: string
  price: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-gray-800"
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 w-[140px]">
          <img src={logo} alt={name} className="w-8 h-8" />
          <div className="flex flex-col">
            <div className="font-bold">{symbol}</div>
            <div className="text-gray-500 text-xs">{name}</div>
          </div>
        </div>
        <div className="font-bold w-[80px]">{apy}</div>
        <div className="flex flex-col w-[120px]">
          <div className="text-sm">
            {available} {symbol}
          </div>
          <div className="text-xs text-gray-500">${+available * +price}</div>
        </div>
        <div className="flex flex-col w-[120px]">
          <div className="text-sm">
            {borrowed} {symbol}
          </div>
          <div className="text-xs text-gray-500">${+borrowed * +price}</div>
        </div>
        <div className="flex flex-col w-[120px] text-sm">
          {liquidationThreshold}
        </div>
      </div>
      <button className="bg-green-500 h-fit w-24 rounded px-3 py-2 font-bold text-xs text-white">
        Borrow
      </button>
    </div>
  )
}

const Borrow = () => {
  const { positions, assets } = useBorrowContext()
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-bold text-[48px] mt-12 mb-16">
        The Best Fixed-Rate Borrowing in DeFi
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
              <div className="text-gray-500">Total Borrow Amount</div>
              <div className="font-bold">
                $
                {positions.reduce(
                  (acc, position) => +position.price * +position.borrowed + acc,
                  0,
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-gray-500">Total Collateral</div>
              <div className="font-bold">
                $
                {positions.reduce(
                  (acc, position) =>
                    +position.collateralPrice * +position.collateral + acc,
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
                name={position.name}
                symbol={position.symbol}
                logo={position.logo}
                apy={position.apy}
                borrowed={position.borrowed}
                collateral={position.collateral}
                collateralSymbol={position.collateralSymbol}
                expiry={position.expiry}
                price={position.price}
                collateralPrice={position.collateralPrice}
                ltv={position.ltv}
                liquidationThreshold={position.liquidationThreshold}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <h2 className="font-bold text-2xl">Assets to borrow</h2>
          <div className="text-gray-500">
            Borrow with fixed rates against your crypto assets
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label htmlFor="epoch">How long are you going to borrow?</label>
          <select
            name="epoch"
            id="epoch"
            className="shadow px-3 py-2 bg-white dark:bg-gray-800 rounded-lg outline-none"
          >
            <option value="23-12-31">23-12-31</option>
            <option value="24-06-01">24-06-01</option>
            <option value="24-12-31">24-12-31</option>
            <option value="25-06-01">25-06-01</option>
            <option value="25-12-31">25-12-31</option>
          </select>
        </div>
        <div className="flex flex-col shadow bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-12 gap-4">
          <div className="flex gap-4 text-gray-500 text-xs">
            <div className="w-[156px]">Asset</div>
            <div className="w-[80px]">APY</div>
            <div className="w-[120px]">Available</div>
            <div className="w-[120px]">Total Borrowed</div>
            <div className="w-[136px]">Liquidation Threshold</div>
          </div>
          <div className="flex flex-col gap-3">
            {assets.map((asset, i) => (
              <Asset
                key={i}
                name={asset.name}
                symbol={asset.symbol}
                logo={asset.logo}
                apy={asset.apy}
                available={asset.available}
                borrowed={asset.borrowed}
                price={asset.price}
                liquidationThreshold={asset.liquidationThreshold}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Borrow
