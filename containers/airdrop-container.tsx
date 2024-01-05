import React from 'react'

import { NumberOneBoxSvg } from '../components/svg/number-one-box-svg'
import { NumberTwoBoxSvg } from '../components/svg/number-two-box-svg'
import { NumberThreeBoxSvg } from '../components/svg/number-three-box-svg'
import { RightBracketAngleSvg } from '../components/svg/right-bracket-angle-svg'
import { DownBracketAngleSvg } from '../components/svg/down-bracket-angle-svg'
import { DepositIconSvg } from '../components/svg/deposit-icon-svg'

export const AirdropContainer = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 justify-center shrink-0 w-screen bg-white dark:bg-gray-850">
        <div className="flex flex-col gap-4 mt-8 lg:mt-24 px-4 sm:px-0">
          <div className="flex lg:h-[418px] justify-center">
            <div className="flex flex-col gap-4 lg:gap-8 lg:pt-8">
              <h1 className="flex font-bold text-2xl leading-[32px] lg:text-6xl lg:leading-[72px] lg:mb-6">
                <p className="block lg:hidden">
                  <span className="block">Collect points to get</span>
                  <span className="block">$CPN airdrop!</span>
                </p>
                <p className="hidden lg:block">
                  <span className="block">Collect points to</span>
                  <span className="block">get $CPN airdrop!</span>
                </p>
              </h1>
              <div className="flex flex-col gap-6">
                <h3 className="flex text-gray-500 dark:text-gray-400 text-xs lg:text-base">
                  <p className="block lg:hidden">
                    <span className="block">Want to earn $CPN?</span>
                    <span className="block">
                      Collect points as much as you can!
                    </span>
                  </p>
                  <p className="hidden lg:block font-semibold leading-5">
                    <span className="block">
                      Want to earn $CPN? Collect points as much as you can!
                    </span>
                  </p>
                </h3>
                <div className="hidden lg:flex flex-row gap-4 text-lg font-semibold">
                  <div className="flex flex-row gap-2 items-center">
                    <NumberOneBoxSvg /> Collect point
                  </div>
                  <div className="flex items-center">
                    <RightBracketAngleSvg className="stroke-[#9CA3AF]" />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <NumberTwoBoxSvg /> Get airdrop
                  </div>
                  <div className="flex items-center">
                    <RightBracketAngleSvg className="stroke-[#9CA3AF]" />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <NumberThreeBoxSvg /> Claim $CPN
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative h-[418px] w-[402px]">
              <img
                src="airdrop.png"
                className="absolute top-[137px] w-[149px] h-[217px] shrink-0 opacity-50"
              />
              <img src="airdrop.png" className="absolute right-0" />
            </div>
            <div className="block lg:hidden relative ml-4">
              <img src="airdrop.png" className="w-[84px] mb-4" />
            </div>
          </div>
        </div>
        <div className="flex lg:hidden flex-row gap-4 text-xs justify-center font-semibold">
          <div className="flex flex-row gap-2 items-center">
            <NumberOneBoxSvg className="h-4 w-4" /> Collect point
          </div>
          <div className="flex items-center">
            <RightBracketAngleSvg />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NumberTwoBoxSvg className="h-4 w-4" /> Get airdrop
          </div>
          <div className="flex items-center">
            <RightBracketAngleSvg />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NumberThreeBoxSvg className="h-4 w-4" /> Claim $CPN
          </div>
        </div>
        <div className="flex lg:hidden justify-center">
          <div className="flex px-4 py-3 justify-center text-sm lg:text-xl font-semibold">
            <div>How can I get points?</div>
            <DownBracketAngleSvg className="ml-56" />
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 items-center">
          <div className="flex flex-row gap-4 w-[960px] items-end">
            <div className="text-2xl font-semibold">How can I get points?</div>
            <div className="flex gap-1 items-center">
              <div className="h-6 text-green-500 font-semibold">
                See Point rule detail
              </div>
              <RightBracketAngleSvg className="w-4 h-4 stroke-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-row gap-2 text-lg font-semibold">
                <DepositIconSvg />
                Deposit points
              </div>
              <p className="font-semibold text-sm">
                <span className="block">For every $1000 in trades,</span>
                <span className="block">earn 40 points.</span>
              </p>
              <button className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold">
                Go to deposit
              </button>
            </div>
            <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-row gap-2 text-lg font-semibold">
                <DepositIconSvg />
                Deposit points
              </div>
              <p className="font-semibold text-sm">
                <span className="block">For every $1000 in trades,</span>
                <span className="block">earn 40 points.</span>
              </p>
              <button className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold">
                Go to deposit
              </button>
            </div>
            <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-row gap-2 text-lg font-semibold">
                <DepositIconSvg />
                Deposit points
              </div>
              <p className="font-semibold text-sm">
                <span className="block">For every $1000 in trades,</span>
                <span className="block">earn 40 points.</span>
              </p>
              <button className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold">
                Go to deposit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">DOWN</div>
    </div>
  )
}
