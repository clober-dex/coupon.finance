import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { isAddressEqual } from 'viem'

import { BorrowContext } from '../../contexts/borrow-context'
import { AssetStatus } from '../../model/asset'
import { dollarValue, toDollarString } from '../../utils/numbers'
import { Epoch } from '../../model/epoch'
import { LoanPosition } from '../../model/loan-position'
import { LoanPositionCard } from '../card/loan-position-card'
import { calculateApy } from '../../utils/apy'
import { BorrowCard } from '../card/borrow-card'
import { currentTimestampInSeconds, formatDate } from '../../utils/date'
import { MAX_VISIBLE_MARKETS } from '../../utils/market'
import EditCollateralModalContainer from '../../containers/modal/edit-collateral-modal-container'
import RepayModalContainer from '../../containers/modal/repay-modal-container'
import BorrowMoreModalContainer from '../../containers/modal/borrow-more-modal-container'
import EditExpiryModalContainer from '../../containers/modal/edit-expiry-modal-container'
import { Prices } from '../../model/prices'

const BorrowStatus = ({
  assetStatuses,
  epochs,
  prices,
  positions,
  removeCollateral,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
  prices: Prices
  positions: LoanPosition[]
  removeCollateral: BorrowContext['removeCollateral']
}) => {
  const [repayPosition, setRepayPosition] = useState<LoanPosition | null>(null)
  const [borrowMorePosition, setBorrowMorePosition] =
    useState<LoanPosition | null>(null)
  const [editCollateralPosition, setEditCollateralPosition] =
    useState<LoanPosition | null>(null)
  const [editExpiryPosition, setEditExpiryPosition] =
    useState<LoanPosition | null>(null)
  const currentTimestamp = currentTimestampInSeconds()
  return (
    <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px]">
      <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
        Pay Less, Do More.
      </h1>
      {positions.length > 0 ? (
        <div className="flex flex-col gap-6 mb-8 px-4 lg:p-0">
          <div className="flex gap-2 sm:gap-3 items-center">
            <h2 className="font-bold text-base sm:text-2xl">My Positions</h2>
            <div className="font-bold text-sm bg-gray-200 dark:bg-gray-700 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1">
              {positions.length}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-sm sm:w-fit bg-white dark:bg-gray-900 px-4 py-3 rounded-xl sm:rounded-lg">
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Total Borrow Amount</div>
              <div className="font-bold">
                {toDollarString(
                  positions.reduce(
                    (acc, { underlying, amount }) =>
                      dollarValue(
                        amount,
                        underlying.decimals,
                        prices[underlying.address],
                      ).plus(acc),
                    new BigNumber(0),
                  ),
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <div className="text-gray-500">Total Collateral</div>
              <div className="font-bold">
                {toDollarString(
                  positions.reduce(
                    (acc, { collateral, collateralAmount }) =>
                      dollarValue(
                        collateralAmount,
                        collateral.underlying.decimals,
                        prices[collateral.underlying.address],
                      ).plus(acc),
                    new BigNumber(0),
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
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
                  onCollect={async () => {
                    await removeCollateral(position, position.collateralAmount)
                  }}
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
      {epochs && epochs.length > 0 ? (
        <div className="flex flex-col gap-6 sm:gap-8 px-4 lg:p-0">
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">Borrow</h2>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
            {assetStatuses
              .filter((assetStatus) => assetStatus.epoch.id === epochs[0].id)
              .filter((assetStatus) => assetStatus.totalBorrowAvailable !== 0n)
              .map((assetStatus, index) => {
                const assetStatusesByAsset = assetStatuses
                  .filter(({ asset }) =>
                    isAddressEqual(
                      asset.underlying.address,
                      assetStatus.asset.underlying.address,
                    ),
                  )
                  .filter(
                    ({ epoch }) =>
                      Number(epoch.endTimestamp) > currentTimestamp,
                  )
                  .slice(0, MAX_VISIBLE_MARKETS)
                return (
                  <BorrowCard
                    currency={assetStatus.asset.underlying}
                    collaterals={assetStatus.asset.collaterals}
                    key={index}
                    apys={assetStatusesByAsset.map(
                      ({ epoch, totalBorrowAvailable }) => ({
                        date: formatDate(
                          new Date(Number(epoch.endTimestamp) * 1000),
                        ),
                        apy:
                          totalBorrowAvailable > 0n
                            ? calculateApy(
                                assetStatusesByAsset
                                  .filter(
                                    ({ epoch: _epoch }) =>
                                      _epoch.id <= epoch.id,
                                  )
                                  .reduce(
                                    (acc, { bestCouponAskPrice }) =>
                                      acc + bestCouponAskPrice,
                                    0,
                                  ),
                                epoch.endTimestamp - currentTimestamp,
                              )
                            : Number.NaN,
                      }),
                    )}
                    available={assetStatusesByAsset
                      .map(({ totalBorrowAvailable }) => totalBorrowAvailable)
                      .reduce((acc, val) => (acc > val ? acc : val), 0n)}
                    borrowed={assetStatus.totalBorrowed}
                    price={prices[assetStatus.asset.underlying.address]}
                  />
                )
              })}
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

export default BorrowStatus
