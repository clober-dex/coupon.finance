import React, { useEffect, useState } from 'react'
import { isAddressEqual } from 'viem'
import BigNumber from 'bignumber.js'

import { useDepositContext } from '../contexts/deposit-context'
import { AssetStatus } from '../model/asset'
import { useCurrencyContext } from '../contexts/currency-context'
import { BondPosition } from '../model/bond-position'
import { dollarValue, toDollarString } from '../utils/numbers'
import { Epoch } from '../model/epoch'
import { BondPositionCard } from '../components/card/bond-position-card'
import { DepositCard } from '../components/card/deposit-card'
import { currentTimestampInSeconds, formatDate } from '../utils/date'
import { calculateApy } from '../utils/apy'
import { MAX_VISIBLE_MARKETS } from '../utils/market'

import WithdrawModalContainer from './modal/withdraw-modal-container'

const DepositContainer = ({
  assetStatuses,
  epochs,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}) => {
  const { prices } = useCurrencyContext()
  const { positions, collect } = useDepositContext()
  const [withdrawPosition, setWithdrawPosition] = useState<BondPosition | null>(
    null,
  )
  const [epoch, setEpoch] = useState<Epoch | undefined>(undefined)
  useEffect(() => {
    if (epochs.length > 0) {
      setEpoch(epochs[0])
    }
  }, [epochs])
  const currentTimestamp = currentTimestampInSeconds()
  return (
    <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px]">
      <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
        Lending, Fixed.
      </h1>
      {positions.length > 0 ? (
        <div className="flex flex-col gap-6 mb-8 px-4 lg:p-0">
          <div className="flex gap-2 sm:gap-3 items-center">
            <h2 className="font-bold text-base sm:text-2xl">My Positions</h2>
            <div className="font-bold text-sm bg-gray-200 dark:bg-gray-800 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1">
              {positions.length}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-sm sm:w-fit bg-white dark:bg-gray-800 px-4 py-3 rounded-xl sm:rounded-lg">
            <div className="flex justify-between gap-3">
              <div className="text-gray-500 dark:text-gray-400">
                Total Deposit
              </div>
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
              <div className="text-gray-500 dark:text-gray-400">
                Total Earned
              </div>
              <div className="font-bold">
                {toDollarString(
                  positions.reduce(
                    (acc, { underlying, interest }) =>
                      dollarValue(
                        interest,
                        underlying.decimals,
                        prices[underlying.address],
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
                <BondPositionCard
                  key={index}
                  position={position}
                  price={prices[position.underlying.address]}
                  onWithdraw={() => setWithdrawPosition(position)}
                  onCollect={async () => {
                    await collect(
                      position.underlying,
                      position.tokenId,
                      position.amount,
                    )
                  }}
                />
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      {epoch ? (
        <div className="flex flex-col gap-6 sm:gap-8 px-4 lg:p-0">
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">
              Assets to deposit
            </h2>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
            {assetStatuses
              .filter((assetStatus) => assetStatus.epoch.id === epoch.id)
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
                  <DepositCard
                    currency={assetStatus.asset.underlying}
                    collaterals={assetStatus.asset.collaterals}
                    key={index}
                    apys={assetStatusesByAsset.map(
                      ({ epoch, totalDepositAvailable }) => ({
                        date: formatDate(
                          new Date(Number(epoch.endTimestamp) * 1000),
                        ),
                        apy:
                          totalDepositAvailable > 0n
                            ? calculateApy(
                                assetStatusesByAsset
                                  .filter(
                                    ({ epoch: _epoch }) =>
                                      _epoch.id <= epoch.id,
                                  )
                                  .reduce(
                                    (acc, { bestCouponBidPrice }) =>
                                      acc + bestCouponBidPrice,
                                    0,
                                  ),
                                epoch.endTimestamp - currentTimestamp,
                              )
                            : Number.NaN,
                      }),
                    )}
                    available={assetStatusesByAsset
                      .map(({ totalDepositAvailable }) => totalDepositAvailable)
                      .reduce((acc, val) => (acc > val ? acc : val), 0n)}
                    deposited={assetStatus.totalDeposited}
                    price={prices[assetStatus.asset.underlying.address]}
                  />
                )
              })}
          </div>
        </div>
      ) : (
        <></>
      )}
      <WithdrawModalContainer
        position={withdrawPosition}
        onClose={() => setWithdrawPosition(null)}
      />
    </div>
  )
}

export default DepositContainer
