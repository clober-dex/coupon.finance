import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { isAddressEqual } from 'viem'
import Image from 'next/image'

import { useBorrowContext } from '../contexts/borrow-context'
import { Currency, getLogo } from '../model/currency'
import { AssetStatus } from '../model/asset'
import {
  BigDecimal,
  dollarValue,
  formatDollarValue,
  formatUnits,
} from '../utils/numbers'
import { Epoch } from '../model/epoch'
import { useCurrencyContext } from '../contexts/currency-context'
import { LoanPosition } from '../model/loan-position'
import { LoanPositionCard } from '../components/loan-position-card'
import EpochSelect from '../components/epoch-select'
import { calculateApy } from '../utils/apy'

import EditCollateralModalContainer from './modal/edit-collateral-modal-container'
import RepayModalContainer from './modal/repay-modal-container'
import BorrowMoreModalContainer from './modal/borrow-more-modal-container'
import EditExpiryModalContainer from './modal/edit-expiry-modal-container'

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
  price?: BigDecimal
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl sm:p-4 bg-gray-50 sm:bg-white dark:bg-gray-900 shadow-md"
      {...props}
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className="flex justify-between w-full sm:w-auto items-center gap-4 bg-white p-4 rounded-t-xl dark:bg-gray-800 dark:sm:bg-gray-900 sm:p-0 mb-2 sm:mb-0">
          <div className="flex items-center gap-3 sm:w-[140px]">
            <div className="w-8 h-8 relative">
              <Image src={getLogo(currency)} alt={currency.name} fill />
            </div>
            <div className="flex flex-col gap-0.5 sm:gap-0">
              <div className="font-bold text-sm sm:text-base">
                {currency.symbol}
              </div>
              <div className="text-gray-500 text-xs">{currency.name}</div>
            </div>
          </div>
          <div className="text-sm font-bold sm:w-[80px]">{apy.toFixed(2)}%</div>
        </div>
        <div className="flex flex-row sm:flex-col w-full sm:w-[120px] justify-between px-4 sm:p-0">
          <div className="sm:hidden text-gray-500 text-xs">Available</div>
          <div className="flex flex-row sm:flex-col items-center sm:items-start gap-1 sm:gap-0">
            <div className="text-xs sm:text-sm">
              {formatUnits(available, currency.decimals, price)}{' '}
              {currency.symbol}
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
              {formatUnits(borrowed, currency.decimals, price)}{' '}
              {currency.symbol}
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

const BorrowContainer = ({
  assetStatuses,
  epochs,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}) => {
  const { prices } = useCurrencyContext()
  const { positions } = useBorrowContext()
  const [repayPosition, setRepayPosition] = useState<LoanPosition | null>(null)
  const [borrowMorePosition, setBorrowMorePosition] =
    useState<LoanPosition | null>(null)
  const [editCollateralPosition, setEditCollateralPosition] =
    useState<LoanPosition | null>(null)
  const [editExpiryPosition, setEditExpiryPosition] =
    useState<LoanPosition | null>(null)
  const [epoch, setEpoch] = useState<Epoch | undefined>(undefined)
  useEffect(() => {
    if (epochs.length > 0) {
      setEpoch(epochs[0])
    }
  }, [epochs])
  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
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
                {positions
                  .reduce(
                    (acc, { underlying, amount }) =>
                      dollarValue(
                        amount,
                        underlying.decimals,
                        prices[underlying.address],
                      ).plus(acc),
                    new BigNumber(0),
                  )
                  .toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Total Collateral</div>
              <div className="font-bold">
                $
                {positions
                  .reduce(
                    (acc, { collateral, collateralAmount }) =>
                      dollarValue(
                        collateralAmount,
                        collateral.underlying.decimals,
                        prices[collateral.underlying.address],
                      ).plus(acc),
                    new BigNumber(0),
                  )
                  .toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-6">
            {positions
              .sort(
                (a, b) =>
                  Number(a.toEpoch.endTimestamp) -
                  Number(b.toEpoch.endTimestamp),
              )
              .map((position, index) => (
                <LoanPositionCard
                  key={index}
                  position={position}
                  price={prices[position.underlying.address]}
                  collateralPrice={
                    prices[position.collateral.underlying.address]
                  }
                  onRepay={() => setRepayPosition(position)}
                  onBorrowMore={() => setBorrowMorePosition(position)}
                  onEditCollateral={() => setEditCollateralPosition(position)}
                  onEditExpiry={() => setEditExpiryPosition(position)}
                />
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      {epoch ? (
        <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:p-0">
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">
              Assets to borrow
            </h2>
            <div className="flex items-center gap-6">
              <label htmlFor="epoch" className="hidden sm:flex">
                How long are you going to borrow?
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
              <div className="w-[120px]">Available</div>
              <div className="w-[120px]">Total Borrowed</div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-3">
              {assetStatuses
                .filter((assetStatus) => assetStatus.epoch.id === epoch.id)
                .filter(
                  (assetStatus) => assetStatus.totalBorrowAvailable !== 0n,
                )
                .map((assetStatus, index) => {
                  const validAssetStatuses = assetStatuses.filter(
                    ({ underlying, epoch }) =>
                      isAddressEqual(
                        underlying.address,
                        assetStatus.underlying.address,
                      ) && epoch.id <= assetStatus.epoch.id,
                  )
                  return (
                    <Asset
                      key={index}
                      currency={assetStatus.underlying}
                      apy={calculateApy(
                        validAssetStatuses.reduce(
                          (acc, { bestCouponAskPrice }) =>
                            acc + bestCouponAskPrice,
                          0,
                        ),
                        assetStatus.epoch.endTimestamp - currentTimestamp,
                      )}
                      available={validAssetStatuses
                        .map(({ totalBorrowAvailable }) => totalBorrowAvailable)
                        .reduce((acc, val) => (acc > val ? acc : val), 0n)}
                      borrowed={assetStatus.totalBorrowed}
                      price={prices[assetStatus.underlying.address]}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {repayPosition ? (
        <RepayModalContainer
          position={repayPosition}
          onClose={() => setRepayPosition(null)}
        />
      ) : (
        <></>
      )}
      {borrowMorePosition ? (
        <BorrowMoreModalContainer
          position={borrowMorePosition}
          onClose={() => setBorrowMorePosition(null)}
        />
      ) : (
        <></>
      )}
      {editCollateralPosition ? (
        <EditCollateralModalContainer
          position={editCollateralPosition}
          onClose={() => setEditCollateralPosition(null)}
        />
      ) : (
        <></>
      )}
      {editExpiryPosition ? (
        <EditExpiryModalContainer
          position={editExpiryPosition}
          onClose={() => setEditExpiryPosition(null)}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default BorrowContainer
