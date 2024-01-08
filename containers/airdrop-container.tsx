import React from 'react'

import { NumberOneBoxSvg } from '../components/svg/number-one-box-svg'
import { NumberTwoBoxSvg } from '../components/svg/number-two-box-svg'
import { NumberThreeBoxSvg } from '../components/svg/number-three-box-svg'
import { RightBracketAngleSvg } from '../components/svg/right-bracket-angle-svg'
import { DownBracketAngleSvg } from '../components/svg/down-bracket-angle-svg'
import { DepositIconSvg } from '../components/svg/deposit-icon-svg'
import { BorrowIconSvg } from '../components/svg/borrow-icon-svg'
import { ReferralIconSvg } from '../components/svg/referral-icon-svg'
import { LeaderboardIconSvg } from '../components/svg/leaderboard-icon-svg'
import { ClaimIconSvg } from '../components/svg/claim-icon-svg'
import { PointIconSvg } from '../components/svg/point-icon-svg'

const LeaderboardTab = () => {
  return (
    <div className="flex flex-col items-start gap-8 mt-8">
      <div className="flex flex-col items-start gap-4 px-4 w-full">
        <div className="flex items-center gap-1 font-semibold text-sm lg:text-xl">
          <PointIconSvg className="w-4 h-4 lg:w-8 lg:h-8" />
          <div>My Point</div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex py-6 flex-col items-center w-full gap-3 bg-white rounded-xl dark:bg-gray-850">
            <div className="text-gray-500 text-xs lg:text-lg font-semibold">
              Total points
            </div>
            <div className="font-bold text-3xl lg:text-5xl">1295012</div>
          </div>
        </div>
      </div>
      <div>b</div>
    </div>
  )
}

const ReferralTab = () => {
  return (
    <div className="flex p-4 flex-col items-start gap-8 self-stretch">
      <div className="flex mb-6 w-full rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]">
          Get referred
        </button>
        <button className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]">
          Refer others
        </button>
      </div>
    </div>
  )
}

const ClaimTab = () => {
  return <div>C</div>
}

export const AirdropContainer = () => {
  const [mode, setMode] = React.useState<'leaderboard' | 'referral' | 'claim'>(
    'leaderboard',
  )

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
        <div className="flex lg:hidden flex-row gap-1 text-xs justify-center font-semibold">
          <div className="flex flex-row gap-2 items-center">
            <NumberOneBoxSvg className="h-4 w-4" /> Collect point
          </div>
          <div className="flex items-center">
            <RightBracketAngleSvg className="w-4 h-4 stroke-[#9CA3AF]" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NumberTwoBoxSvg className="h-4 w-4" /> Get airdrop
          </div>
          <div className="flex items-center">
            <RightBracketAngleSvg className="w-4 h-4 stroke-[#9CA3AF]" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <NumberThreeBoxSvg className="h-4 w-4" /> Claim $CPN
          </div>
        </div>
        <div className="flex lg:hidden justify-center">
          <div className="flex px-4 py-3 justify-center w-full text-sm lg:text-xl font-semibold">
            <div>How can I get points?</div>
            <DownBracketAngleSvg className="ml-44" />
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
                <BorrowIconSvg />
                Borrow points
              </div>
              <p className="font-semibold text-sm">
                <span className="block">For every $1000 in trades,</span>
                <span className="block">earn 40 points.</span>
              </p>
              <button className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold">
                Go to borrow
              </button>
            </div>
            <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-row gap-2 text-lg font-semibold">
                <ReferralIconSvg className="stroke-gray-950 dark:stroke-white stroke-2" />
                Referral points
              </div>
              <p className="font-semibold text-sm">
                <span className="block">You can get 10% from</span>
                <span className="block">your referees’ points.</span>
              </p>
              <button className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold">
                Go to deposit
              </button>
            </div>
          </div>
        </div>
        <div className="text-sm lg:text-xl mt-0 lg:mt-8 w-full flex gap-2 lg:gap-[100px] items-end justify-center pb-1 bg-white dark:bg-gray-850 h-[26px] lg:h-[52px]">
          <button
            disabled={mode === 'leaderboard'}
            onClick={() => setMode('leaderboard')}
            className="group w-[108px] lg:w-[220px] disabled:text-green-500 flex flex-row gap-1 lg:gap-2 items-center justify-center font-bold pb-1 lg:pb-3 border-b-2 border-solid disabled:border-b-green-500 text-gray-400 border-b-transparent"
          >
            <div className="relative">
              <LeaderboardIconSvg className="group-disabled:stroke-green-500 stroke-gray-400 stroke-2 w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            Leaderboard
          </button>
          <button
            disabled={mode === 'referral'}
            onClick={() => setMode('referral')}
            className="group w-[108px] lg:w-[220px] disabled:text-green-500 flex flex-row gap-1 lg:gap-2 items-center justify-center font-bold pb-1 lg:pb-3 border-b-2 border-solid disabled:border-b-green-500 text-gray-400 border-b-transparent"
          >
            <div className="relative">
              <ReferralIconSvg className="group-disabled:stroke-green-500 stroke-gray-400 stroke-2 w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            Referral
          </button>
          <button
            disabled={mode === 'claim'}
            onClick={() => setMode('claim')}
            className="group w-[96px] lg:w-[220px] disabled:text-green-500 flex flex-row gap-1 lg:gap-2 items-center justify-center font-bold pb-1 lg:pb-3 border-b-2 border-solid disabled:border-b-green-500 text-gray-400 border-b-transparent"
          >
            <div className="relative">
              <ClaimIconSvg className="group-disabled:stroke-green-500 stroke-gray-400 stroke-2 w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            Claim
          </button>
        </div>
      </div>
      <div className="lg:px-24">
        {mode === 'leaderboard' ? (
          <LeaderboardTab />
        ) : mode === 'referral' ? (
          <ReferralTab />
        ) : mode === 'claim' ? (
          <ClaimTab />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
