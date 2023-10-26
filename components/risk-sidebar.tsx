import React from 'react'
import Image from 'next/image'

import { getLogo } from '../model/currency'

import { GreenCircleSvg } from './svg/green-circle-svg'
import { OrangeCircleSvg } from './svg/orange-circle-svg'
import { LeftBracketAngleSvg } from './svg/left-bracket-angle-svg'
export const RiskSidebar = ({
  showRiskSidebar,
  setShowRiskSidebar,
  ...props
}: {
  showRiskSidebar: boolean
  setShowRiskSidebar: (show: boolean) => void
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
                <div className="flex-1">Coin</div>
                <div className="flex-1">Liquidation LTV</div>
                <div className="flex-1">Collateralized</div>
                <div className="flex-1">Borrowing</div>
              </div>
              <div className="flex flex-col items-start gap-6 w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex flex-1 items-center gap-3 shrink-0">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={getLogo({
                          address: '0x0000000000000000000000000000000000000002',
                          name: 'WBTC',
                          symbol: 'WBTC',
                          decimals: 8,
                        })}
                        alt={'WBTC'}
                        fill
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <div className="text-base font-bold	text-gray-950">
                        BTC
                      </div>
                      <div className="text-xs font-medium	text-gray-500">
                        Bitcoin
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 items-center justify-center text-sm text-gray-950">
                    70.00%
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                    <div className="text-sm text-gray-950">1.2305</div>
                    <div className="text-xs text-gray-500 font-medium">
                      $3,827.54
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                    <div className="text-sm text-gray-950">1.2305</div>
                    <div className="text-xs text-gray-500 font-medium">
                      $3,827.54
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center w-full">
                  <div className="flex flex-1 items-center gap-3 shrink-0">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={getLogo({
                          address: '0x0000000000000000000000000000000000000002',
                          name: 'WETH',
                          symbol: 'WETH',
                          decimals: 8,
                        })}
                        alt={'WETH'}
                        fill
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <div className="text-base font-bold	text-gray-950">
                        ETH
                      </div>
                      <div className="text-xs font-medium	text-gray-500">
                        Ethereum
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 items-center justify-center text-sm text-gray-950">
                    70.00%
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                    <div className="text-sm text-gray-950">3.5505</div>
                    <div className="text-xs text-gray-500 font-medium">
                      $827.54
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-start gap-0.5">
                    <div className="text-sm text-gray-950">1.2305</div>
                    <div className="text-xs text-gray-500 font-medium">
                      $30,812.54
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:inline-flex absolute -z-10 h-[56px] -right-20 top-6 py-2 pl-8 pr-3 gap-1 rounded-lg bg-[#22C55E1A]">
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
