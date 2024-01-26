import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { isAddressEqual, zeroAddress } from 'viem'

import { BorrowContext, useBorrowContext } from '../../contexts/borrow-context'
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
import { ethValue } from '../../utils/currency'
import { LeveragePositionCard } from '../card/leverage-position-card'
import AdjustLeverageModalContainer from '../../containers/modal/adjust-leverage-modal-container'
import { isStableCoin } from '../../contexts/currency-context'
import { Currency } from '../../model/currency'
import { LongLeverageCard } from '../card/long-leverage-card'
import { ShortLeverageCard } from '../card/short-leverage-card'
import { AaveLogoSvg } from '../svg/aave-logo-svg'
import { CurrencyIcon } from '../icon/currency-icon'
import { CouponSvg } from '../svg/coupon-svg'
import { USDC_ADDRESS, WETH_ADDRESS } from '../../utils/asset'
import { LiquidationHistory } from '../../model/liquidation-history'

const BorrowStatus = ({
  assetStatuses,
  epochs,
  prices,
  positions,
  multipleFactors,
  pnls,
  removeCollateral,
  minDebtSizeInEth,
  borrowAPYs,
  aaveBorrowAPYs,
  liquidationHistories,
  explorerUrl,
}: {
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
  prices: Prices
  positions: LoanPosition[]
  multipleFactors: BorrowContext['multipleFactors']
  pnls: BorrowContext['pnls']
  removeCollateral: BorrowContext['removeCollateral']
  minDebtSizeInEth: BigNumber
  borrowAPYs: { [address: `0x${string}`]: number }
  aaveBorrowAPYs: { [address: `0x${string}`]: number }
  liquidationHistories: LiquidationHistory[]
  explorerUrl: string
}) => {
  const { closeLeveragePosition } = useBorrowContext()
  const [repayPosition, setRepayPosition] = useState<LoanPosition | null>(null)
  const [borrowMorePosition, setBorrowMorePosition] =
    useState<LoanPosition | null>(null)
  const [editCollateralPosition, setEditCollateralPosition] =
    useState<LoanPosition | null>(null)
  const [editExpiryPosition, setEditExpiryPosition] =
    useState<LoanPosition | null>(null)
  const [adjustLeveragePosition, setAdjustLeveragePosition] =
    useState<LoanPosition | null>(null)
  const currentTimestamp = currentTimestampInSeconds()
  const [shortLeveragePairs, longLeveragePairs] = useMemo(() => {
    const _assetStatuses = assetStatuses
      .filter((assetStatus) => assetStatus.epoch.id === epochs[0].id)
      .filter((assetStatus) => assetStatus.totalBorrowAvailable !== 0n)
      .map((assetStatus) => {
        const assetStatusesByAsset = assetStatuses
          .filter(({ asset }) =>
            isAddressEqual(
              asset.underlying.address,
              assetStatus.asset.underlying.address,
            ),
          )
          .filter(({ epoch }) => Number(epoch.endTimestamp) > currentTimestamp)
          .slice(0, MAX_VISIBLE_MARKETS)
        const apys = assetStatusesByAsset.map(
          ({ epoch, totalBorrowAvailable }) => ({
            date: formatDate(new Date(Number(epoch.endTimestamp) * 1000)),
            apy:
              totalBorrowAvailable > 0n
                ? calculateApy(
                    assetStatusesByAsset
                      .filter(({ epoch: _epoch }) => _epoch.id <= epoch.id)
                      .reduce(
                        (acc, { bestCouponAskPrice }) =>
                          acc + bestCouponAskPrice,
                        0,
                      ),
                    epoch.endTimestamp - currentTimestamp,
                  )
                : Number.NaN,
          }),
        )
        return {
          ...assetStatus,
          lowestApy: Math.min(
            ...apys
              .filter(({ apy }) => !Number.isNaN(apy))
              .map(({ apy }) => apy),
          ),
        }
      })
      .reduce(
        (acc, assetStatus) => {
          return [
            ...acc,
            ...assetStatus.asset.collaterals.map((collateral) => ({
              lowestApy: assetStatus.lowestApy,
              maxMultiplier:
                Math.floor(
                  1 /
                    (1 -
                      Number(collateral.liquidationTargetLtv) /
                        Number(collateral.ltvPrecision)),
                ) - 0.02,
              collateralCurrency: collateral.underlying,
              debtCurrency: assetStatus.asset.underlying,
            })),
          ]
        },
        [] as {
          lowestApy: number
          maxMultiplier: number
          collateralCurrency: Currency
          debtCurrency: Currency
        }[],
      )
    return [
      _assetStatuses.filter(
        (assetStatus) =>
          isStableCoin(assetStatus.collateralCurrency) &&
          !isStableCoin(assetStatus.debtCurrency),
      ),
      _assetStatuses.filter(
        (assetStatus) =>
          !isStableCoin(assetStatus.collateralCurrency) ||
          isStableCoin(assetStatus.debtCurrency),
      ),
    ]
  }, [assetStatuses, currentTimestamp, epochs])

  return (
    <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px]">
      <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
        Pay Less, Do More.
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
            Borrow apy
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 text-sm">
                <AaveLogoSvg className="w-5 h-5" />
                Aave
              </div>
              <div className="flex w-full justify-end text-sm text-red-500">
                {(aaveBorrowAPYs[WETH_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 font-semibold text-sm">
                <CouponSvg className="w-5 h-5 shrink-0" />
                Coupon
              </div>
              <div className="flex w-full justify-end text-sm font-semibold text-green-500">
                {(borrowAPYs[WETH_ADDRESS] ?? 0).toFixed(2)}%
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
            Borrow apy
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 text-sm">
                <AaveLogoSvg className="w-5 h-5" />
                Aave
              </div>
              <div className="flex w-full justify-end text-sm text-red-500">
                {(aaveBorrowAPYs[USDC_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="w-full flex justify-center items-start gap-4">
              <div className="flex items-center h-full w-20 gap-2 font-semibold text-sm">
                <CouponSvg className="w-5 h-5 shrink-0" />
                Coupon
              </div>
              <div className="flex w-full justify-end text-sm font-semibold text-green-500">
                {(borrowAPYs[USDC_ADDRESS] ?? 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
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
              .map((position, index) => {
                const debtSizeInEth = ethValue(
                  prices[zeroAddress],
                  position.underlying,
                  position.amount,
                  prices[position.underlying.address],
                )
                return !position.isLeverage ? (
                  <LoanPositionCard
                    key={`loan-position-${index}`}
                    position={position}
                    price={prices[position.underlying.address]}
                    collateralPrice={
                      prices[position.collateral.underlying.address]
                    }
                    onRepay={() => setRepayPosition(position)}
                    onCollect={async () => {
                      await removeCollateral(
                        position,
                        position.collateralAmount,
                      )
                    }}
                    onBorrowMore={() => setBorrowMorePosition(position)}
                    onEditCollateral={() => setEditCollateralPosition(position)}
                    onEditExpiry={() => setEditExpiryPosition(position)}
                    isDeptSizeLessThanMinDebtSize={
                      debtSizeInEth.lt(minDebtSizeInEth) && debtSizeInEth.gt(0)
                    }
                    liquidationHistories={liquidationHistories.filter(
                      ({ positionId }) => positionId === position.id,
                    )}
                    explorerUrl={explorerUrl}
                  />
                ) : (
                  <LeveragePositionCard
                    key={`leverage-position-${index}`}
                    position={position}
                    multiple={
                      Number(position.collateralAmount) /
                      Number(
                        position.collateralAmount -
                          position.borrowedCollateralAmount,
                      )
                    }
                    multipleFactor={multipleFactors[Number(position.id)]}
                    pnl={pnls[Number(position.id)]?.value || 0}
                    profit={pnls[Number(position.id)]?.profit || 0}
                    price={prices[position.underlying.address]}
                    collateralPrice={
                      prices[position.collateral.underlying.address]
                    }
                    averageDebtCurrencyPrice={position.averageDebtCurrencyPrice}
                    averageCollateralCurrencyPrice={
                      position.averageCollateralCurrencyPrice
                    }
                    onAdjustMultiple={() => {
                      setAdjustLeveragePosition(position)
                    }}
                    onClose={async () => {
                      await closeLeveragePosition(position)
                    }}
                    onCollect={async () => {
                      await removeCollateral(
                        position,
                        position.collateralAmount,
                      )
                    }}
                    onEditCollateral={() => setEditCollateralPosition(position)}
                    onEditExpiry={() => setEditExpiryPosition(position)}
                    isDeptSizeLessThanMinDebtSize={
                      debtSizeInEth.lt(minDebtSizeInEth) && debtSizeInEth.gt(0)
                    }
                    liquidationHistories={liquidationHistories.filter(
                      ({ positionId }) => positionId === position.id,
                    )}
                    explorerUrl={explorerUrl}
                  />
                )
              })}
          </div>
        </div>
      ) : (
        <></>
      )}
      {epochs && epochs.length > 0 ? (
        <div className="flex flex-col gap-6 sm:gap-8 px-4 lg:p-0">
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">Long</h2>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
            {longLeveragePairs
              .reduce(
                (
                  acc,
                  {
                    collateralCurrency,
                    maxMultiplier,
                    debtCurrency,
                    lowestApy,
                  },
                ) => {
                  const _acc = acc.find(
                    ({ collateralCurrency: _collateralCurrency }) =>
                      isAddressEqual(
                        _collateralCurrency.address,
                        collateralCurrency.address,
                      ),
                  )
                  if (_acc) {
                    _acc.debtCurrencies.push(debtCurrency)
                    _acc.apys[debtCurrency.address] = lowestApy
                    _acc.maxMultipliers[debtCurrency.address] = maxMultiplier
                  } else {
                    acc.push({
                      collateralCurrency,
                      debtCurrencies: [debtCurrency],
                      apys: {
                        [debtCurrency.address]: lowestApy,
                      },
                      maxMultipliers: {
                        [debtCurrency.address]: maxMultiplier,
                      },
                    })
                  }
                  return acc
                },
                [] as {
                  collateralCurrency: Currency
                  debtCurrencies: Currency[]
                  apys: { [address: `0x${string}`]: number }
                  maxMultipliers: { [address: `0x${string}`]: number }
                }[],
              )
              .map(
                ({
                  collateralCurrency,
                  debtCurrencies,
                  apys,
                  maxMultipliers,
                }) => (
                  <LongLeverageCard
                    key={`leverage-long-${collateralCurrency.symbol}`}
                    collateralCurrency={collateralCurrency}
                    debtCurrencies={debtCurrencies}
                    apys={apys}
                    maxMultipliers={maxMultipliers}
                    prices={prices}
                  />
                ),
              )}
          </div>
          <div className="flex items-center gap-6 justify-between">
            <h2 className="font-bold text-base sm:text-2xl">Short</h2>
          </div>
          <div className="flex flex-1 flex-col w-full h-full sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-8 justify-center">
            {shortLeveragePairs
              .reduce(
                (
                  acc,
                  {
                    collateralCurrency,
                    maxMultiplier,
                    debtCurrency,
                    lowestApy,
                  },
                ) => {
                  const _acc = acc.find(({ debtCurrency: _debtCurrency }) =>
                    isAddressEqual(_debtCurrency.address, debtCurrency.address),
                  )
                  if (_acc) {
                    _acc.collateralCurrencies.push(collateralCurrency)
                    _acc.apys[collateralCurrency.address] = lowestApy
                    _acc.maxMultipliers[collateralCurrency.address] =
                      maxMultiplier
                  } else {
                    acc.push({
                      collateralCurrencies: [collateralCurrency],
                      debtCurrency,
                      apys: {
                        [collateralCurrency.address]: lowestApy,
                      },
                      maxMultipliers: {
                        [collateralCurrency.address]: maxMultiplier,
                      },
                    })
                  }
                  return acc
                },
                [] as {
                  collateralCurrencies: Currency[]
                  debtCurrency: Currency
                  apys: { [address: `0x${string}`]: number }
                  maxMultipliers: { [address: `0x${string}`]: number }
                }[],
              )
              .map(
                ({
                  collateralCurrencies,
                  debtCurrency,
                  apys,
                  maxMultipliers,
                }) => (
                  <ShortLeverageCard
                    key={`leverage-short-${debtCurrency.symbol}`}
                    collateralCurrencies={collateralCurrencies}
                    debtCurrency={debtCurrency}
                    apys={apys}
                    maxMultipliers={maxMultipliers}
                    prices={prices}
                  />
                ),
              )}
          </div>
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
                    key={`borrow-${index}`}
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
      {adjustLeveragePosition ? (
        <AdjustLeverageModalContainer
          position={adjustLeveragePosition}
          onClose={() => setAdjustLeveragePosition(null)}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default BorrowStatus
