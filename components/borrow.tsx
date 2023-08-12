import React, { SVGProps, useState } from 'react'
import Link from 'next/link'

import { useBorrowContext } from '../contexts/borrow-context'
import { Currency } from '../utils/currency'

import RepayModal from './modal/repay-modal'
import BorrowMoreModal from './modal/borrow-more-modal'
import EditCollateralModal from './modal/edit-collateral-modal'
import EditExpiryModal from './modal/edit-expiry-modal'

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
  // collateralPrice,
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
          <div className="flex items-center gap-1">
            <div className="text-sm">{expiry}</div>
            <button>
              <EditSvg onClick={onEditExpiry} />
            </button>
          </div>
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
            <div className="flex items-center gap-1">
              <div className="text-sm">
                ${collateral} {collateralSymbol}
              </div>
              <button>
                <EditSvg onClick={onEditCollateral} />
              </button>
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
  liquidationThreshold,
  price,
  ...props
}: {
  currency: Currency
  apy: string
  available: string
  borrowed: string
  liquidationThreshold: string
  price: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-gray-900"
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
        <div className="flex flex-col w-[120px]">
          <div className="text-sm">
            {available} {currency.symbol}
          </div>
          <div className="text-xs text-gray-500">${+available * +price}</div>
        </div>
        <div className="flex flex-col w-[120px]">
          <div className="text-sm">
            {borrowed} {currency.symbol}
          </div>
          <div className="text-xs text-gray-500">${+borrowed * +price}</div>
        </div>
        <div className="flex flex-col w-[120px] text-sm">
          {liquidationThreshold}
        </div>
      </div>
      <Link
        href={`/borrow/${currency.symbol}`}
        className="flex items-center justify-center bg-green-500 h-fit w-24 rounded px-3 py-2 font-bold text-xs text-white"
      >
        Borrow
      </Link>
    </div>
  )
}

const Borrow = () => {
  const { positions, assets } = useBorrowContext()
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
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-6 justify-between">
          <h2 className="font-bold text-2xl">Assets to borrow</h2>
          <div className="flex items-center gap-6">
            <label htmlFor="epoch">How long are you going to borrow?</label>
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
        </div>
        <div className="flex flex-col mb-12 gap-4">
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
                currency={asset.currency}
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
