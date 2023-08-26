import React, { SVGProps, useState } from 'react'
import Link from 'next/link'
import { formatUnits } from 'viem'

import { useBorrowContext } from '../contexts/borrow-context'
import { Currency, getLogo } from '../model/currency'
import { Asset } from '../model/asset'
import { formatDollarValue } from '../utils/numbers'

import RepayModal from './modal/repay-modal'
import BorrowMoreModal from './modal/borrow-more-modal'
import EditCollateralModal from './modal/edit-collateral-modal'
import EditExpiryModal from './modal/edit-expiry-modal'
import DateSelect from './date-select'

const EditSvg = (props: SVGProps<any>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 13.4999H3C2.86739 13.4999 2.74021 13.4472 2.64645 13.3535C2.55268 13.2597 2.5 13.1325 2.5 12.9999V10.207C2.5 10.1414 2.51293 10.0764 2.53806 10.0157C2.56319 9.95503 2.60002 9.89991 2.64645 9.85348L10.1464 2.35348C10.2402 2.25971 10.3674 2.20703 10.5 2.20703C10.6326 2.20703 10.7598 2.25971 10.8536 2.35348L13.6464 5.14637C13.7402 5.24014 13.7929 5.36732 13.7929 5.49992C13.7929 5.63253 13.7402 5.75971 13.6464 5.85348L6 13.4999Z"
      stroke="#22C55E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4L12 7.5"
      stroke="#22C55E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5004 13.4999H6.00041L2.53223 10.0317"
      stroke="#22C55E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Position = ({
  currency,
  apy,
  borrowed,
  collateral,
  collateralSymbol,
  expiry,
  price,
  collateralPrice,
  ltv,
  liquidationThreshold,
  onRepay,
  onBorrowMore,
  onEditCollateral,
  onEditExpiry,
  ...props
}: {
  currency: Currency
  apy: string
  borrowed: string
  collateral: string
  collateralSymbol: string
  expiry: string
  price: string
  collateralPrice: string
  ltv: string
  liquidationThreshold: string
  onRepay: () => void
  onBorrowMore: () => void
  onEditCollateral: () => void
  onEditExpiry: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  collateralPrice // TODO remove
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
          <div className="flex items-center gap-1">
            <div className="text-xs sm:text-sm">{expiry}</div>
            <button>
              <EditSvg onClick={onEditExpiry} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Borrow Amount</div>
            <div className="flex gap-1 text-xs sm:text-sm">
              {borrowed}
              <span className="text-gray-500">(${+borrowed * +price})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Collateral</div>
            <div className="flex items-center gap-1">
              <div className="text-xs sm:text-sm">
                ${collateral} {collateralSymbol}
              </div>
              <button>
                <EditSvg onClick={onEditCollateral} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>LTV</div>
            <div className="flex text-green-500 text-xs sm:text-sm">{ltv}</div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Liquidation Threshold</div>
            <div className="flex text-xs sm:text-sm">
              {liquidationThreshold}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onBorrowMore}
          >
            Borrow More
          </button>
          <button
            className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onRepay}
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  )
}

const Asset = ({
  currency,
  apy,
  available,
  borrowed,
  price,
  ...props
}: {
  currency: Currency
  apy: number
  available: bigint
  borrowed: bigint
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
          <div className="text-sm font-bold sm:w-[80px]">{apy.toFixed(2)}</div>
        </div>
        <div className="flex flex-row sm:flex-col w-full sm:w-[120px] justify-between px-4 sm:p-0">
          <div className="sm:hidden text-gray-500 text-xs">Available</div>
          <div className="flex flex-row sm:flex-col items-center sm:items-start gap-1 sm:gap-0">
            <div className="text-xs sm:text-sm">
              {formatUnits(available, currency.decimals)} {currency.symbol}
            </div>
            <div className="text-xs text-gray-500">
              <span className="sm:hidden">(</span>
              {formatDollarValue(available, currency.decimals, price)}
              <span className="sm:hidden">)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col w-full sm:w-[120px] justify-between px-4 sm:p-0">
          <div className="sm:hidden text-gray-500 text-xs">Total Borrowed</div>
          <div className="flex flex-row sm:flex-col sm:w-[120px] gap-1 sm:gap-0">
            <div className="text-xs sm:text-sm">
              {formatUnits(borrowed, currency.decimals)} {currency.symbol}
            </div>
            <div className="text-xs text-gray-500">
              <span className="sm:hidden">(</span>
              {formatDollarValue(borrowed, currency.decimals, price)}
              <span className="sm:hidden">)</span>
            </div>
          </div>
        </div>
      </div>
      <Link
        href={`/borrow/${currency.symbol}`}
        className="flex items-center justify-center bg-green-500 m-4 sm:m-0 sm:h-fit sm:w-24 rounded px-3 py-2 font-bold text-xs text-white"
      >
        Borrow
      </Link>
    </div>
  )
}

