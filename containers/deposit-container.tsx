import React, { useEffect, useState } from 'react'
import { isAddressEqual } from 'viem'
import BigNumber from 'bignumber.js'

import { useDepositContext } from '../contexts/deposit-context'
import { AssetStatus } from '../model/asset'
import { useCurrencyContext } from '../contexts/currency-context'
import { BondPosition } from '../model/bond-position'
import { dollarValue } from '../utils/numbers'
import { Epoch } from '../model/epoch'
import EpochSelect from '../components/epoch-select'
import { BondPositionCard } from '../components/bond-position-card'
import { calculateApy } from '../utils/apy'
import { DepositCard } from '../components/deposit-card'

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
  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
  return (
    <div className="flex flex-1 flex-col w-full sm:w-fit">
      <h1 className="flex justify-center text-center font-bold text-xl sm:text-[48px] sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
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
              <div className="text-gray-500">Total Earned</div>
              <div className="font-bold">
                $
                {positions
                  .reduce(
                    (acc, { underlying, interest }) =>
                      dollarValue(
                        interest,
                        underlying.decimals,
                        prices[underlying.address],
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
              .filter((position) =>
                dollarValue(
                  position.amount,
                  position.underlying.decimals,
                  prices[position.underlying.address],
                ).isGreaterThanOrEqualTo(0.01),
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
        <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:p-0">
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">
              Assets to deposit
            </h2>
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
          <div className="flex flex-col w-full h-full lg:grid lg:grid-cols-3 gap-2 sm:gap-4 mb-8">
            {assetStatuses
              .filter((assetStatus) => assetStatus.epoch.id === epoch.id)
              .filter((assetStatus) => assetStatus.totalDepositAvailable !== 0n)
              .map((assetStatus, index) => {
                const validAssetStatuses = assetStatuses.filter(
                  ({ asset, epoch }) =>
                    isAddressEqual(
                      asset.underlying.address,
                      assetStatus.asset.underlying.address,
                    ) && epoch.id <= assetStatus.epoch.id,
                )
                return (
                  <DepositCard
                    key={index}
                    currency={assetStatus.asset.underlying}
                    collaterals={assetStatus.asset.collaterals}
                    apy={calculateApy(
                      validAssetStatuses.reduce(
                        (acc, { bestCouponBidPrice }) =>
                          acc + bestCouponBidPrice,
                        0,
                      ),
                      assetStatus.epoch.endTimestamp - currentTimestamp,
                    )}
                    available={validAssetStatuses
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
