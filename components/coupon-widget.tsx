import React from 'react'
import { Chain } from 'wagmi'
import Link from 'next/link'
import { getAddress } from 'viem'

import { Currency } from '../model/currency'
import { formatUnits } from '../utils/numbers'

import { CouponSvg } from './svg/coupon-svg'
import { RightBracketAngleSvg } from './svg/right-bracket-angle-svg'

export const CouponWidget = ({
  chain,
  coupons,
}: {
  chain: Chain
  coupons: {
    date: string
    balance: bigint
    marketAddress: `0x${string}`
    coupon: Currency
  }[]
}) => (
  <div className="fixed right-4 bottom-4">
    <div className="h-full group relative bg-transparent p-6">
      <CouponSvg
        target="_blank"
        href="https://github.com/clober-dex/coupon.finance"
        className="transition ease-in-out duration-300 group-hover:-translate-y-1 group-hover:scale-110"
      />
      <div className="hidden absolute group-hover:block -right-2 sm:right-0 bottom-3/4 mx-4 my-8 bg-white dark:bg-gray-500 rounded-lg">
        <div className="flex flex-col items-start w-max">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="flex px-3 pt-3 pb-2 items-center self-stretch"
            >
              <div className="flex items-center flex-grow shrink-0 gap-2 basis-0">
                <div className="flex items-center gap-1 flex-grow shrink-0 basis-0 text-sm">
                  <div>
                    +{formatUnits(coupon.balance, coupon.coupon.decimals)}{' '}
                    {coupon.coupon.symbol}
                  </div>
                  <div className="text-gray-500">({coupon.date})</div>
                </div>
                <Link
                  target="_blank"
                  href={`https://app.clober.io/limit?chain=${
                    chain.id
                  }&market=${getAddress(coupon.marketAddress)}`}
                >
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    Market <RightBracketAngleSvg />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)
