import React, { useState } from 'react'
import Link from 'next/link'
import { getAddress } from 'viem'
import BigNumber from 'bignumber.js'
import { createPortal } from 'react-dom'

import { Currency } from '../../model/currency'
import { formatUnits } from '../../utils/numbers'
import { CouponSvg } from '../svg/coupon-svg'
import { RightBracketAngleSvg } from '../svg/right-bracket-angle-svg'

const CouponWidget = ({
  setClicked,
  children,
}: {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
} & React.PropsWithChildren) => (
  <div
    className="fixed right-2 bottom-2 sm:right-4 sm:bottom-4"
    onClick={(e) => {
      setClicked((clicked) => !clicked)
      e.stopPropagation()
    }}
  >
    <div className="h-full relative bg-transparent p-2 sm:p-6">
      <CouponSvg />
      {children}
    </div>
  </div>
)

export const CouponUserBalanceModal = ({
  chainId,
  coupons,
}: {
  chainId: number
  coupons: {
    date: string
    balance: bigint
    marketAddress: `0x${string}`
    coupon: Currency
  }[]
}) => {
  const [clicked, setClicked] = useState(false)
  if (coupons.reduce((acc, { balance }) => acc + balance, 0n) === 0n) {
    return <></>
  }

  return (
    <>
      {clicked ? (
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 dark:backdrop-blur-sm"
            onClick={() => setClicked(false)}
          >
            <CouponWidget setClicked={setClicked}>
              <div className="absolute -right-2 sm:right-0 bottom-3/4 mx-4 my-8 bg-white dark:bg-gray-500 rounded-lg">
                <div className="flex flex-col p-2 items-start w-max">
                  {coupons
                    .filter(({ balance }) => balance > 0n)
                    .map((coupon, index) => (
                      <div
                        key={index}
                        className="flex p-2 items-center self-stretch"
                      >
                        <div className="flex items-center flex-grow shrink-0 gap-3 sm:gap-2 basis-0">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 flex-grow shrink-0 basis-0 text-sm">
                            <div>
                              +
                              {new BigNumber(
                                formatUnits(
                                  coupon.balance,
                                  coupon.coupon.decimals,
                                ),
                              ).toFixed(4)}{' '}
                              {coupon.coupon.symbol}
                            </div>
                            <div className="text-gray-500">({coupon.date})</div>
                          </div>
                          <Link
                            target="_blank"
                            href={`https://app.clober.io/limit?chain=${chainId}&market=${getAddress(
                              coupon.marketAddress,
                            )}`}
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
            </CouponWidget>
          </div>,
          document.body,
        )
      ) : (
        <CouponWidget setClicked={setClicked} />
      )}
    </>
  )
}