const Borrow = ({
  assets,
  prices,
}: {
  assets: Asset[]
  prices: { [address in `0x${string}`]: number }
}) => {
  const { positions, apy, available, borrowed } = useBorrowContext()
  const [repayPosition, setRepayPosition] = useState<{
    currency: Currency
    amount: string
  } | null>(null)
  const [borrowMorePosition, setBorrowMorePosition] = useState<{
    currency: Currency
    amount: string
  } | null>(null)
  const [editCollateralPosition, setEditCollateralPosition] = useState<{
    currency: Currency
    amount: string
  } | null>(null)
  const [editExpiryPosition, setEditExpiryPosition] = useState<{
    currency: Currency
    amount: string
  } | null>(null)

  return (
    <div className="flex flex-1 flex-col w-full sm:w-fit">
      <h1 className="flex justify-center text-center font-bold text-lg sm:text-[48px] sm:leading-[48px] mt-8 sm:mt-12 mb-8 sm:mb-16">
        The Best Fixed-Rate <br className="flex sm:hidden" /> Borrowing in DeFi
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
              <div className="text-gray-500">Total Borrow Amount</div>
              <div className="font-bold">
                $
                {positions.reduce(
                  (acc, position) => +position.price * +position.borrowed + acc,
                  0,
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3">
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
                borrowed={position.borrowed}
                collateral={position.collateral}
                collateralSymbol={position.collateralSymbol}
                expiry={position.expiry}
                price={position.price}
                collateralPrice={position.collateralPrice}
                ltv={position.ltv}
                liquidationThreshold={position.liquidationThreshold}
                onRepay={() =>
                  setRepayPosition({
                    currency: position.currency,
                    amount: position.borrowed,
                  })
                }
                onBorrowMore={() =>
                  setBorrowMorePosition({
                    currency: position.currency,
                    amount: position.borrowed,
                  })
                }
                onEditCollateral={() =>
                  setEditCollateralPosition({
                    currency: position.currency,
                    amount: position.collateral,
                  })
                }
                onEditExpiry={() =>
                  setEditExpiryPosition({
                    currency: position.currency,
                    amount: position.borrowed,
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
          <h2 className="font-bold text-base sm:text-2xl">Assets to borrow</h2>
          <div className="flex items-center gap-6">
            <label htmlFor="epoch" className="hidden sm:flex">
              How long are you going to borrow?
            </label>
            <DateSelect />
          </div>
        </div>
        <div className="flex flex-col mb-12 gap-4">
          <div className="hidden sm:flex gap-4 text-gray-500 text-xs">
            <div className="w-[156px]">Asset</div>
            <div className="w-[80px]">APY</div>
            <div className="w-[120px]">Available</div>
            <div className="w-[120px]">Total Borrowed</div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-3">
            {assets.map((asset, i) => (
              <Asset
                key={i}
                currency={asset.underlying}
                apy={apy[asset.underlying.address] ?? 0}
                available={available[asset.underlying.address] ?? 0n}
                borrowed={borrowed[asset.underlying.address] ?? 0n}
                price={prices[asset.underlying.address] ?? 0}
              />
            ))}
          </div>
        </div>
      </div>
      <RepayModal
        position={repayPosition}
        onClose={() => setRepayPosition(null)}
      />
      <BorrowMoreModal
        position={borrowMorePosition}
        onClose={() => setBorrowMorePosition(null)}
      />
      <EditCollateralModal
        position={editCollateralPosition}
        onClose={() => setEditCollateralPosition(null)}
      />
      <EditExpiryModal
        position={editExpiryPosition}
        onClose={() => setEditExpiryPosition(null)}
      />
    </div>
  )
}

export default Borrow
