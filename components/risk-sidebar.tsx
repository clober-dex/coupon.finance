import React from 'react'
import Image from 'next/image'
import { isAddressEqual } from 'viem'

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
        <div className="flex flex-col gap-8 items-start p-6 pb-8 rounded-2xl bg-white w-full sm:w-[480px]">
          <div className="flex flex-col items-start gap-4 self-stretch">
            <div className="text-base font-bold text-gray-950">
              External Risk
            </div>
            <div className="flex flex-col px-4 py-3 gap-2 items-start rounded-xl bg-gray-50">
              <div className="flex justify-center items-center gap-2">
                <GreenCircleSvg />
                <span className="text-sm font-medium text-gray-600">
                  Oracle: Chainlink
                </span>
              </div>
              <div className="text-xs font-medium text-gray-600">
                This asset uses a Chainlink price feed. Coupon Finance cannot
                verify the security of Chainlink feeds. Learn more about oracle
                risk.
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 gap-2 items-start rounded-xl bg-gray-50">
              <div className="flex justify-center items-center gap-2">
                <OrangeCircleSvg />
                <span className="text-sm font-medium text-gray-600">
                  Surplus management: Aave
                </span>
              </div>
              <div className="text-xs font-medium text-gray-600">
                Unlent assets are deposited in Aave. While Aave has been
                audited, Coupon Finance cannot guarantee the security of Aave
                pools.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="text-base font-bold text-gray-950">
              Collateral Risk
            </div>
            <div className="flex flex-col items-start gap-4 text-xs font-medium text-gray-400 w-full">
              <div className="flex flex-row w-full items-start">
                <div className="flex-[1.4]">Coin</div>
                <div className="flex-1">Liquidation LTV</div>
                <div className="flex-1">Collateralized</div>
                <div className="flex-1">
                  Borrowing ({asset.underlying.symbol})
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 w-full">
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
                        <div className="flex flex-[1.4] items-center gap-3 shrink-0">
                          <div className="w-8 h-8 relative">
                            <Image
                              src={getLogo(underlying)}
                              alt={underlying.name}
                              fill
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start">
                            <div className="text-base font-bold	text-gray-950">
                              {underlying.symbol}
                            </div>
                            <div className="text-xs font-medium	text-gray-500">
                              {underlying.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 items-center justify-center text-sm text-gray-950">
                          {(
                            (Number(liquidationThreshold) * 100) /
                            Number(ltvPrecision)
                          ).toFixed(2)}
                          %
                        </div>
                        <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                          <div className="text-sm text-gray-950">
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
                          <div className="text-sm text-gray-950">
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
