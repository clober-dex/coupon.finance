import React, { useState } from 'react'
import { isAddressEqual, zeroAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { DepositContext } from '../../contexts/deposit-context'
import { AssetStatus } from '../../model/asset'
import { BondPosition } from '../../model/bond-position'
import { dollarValue, toDollarString } from '../../utils/numbers'
import { Epoch } from '../../model/epoch'
import { BondPositionCard } from '../card/bond-position-card'
import { DepositCard } from '../card/deposit-card'
import { currentTimestampInSeconds, formatDate } from '../../utils/date'
import { calculateApy } from '../../utils/apy'
import { MAX_VISIBLE_MARKETS } from '../../utils/market'
import WithdrawModalContainer from '../../containers/modal/withdraw-modal-container'
import { Prices } from '../../model/prices'
import { CurrencyIcon } from '../icon/currency-icon'
import { AaveLogoSvg } from '../svg/aave-logo-svg'
import { USDC_ADDRESS, WETH_ADDRESS } from '../../utils/asset'
import { CouponSvg } from '../svg/coupon-svg'

const DepositStatus = ({
  assetStatuses,
  epochs,
  prices,
  positions,
  collect,
  depositAPYs,
  aaveDepositAPYs,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
  prices: Prices
  positions: BondPosition[]
  collect: DepositContext['collect']
  depositAPYs: { [address: `0x${string}`]: number }
  aaveDepositAPYs: { [address: `0x${string}`]: number }
}) => {
  const [withdrawPosition, setWithdrawPosition] = useState<BondPosition | null>(
    null,
  )
  const currentTimestamp = currentTimestampInSeconds()
  return (
    <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px]">
      <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
        Lending, Fixed.
      </h1>
      <div className="gap-2 lg:ml-auto items-center flex flex-col lg:flex-row mb-4">
        <div className="mx-5 lg:mx-0 px-5 py-4 bg-white dark:bg-gray-800 rounded-xl ml-auto lg:w-[330px] flex gap-6 items-center">
          <div className="flex flex-row font-semibold text-sm lg:text-base items-center gap-2">
            <CurrencyIcon
              currency={{
                name: 'ETH',
                symbol: 'ETH',
                address: zeroAddress,
                decimals: 18,
              }}
              className="w-6 h-6"
            />
            Deposit apy
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 text-sm">
                <AaveLogoSvg className="w-5 h-5" />
                Aave
              </div>
              <div className="flex w-full justify-end text-sm text-red-500">
                {(aaveDepositAPYs[WETH_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 font-semibold text-sm">
                <CouponSvg className="w-5 h-5 shrink-0" />
                Coupon
              </div>
              <div className="flex w-full justify-end text-sm font-semibold text-green-500">
                {(depositAPYs[WETH_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 lg:mx-0 px-5 py-4 bg-white dark:bg-gray-800 rounded-xl ml-auto lg:w-[330px] flex gap-6 items-center">
          <div className="flex flex-row font-semibold text-sm lg:text-base items-center gap-2">
            <CurrencyIcon
              currency={{
                name: 'USDC',
                symbol: 'USDC',
                address: zeroAddress,
                decimals: 6,
              }}
              className="w-6 h-6"
            />
            Deposit apy
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 text-sm">
                <AaveLogoSvg className="w-5 h-5" />
                Aave
              </div>
              <div className="flex w-full justify-end text-sm text-red-500">
                {(aaveDepositAPYs[USDC_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 font-semibold text-sm">
                <CouponSvg className="w-5 h-5 shrink-0" />
                Coupon
              </div>
              <div className="flex w-full justify-end text-sm font-semibold text-green-500">
                {(depositAPYs[USDC_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    await collect(position)
                  }}
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
            <h2 className="font-bold text-base sm:text-2xl">
              Assets to deposit
            </h2>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
            {assetStatuses
              .filter((assetStatus) => assetStatus.epoch.id === epochs[0].id)
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

export default DepositStatus
