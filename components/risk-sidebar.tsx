import React from 'react'
import Image from 'next/image'
import { isAddressEqual } from 'viem'
import Link from 'next/link'

import { getLogo } from '../model/currency'
import { formatDollarValue, formatUnits } from '../utils/numbers'
import { Prices } from '../model/prices'
import { Asset } from '../model/asset'

import { GreenCircleSvg } from './svg/green-circle-svg'
import { OrangeCircleSvg } from './svg/orange-circle-svg'
import { LeftBracketAngleSvg } from './svg/left-bracket-angle-svg'
export const RiskSidebar = ({
  asset,
  showRiskSidebar,
  setShowRiskSidebar,
  prices,
  ...props
}: {
  asset: Asset
  showRiskSidebar: boolean
  setShowRiskSidebar: (show: boolean) => void
  prices: Prices
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div {...props}>
      <div className="relative z-30">
        <div className="flex flex-col gap-8 items-start py-6 px-4 sm:p-6 pb-8 mb-10 sm:mb-0 rounded-2xl bg-white dark:bg-gray-900 w-full sm:w-[480px]">
          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="text-base font-bold">External Risk</div>
            <div className="flex flex-col px-4 py-3 gap-2 items-start rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-center items-center gap-2">
                <GreenCircleSvg />
                <span className="text-sm font-medium text-gray-600 dark:text-white">
                  Oracle: Chainlink
                </span>
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-white">
                This asset uses a Chainlink price feed. Coupon Finance cannot
                verify the security of Chainlink feeds.{' '}
                <Link
                  href="https://docs.coupon.finance/risks/oracle-manipulation"
                  className="text-blue-500"
                  target="_blank"
                >
                  Learn more about oracle risk.
                </Link>
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 gap-2 items-start rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-center items-center gap-2">
                <OrangeCircleSvg />
                <span className="text-sm font-medium text-gray-600 dark:text-white">
                  Surplus management: Aave
                </span>
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-white">
                Unlent assets are deposited in Aave. While Aave has been
                audited, Coupon Finance cannot guarantee the security of Aave
                pools.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="text-base font-bold">Collateral Risk</div>
            <div className="flex flex-col items-start gap-4 text-xs font-medium text-gray-400 w-full">
              <div className="flex flex-row w-full items-start">
                <div className="flex flex-[1.4] justify-center items-start">
                  Coin
                </div>
                <div className="flex flex-1 sm:flex-row justify-start items-center">
                  Liquidation LTV
                </div>
                <div className="flex flex-1 justify-center items-center">
                  Collateralized
                </div>
                <div className="flex flex-1 pl-2 sm:flex-row justify-start items-center">
                  Borrowing ({asset.underlying.symbol})
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-6 w-full">
                {asset.collaterals
                  .filter(
                    ({ underlying }) =>
                      !isAddressEqual(
                        underlying.address,
                        asset.underlying.address,
                      ),
                  )
                  .map(
                    (
                      {
                        underlying,
                        liquidationThreshold,
                        ltvPrecision,
                        totalCollateralized,
                        totalBorrowed,
                      },
                      index,
                    ) => (
                      <div
                        key={index}
                        className="flex flex-row items-center w-full"
                      >
                        <div className="flex flex-[1.4] sm:flex-[1.6] gap-3 shrink-0">
                          <div className="inline-flex w-8 h-8 relative">
                            <Image
                              src={getLogo(underlying)}
                              alt={underlying.name}
                              fill
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start">
                            <div className="text-base font-bold	text-gray-950 dark:text-white">
                              {underlying.symbol}
                            </div>
                            <div className="text-xs font-medium	text-gray-500 hidden sm:inline-flex">
                              {underlying.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 text-sm justify-start items-center text-gray-950 dark:text-white">
                          {(
                            (Number(liquidationThreshold) * 100) /
                            Number(ltvPrecision)
                          ).toFixed(2)}
                          %
                        </div>
                        <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                          <div className="text-sm text-gray-950 dark:text-white">
                            {formatUnits(
                              totalCollateralized,
                              underlying.decimals,
                              prices[underlying.address],
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {formatDollarValue(
                              totalCollateralized,
                              underlying.decimals,
                              prices[underlying.address],
                            )}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                          <div className="text-sm text-gray-950 dark:text-white">
                            {formatUnits(
                              totalBorrowed,
                              asset.underlying.decimals,
                              prices[asset.underlying.address],
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {formatDollarValue(
                              totalBorrowed,
                              asset.underlying.decimals,
                              prices[asset.underlying.address],
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:inline-flex absolute -z-10 h-[56px] -right-20 top-6 py-2 pl-8 pr-3 gap-1 rounded-lg bg-[#22C55E1A]">
          <button
            className="flex flex-row gap-1"
            onClick={() => setShowRiskSidebar(!showRiskSidebar)}
          >
            <div className="flex items-center h-full">
              <LeftBracketAngleSvg />
            </div>
            <div className="flex text-sm	font-bold opacity-90 text-green-500 items-center h-full">
              Close
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
