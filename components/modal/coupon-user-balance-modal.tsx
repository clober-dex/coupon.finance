import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { isAddressEqual } from 'viem'

import { formatUnits, toPlacesString } from '../../utils/numbers'
import { CouponSvg } from '../svg/coupon-svg'
import { ZIndices } from '../../utils/z-indices'
import { CouponBalance } from '../../model/coupon-balance'
import { formatDate } from '../../utils/date'
import { Asset } from '../../model/asset'

const CouponWidget = ({
  setClicked,
  children,
}: {
  setClicked: React.Dispatch<React.SetStateAction<boolean>>
} & React.PropsWithChildren) => (
  <div
    className={`fixed right-2 bottom-2 sm:right-4 sm:bottom-4 ${ZIndices.modal}`}
  >
    <div className="h-full relative bg-transparent p-2 sm:p-6">
      <CouponSvg
        className="cursor-pointer sm:w-[80px] sm:h-[80px] w-[64px] h-[64px]"
        onClick={(e) => {
          setClicked((clicked) => !clicked)
          e.stopPropagation()
        }}
      />
      {children}
    </div>
  </div>
)

export const CouponUserBalanceModal = ({
  assets,
  couponBalances,
  sellCoupons,
}: {
  assets: Asset[]
  couponBalances: CouponBalance[]
  sellCoupons: (marketSellParams: CouponBalance[]) => Promise<void>
}) => {
  const [clicked, setClicked] = useState(false)
  if (
    couponBalances.reduce(
      (acc, { erc1155Balance }) => acc + erc1155Balance,
      0n,
    ) === 0n
  ) {
    return <></>
  }

  const erc1155BalanceIsNotZeroCouponBalances = couponBalances.filter(
    ({ erc1155Balance }) => erc1155Balance > 0n,
  )

  return (
    <>
      {clicked ? (
        createPortal(
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 ${ZIndices.modal} dark:backdrop-blur-sm`}
          >
            <CouponWidget setClicked={setClicked}>
              <div className="absolute -right-2 sm:right-0 bottom-3/4 mx-4 my-8 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex flex-col items-start w-max overflow-y-scroll max-h-[400px]">
                  <div className="flex px-4 pt-3 pb-2 items-center self-stretch text-sm font-semibold">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 flex-grow shrink-0 basis-0 text-sm dark:text-white text-gray-950">
                      My Coupons
                    </div>
                    <button
                      onClick={async () => {
                        await sellCoupons(erc1155BalanceIsNotZeroCouponBalances)
                      }}
                      disabled={
                        erc1155BalanceIsNotZeroCouponBalances.reduce(
                          (acc, { assetValue }) => acc + assetValue,
                          0n,
                        ) === 0n
                      }
                      className="flex flex-col my-1 w-16 h-7 sm:h-8 justify-center items-center rounded bg-opacity-10 text-xs text-opacity-90 font-semibold text-green-500 bg-green-500 hover:bg-green-300 hover:bg-opacity-10 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-300 dark:disabled:text-gray-500"
                    >
                      Sell All
                    </button>
                  </div>
                  {erc1155BalanceIsNotZeroCouponBalances.map(
                    ({ balance, market, assetValue }, index) => (
                      <div
                        key={index}
                        className={`flex px-4 pt-1 ${
                          index ===
                          erc1155BalanceIsNotZeroCouponBalances.length - 1
                            ? 'pb-2'
                            : 'pb-1'
                        } items-center self-stretch`}
                      >
                        <div className="flex items-center flex-grow shrink-0 gap-4 basis-0">
                          <div className="flex p-2 items-center gap-1 flex-grow shrink-0 basis-0 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex flex-col justify-center items-start gap-3 flex-grow shrink-0 basis-0">
                              <div className="text-sm">
                                {toPlacesString(
                                  formatUnits(
                                    balance,
                                    market.baseToken.decimals,
                                  ),
                                )}{' '}
                                {market.baseToken.symbol}
                              </div>
                              <div className="flex flex-col justify-center items-start gap-2">
                                <div className="flex items-center gap-3 text-xs w-[180px] sm:w-[228px]">
                                  <span className="text-gray-400">Expires</span>
                                  <span className="text-gray-500 dark:text-gray-300">
                                    {formatDate(
                                      new Date(
                                        Number(market.endTimestamp) * 1000,
                                      ),
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-400">Value</span>
                                  <span className="text-gray-500 dark:text-gray-300">
                                    {toPlacesString(
                                      formatUnits(
                                        assetValue,
                                        market.quoteToken.decimals,
                                      ),
                                    )}{' '}
                                    {
                                      assets.find(({ substitutes }) =>
                                        isAddressEqual(
                                          substitutes[0].address,
                                          market.quoteToken.address,
                                        ),
                                      )?.underlying.symbol
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            disabled={assetValue === 0n}
                            onClick={async () => {
                              await sellCoupons([
                                erc1155BalanceIsNotZeroCouponBalances[index],
                              ])
                              setClicked(false)
                            }}
                            className="flex flex-col my-1 w-16 h-7 sm:h-8 justify-center items-center rounded bg-opacity-10 text-xs text-opacity-90 font-semibold text-green-500 bg-green-500 hover:bg-green-300 hover:bg-opacity-10 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-300 dark:disabled:text-gray-500"
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    ),
                  )}
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
