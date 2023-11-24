import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import { Currency } from '../../model/currency'
import { formatUnits, toPlacesString } from '../../utils/numbers'
import { CouponSvg } from '../svg/coupon-svg'
import { ZIndices } from '../../utils/z-indices'
import { Market } from '../../model/market'

const CouponWidget = ({
  setClicked,
  children,
}: {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
} & React.PropsWithChildren) => (
  <div
    className={`fixed right-2 bottom-2 sm:right-4 sm:bottom-4 ${ZIndices.modal}`}
    onClick={(e) => {
      setClicked((clicked) => !clicked)
      e.stopPropagation()
    }}
  >
    <div className="h-full relative bg-transparent p-2 sm:p-6 cursor-pointer">
      <CouponSvg />
      {children}
    </div>
  </div>
)

export const CouponUserBalanceModal = ({
  coupons,
}: {
  coupons: {
    date: string
    balance: bigint
    market: Market
    coupon: Currency
  }[]
}) => {
  const [clicked, setClicked] = useState(false)
  if (coupons.reduce((acc, { balance }) => acc + balance, 0n) === 0n) {
    return <></>
  }

  const sellAvailableCoupons = coupons.filter(({ balance }) => balance > 0n)

  return (
    <>
      {clicked ? (
        createPortal(
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 ${ZIndices.modal} dark:backdrop-blur-sm`}
            onClick={() => setClicked(false)}
          >
            <CouponWidget setClicked={setClicked}>
              <div className="absolute -right-2 sm:right-0 bottom-3/4 mx-4 my-8 bg-white dark:bg-gray-800 rounded-lg cursor-pointer">
                <div className="flex flex-col items-start w-max">
                  <div className="flex px-4 pt-3 pb-1 items-center self-stretch text-sm font-semibold">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 flex-grow shrink-0 basis-0 text-sm">
                      My Coupons
                    </div>
                    <button className="flex flex-col my-1 w-16 h-7 sm:h-8 justify-center items-center rounded bg-green-500 bg-opacity-10 text-xs text-opacity-90 font-semibold text-green-500">
                      Sell All
                    </button>
                  </div>
                  {sellAvailableCoupons.map((coupon, index) => (
                    <div
                      key={index}
                      className={`flex px-4 pt-1 ${
                        index === sellAvailableCoupons.length - 1
                          ? 'pb-2'
                          : 'pb-1'
                      } items-center self-stretch`}
                    >
                      <div className="flex items-center flex-grow shrink-0 gap-3 basis-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 flex-grow shrink-0 basis-0 text-sm">
                          <div className="text-black dark:text-white">
                            +
                            {toPlacesString(
                              formatUnits(
                                coupon.balance,
                                coupon.coupon.decimals,
                              ),
                            )}{' '}
                            {coupon.coupon.symbol}
                          </div>
                          <div className="text-gray-500 dark:text-gray-300">
                            ({coupon.date})
                          </div>
                        </div>
                        <button className="flex flex-col my-1 w-16 h-7 sm:h-8 justify-center items-center rounded bg-green-500 bg-opacity-10 text-xs text-opacity-90 font-semibold text-green-500">
                          Sell
                        </button>
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
