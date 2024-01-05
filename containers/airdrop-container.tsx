import React from 'react'

import { NumberOneBoxSvg } from '../components/svg/number-one-box-svg'
import { NumberTwoBoxSvg } from '../components/svg/number-two-box-svg'
import { NumberThreeBoxSvg } from '../components/svg/number-three-box-svg'
import { RightBracketAngleSvg } from '../components/svg/right-bracket-angle-svg'

export const AirdropContainer = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center shrink-0 w-screen bg-white dark:bg-gray-850">
        <div className="flex flex-col gap-4 mt-8 lg:mt-24 px-4 sm:px-0">
          <div className="flex h-[418px] justify-center">
            <div className="flex flex-col gap-4 lg:gap-8 pt-8">
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
                <div className="flex flex-row gap-4 text-lg font-semibold">
                  <div className="flex flex-row gap-2 items-center">
                    <NumberOneBoxSvg /> Collect point
                  </div>
                  <div className="flex items-center">
                    <RightBracketAngleSvg />
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <NumberTwoBoxSvg /> Get airdrop
                  </div>
                  <div className="flex items-center">
                    <RightBracketAngleSvg />
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
              <img src="airdrop.png" className="w-[84px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex">DOWN</div>
    </div>
  )
}
