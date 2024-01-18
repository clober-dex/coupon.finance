import React, { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'

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
import { PointCard } from '../components/card/point-card'
import { GoldMedalIconSvg } from '../components/svg/gold-medal-icon-svg'
import { SilverMedalIconSvg } from '../components/svg/silver-medal-icon-svg'
import { BronzeMedalIconSvg } from '../components/svg/bronze-medal-icon-svg'
import { RocketMobileIconSvg } from '../components/svg/rocket-mobile-icon-svg'
import { RocketPCIconSvg } from '../components/svg/rocket-pc-icon-svg'
import { InvitePCIconSvg } from '../components/svg/invite-pc-icon-svg'
import { InviteMobileIconSvg } from '../components/svg/invite-mobile-icon-svg'
import { CopyIconSvg } from '../components/svg/copy-icon-svg'
import { CouponMobileIconSvg } from '../components/svg/coupon-mobile-icon-svg'
import { CouponPCIconSvg } from '../components/svg/coupon-pc-icon-svg'
import { MoneyTopIconSvg } from '../components/svg/money-top-icon-svg'
import { MoneyBottomIconSvg } from '../components/svg/money-bottom-icon-svg'
import { usePointContext } from '../contexts/point-context'
import { UpBracketAngleSvg } from '../components/svg/up-bracket-angle-svg'
import { DragonEggSvg } from '../components/svg/tier/dragon-egg-svg'
import { ZeroTierSvg } from '../components/svg/tier/zero-tier-svg'
import { BabyDragonSvg } from '../components/svg/tier/baby-dragon-svg'
import { FirstTierSvg } from '../components/svg/tier/first-tier-svg'
import { BronzeDragonSvg } from '../components/svg/tier/bronze-dragon-svg'
import { SecondTierSvg } from '../components/svg/tier/second-tier-svg'
import { ThirdTierSvg } from '../components/svg/tier/third-tier-svg'
import { SilverDragonSvg } from '../components/svg/tier/silver-dragon-svg'
import { GoldDragonSvg } from '../components/svg/tier/gold-dragon-svg'
import { FourthTierSvg } from '../components/svg/tier/fourth-tier-svg'
import { FifthTierSvg } from '../components/svg/tier/fifth-tier-svg'
import { LegendaryDragonSvg } from '../components/svg/tier/legendary-dragon-svg'
import { QuestionMarkSvg } from '../components/svg/question-mark-svg'
import { toHumanFriendly } from '../utils/numbers'
import { BalloonModal } from '../components/modal/balloon-modal'
import { Point } from '../model/point'
import { classifyPointTier } from '../utils/point'
import { BadyDragonCard } from '../components/card/tier/bady-dragon-card'
import { BronzeDragonCard } from '../components/card/tier/bronze-dragon-card'
import { GoldDragonCard } from '../components/card/tier/gold-dragon-card'
import { LegendaryDragonCard } from '../components/card/tier/legendary-dragon-card'
import { SilverDragonCard } from '../components/card/tier/silver-dragon-card'
import { DragonEggCard } from '../components/card/tier/dragon-egg-card'

const LeaderboardTab = ({
  userAddress,
  points,
}: {
  userAddress: `0x${string}` | undefined
  points: Point | null
}) => {
  return (
    <div className="flex flex-col items-start gap-8 lg:gap-16 mt-8">
      {userAddress && points ? (
        <div className="flex flex-col items-start gap-4 px-4 w-full">
          <div className="flex items-center gap-1 font-semibold text-sm lg:text-xl">
            <PointIconSvg className="w-4 h-4 lg:w-8 lg:h-8" />
            <div>My Point</div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex py-6 flex-col items-center w-full gap-3 rounded-xl bg-white dark:bg-gray-850">
              <div className="text-gray-500 text-xs lg:text-lg font-semibold flex flex-row items-center gap-1">
                Total points{' '}
                <QuestionMarkSvg
                  data-tooltip-id="dragon-point-tooltip"
                  data-tooltip-content="Referral Points will be claimed automatically before the airdrop"
                  className="w-3 h-3 lg:w-4 lg:h-4"
                />
                <Tooltip
                  id="dragon-point-tooltip"
                  style={{
                    width: '200px',
                  }}
                />
              </div>
              <div className="font-bold text-3xl lg:text-5xl">
                {toHumanFriendly(points.totalPoint)}
              </div>
            </div>
            <div className="flex lg:hidden flex-col items-start gap-2 self-stretch">
              <div className="flex items-start gap-2 self-stretch">
                <PointCard
                  title="Deposit points"
                  value={points.bondPositionPoint}
                />
                <PointCard
                  title="Borrow points"
                  value={points.loanPositionPoint}
                />
              </div>
              <div className="flex items-start gap-2 self-stretch">
                <PointCard title="Dragon points" value={points.dragonPoint} />
                <PointCard title="Mango points" value={points.userPoint} />
              </div>
            </div>
            <div className="hidden lg:flex w-full items-start gap-4">
              <PointCard
                title="Deposit points"
                value={points.bondPositionPoint}
              />
              <PointCard
                title="Borrow points"
                value={points.loanPositionPoint}
              />
              <PointCard title="Dragon points" value={points.dragonPoint} />
              <PointCard title="Mango points" value={points.userPoint} />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col items-start gap-4 px-4 w-full">
        <div className="flex items-center gap-1 font-semibold text-sm lg:text-xl">
          <LeaderboardIconSvg className="stroke-gray-950 dark:stroke-white w-4 h-4 lg:w-8 lg:h-8" />
          <div>Leaderboard</div>
        </div>
        <div className="flex pt-4 pb-3 flex-col items-start gap-4 w-full rounded-xl bg-white dark:bg-gray-850">
          <div className="px-5 items-start gap-4 self-stretch flex flex-row text-xs lg:text-sm text-gray-500">
            <div className="w-8 lg:w-[192px]">Rank</div>
            <div className="flex flex-row w-full">
              <div className="flex-1">User</div>
              <div className="flex-1">Points</div>
            </div>
          </div>
          <div className="flex px-2 flex-col items-start gap-1 lg:gap-2 self-stretch text-xs lg:text-sm">
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded bg-green-500 bg-opacity-5">
              <div className="w-8 lg:w-[192px]">240</div>
              <div className="flex flex-row w-full">
                <div className="flex-1">Me (0xe30a...723c)</div>
                <div className="flex-1 font-semibold">1295012</div>
              </div>
            </div>
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded bg-amber-300 bg-opacity-10">
              <div className="w-8 lg:w-[192px]">
                <GoldMedalIconSvg className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-row w-full">
                <div className="flex-1">0xe30a...723c</div>
                <div className="flex-1">1295012</div>
              </div>
            </div>
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded bg-slate-300 bg-opacity-20">
              <div className="w-8 lg:w-[192px]">
                <SilverMedalIconSvg className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-row w-full">
                <div className="flex-1">0xe30a...723c</div>
                <div className="flex-1">1295012</div>
              </div>
            </div>
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded bg-orange-300 bg-opacity-20">
              <div className="w-8 lg:w-[192px]">
                <BronzeMedalIconSvg className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-row w-full">
                <div className="flex-1">0xe30a...723c</div>
                <div className="flex-1">1295012</div>
              </div>
            </div>
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded">
              <div className="w-8 lg:w-[192px] pl-1.5 lg:pl-2">4</div>
              <div className="flex flex-row w-full">
                <div className="flex-1">0xe30a...723c</div>
                <div className="flex-1">1295012</div>
              </div>
            </div>
            <div className="flex h-8 lg:h-10 px-3 items-center gap-4 self-stretch rounded">
              <div className="w-8 lg:w-[192px] pl-1.5 lg:pl-2">5</div>
              <div className="flex flex-row w-full">
                <div className="flex-1">0xe30a...723c</div>
                <div className="flex-1">1295012</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ReferralTab = ({
  referralCode,
  referentCode,
  hasReferent,
  setReferentCode,
}: {
  referralCode: string
  referentCode: string | null
  hasReferent: boolean
  setReferentCode: (code: string) => Promise<void>
}) => {
  const [mode, setMode] = React.useState<'setReferralCode' | 'getReferralCode'>(
    'setReferralCode',
  )
  const [value, setValue] = React.useState<string>(referentCode || '')

  return (
    <div className="flex mx-4 p-4 lg:pt-8 lg:pb-8 flex-col items-start gap-8 lg:gap-16 self-stretch bg-white dark:bg-gray-850 rounded-2xl mt-8">
      <div className="flex w-full rounded text-sm lg:text-base text-gray-500">
        <button
          disabled={mode === 'setReferralCode'}
          onClick={() => setMode('setReferralCode')}
          className="font-semibold flex-1 py-2 rounded-lg bg-gray-50 border-gray-50 dark:bg-gray-800 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[2px]"
        >
          Get referred
        </button>
        <button
          disabled={mode === 'getReferralCode'}
          onClick={() => setMode('getReferralCode')}
          className="font-semibold flex-1 py-2 rounded-lg bg-gray-50 border-gray-50 dark:bg-gray-800 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[2px]"
        >
          Refer others
        </button>
      </div>
      {mode === 'setReferralCode' ? (
        <>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 self-stretch">
            <RocketMobileIconSvg className="flex lg:hidden" />
            <RocketPCIconSvg className="hidden lg:flex" />
            <div className="flex flex-col gap-2 lg:gap-4">
              <div className="text-base lg:text-xl font-semibold text-center lg:text-start">
                Accepting a referral <br />
                boosts your points by up to 10%!
              </div>
              <div className="text-gray-500 text-xs lg:text-base text-center lg:text-start">
                Please enter your fren’s code below{' '}
                <br className="inline lg:hidden" /> to accept a referral.
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 self-stretch w-full justify-center">
            <input
              className="w-full outline-none lg:w-[386px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-start pl-4 text-sm h-12"
              placeholder="Please input the referral code"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              disabled={hasReferent}
              onClick={async () => {
                await setReferentCode(value)
              }}
              className="w-full lg:w-[160px] font-bold bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
            >
              Accept
            </button>
          </div>
        </>
      ) : mode === 'getReferralCode' ? (
        <div className="flex flex-col items-center w-full gap-8 lg:gap-12">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 self-stretch">
            <InviteMobileIconSvg className="flex lg:hidden" />
            <InvitePCIconSvg className="hidden lg:flex" />
            <div className="flex flex-col gap-2 lg:gap-4">
              <div className="text-base lg:text-xl font-semibold text-center lg:text-start">
                Referring others <br />
                boosts your points by 10%!
              </div>
              <div className="text-gray-500 text-xs lg:text-base text-center lg:text-start">
                Copy your referral code below and invite friends!
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[476px] flex px-4 py-3 justify-center items-center gap-2 rounded-lg border-2 border-solid dark:border-white">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-1">
              <div className="text-sm lg:text-base">Your referral code is</div>
              <div className="flex gap-1 text-sm lg:text-base text-green-500 font-semibold">
                {referralCode}
                <button
                  className="flex items-center"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://coupon.finance/?mode=airdrop&referralCode=${referralCode}`,
                    )
                  }
                >
                  <CopyIconSvg />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-3 lg:gap-8 self-stretch">
            <div className="flex flex-row lg:px-8 gap-2 lg:gap-3 text-sm lg:text-xl font-semibold">
              Wallets you referred
              <div className="w-6 h-6 lg:w-9 lg:h-8 px-2 lg:px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-2xl flex-col justify-center items-center gap-2.5 inline-flex">
                2
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex lg:px-8 items-start self-stretch text-gray-400 text-xs lg:text-sm">
                <div className="flex-1">User</div>
                <div className="flex-1">Point</div>
                <div className="flex-1">Referral points</div>
              </div>
              <div className="flex lg:px-4 flex-col items-start gap-2 self-stretch text-xs lg:text-sm">
                <div className="w-full flex lg:h-10 lg:px-4 items-center">
                  <div className="flex-1">0xe30a...723c</div>
                  <div className="flex-1">6000</div>
                  <div className="flex-1">2913</div>
                </div>
                <div className="w-full flex lg:h-10 lg:px-4 items-center">
                  <div className="flex-1">0xe30a...723c</div>
                  <div className="flex-1">4000</div>
                  <div className="flex-1">143</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

const ClaimTab = () => {
  return (
    <div className="flex relative mx-4 px-4 py-8 lg:py-16 flex-col items-start self-stretch bg-white dark:bg-gray-850 rounded-2xl mt-8">
      <>
        <MoneyTopIconSvg className="hidden lg:block absolute left-0 top-0 overflow-hidden" />
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 self-stretch">
          <CouponMobileIconSvg className="flex lg:hidden" />
          <CouponPCIconSvg className="hidden lg:flex" />
          <div className="flex flex-col gap-2 lg:gap-4">
            <div className="text-base lg:text-xl font-semibold text-center lg:text-start">
              You can claim $CPN <br />
              after the snapshot.
            </div>
            <div className="text-gray-500 text-xs lg:text-base text-center lg:text-start">
              The more points you earn, the more $CPN you get!
              <br /> Airdrop will come soon.
            </div>
          </div>
        </div>
        <MoneyBottomIconSvg className="hidden lg:block absolute right-0 bottom-0 overflow-hidden" />
      </>
    </div>
  )
}

const EarnDetailMobile = ({
  router,
  userAddress,
  setMode,
}: {
  router: NextRouter
  userAddress: `0x${string}` | undefined
  setMode: (mode: 'leaderboard' | 'referral' | 'claim') => void
}) => {
  const [show, setShow] = React.useState<boolean>(false)

  return (
    <div className="flex flex-col lg:hidden justify-center">
      <div className="flex px-4 py-3 justify-center w-full text-sm lg:text-xl font-semibold">
        <div>How can I get points?</div>
        <button onClick={() => setShow(!show)}>
          {show ? (
            <UpBracketAngleSvg className="ml-44" />
          ) : (
            <DownBracketAngleSvg className="ml-44" />
          )}
        </button>
      </div>
      {show ? (
        <div className="flex flex-col items-center gap-4 self-stretch">
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-[328px] p-4 flex-col items-center gap-4 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-row gap-2 text-sm font-semibold items-center">
                    <DepositIconSvg className="w-4 h-4" />
                    Deposit points
                  </div>
                  <div className="text-xs font-semibold">
                    For every $1 in trades, earn 1 point per hour.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  router.push({
                    pathname: '/',
                    query: { mode: 'deposit' },
                  })
                }}
                className="flex w-full h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
              >
                Go to deposit
              </button>
            </div>
            <div className="flex w-[328px] p-4 flex-col items-center gap-4 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-row gap-2 text-sm font-semibold items-center">
                    <BorrowIconSvg className="w-4 h-4" />
                    Borrow points
                  </div>
                  <div className="text-xs font-semibold">
                    For every $1 in trades, earn 1 point per hour.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  router.push({
                    pathname: '/',
                    query: { mode: 'borrow' },
                  })
                }}
                className="flex w-full h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
              >
                Go to borrow
              </button>
            </div>
            <div className="flex w-[328px] p-4 flex-col items-center gap-4 rounded-xl ring-2 ring-gray-200">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-row gap-2 text-sm font-semibold items-center">
                    <ReferralIconSvg className="stroke-gray-950 dark:stroke-white stroke-2 w-4 h-4" />
                    Referral points
                  </div>
                  <div className="text-xs font-semibold">
                    You can get more from your referees’ points.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (userAddress) {
                    setMode('referral')
                  }
                }}
                className="flex w-full h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
              >
                Go to refer
              </button>
            </div>
          </div>
          <div className="flex gap-1 items-center mb-4">
            <Link
              href="https://docs.coupon.finance/tokenomics/points"
              target="_blank"
              className="text-sm h-6 text-green-500 font-semibold"
            >
              See Point rule detail
            </Link>
            <RightBracketAngleSvg className="w-4 h-4 stroke-green-500" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

const EarnDetailPC = ({
  router,
  userAddress,
  setMode,
}: {
  router: NextRouter
  userAddress: `0x${string}` | undefined
  setMode: (mode: 'leaderboard' | 'referral' | 'claim') => void
}) => (
  <div className="hidden lg:flex flex-col gap-6 items-center">
    <div className="flex flex-row gap-4 w-[960px] items-end">
      <div className="text-2xl font-semibold">How can I get points?</div>
      <div className="flex gap-1 items-center">
        <Link
          href="https://docs.coupon.finance/tokenomics/points"
          target="_blank"
          className="h-6 text-green-500 font-semibold"
        >
          See Point rule detail
        </Link>
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
          <span className="block">For every $1 in trades,</span>
          <span className="block">earn 1 point per hour.</span>
        </p>
        <button
          onClick={() => {
            router.push({
              pathname: '/',
              query: { mode: 'deposit' },
            })
          }}
          className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
        >
          Go to deposit
        </button>
      </div>
      <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
        <div className="flex flex-row gap-2 text-lg font-semibold">
          <BorrowIconSvg />
          Borrow points
        </div>
        <p className="font-semibold text-sm">
          <span className="block">For every $1 in trades,</span>
          <span className="block">earn 1 point per hour.</span>
        </p>
        <button
          onClick={() => {
            router.push({
              pathname: '/',
              query: { mode: 'borrow' },
            })
          }}
          className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
        >
          Go to borrow
        </button>
      </div>
      <div className="flex flex-1 px-6 py-4 flex-col items-start gap-4 flex-grow flex-shrink-0 basis-0 rounded-xl ring-2 ring-gray-200">
        <div className="flex flex-row gap-2 text-lg font-semibold">
          <ReferralIconSvg className="stroke-gray-950 dark:stroke-white stroke-2" />
          Referral points
        </div>
        <p className="font-semibold text-sm">
          <span className="block">You can get more from</span>
          <span className="block">your referees’ points.</span>
        </p>
        <button
          onClick={() => {
            if (userAddress) {
              setMode('referral')
            }
          }}
          className="flex w-[267px] h-8 bg-green-500 bg-opacity-10 rounded flex-col justify-center items-center opacity-90 text-center text-green-500 text-sm font-semibold"
        >
          Go to refer
        </button>
      </div>
    </div>
  </div>
)

const PointTiers = () => {
  const [show, setShow] = React.useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4 mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 lg:p-8 lg:rounded-2xl">
      <div className="flex justify-between text-sm font-bold lg:text-xl">
        <div>Point Tiers</div>
        <button onClick={() => setShow(!show)}>
          {show ? (
            <UpBracketAngleSvg className="w-4 h-4 lg:w-8 lg:h-8 stroke-green-500" />
          ) : (
            <DownBracketAngleSvg className="w-4 h-4 lg:w-8 lg:h-8 stroke-green-500" />
          )}
        </button>
      </div>
      {show ? (
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              0M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <DragonEggSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <ZeroTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Dragon Egg
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>0%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              5M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <BabyDragonSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <FirstTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Baby Dragon
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>1%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              15M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <BronzeDragonSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <SecondTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Bronze Dragon
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>2%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              50M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <SilverDragonSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <ThirdTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Silver Dragon
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>3%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              150M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <GoldDragonSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <FourthTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Gold Dragon
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>4%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-stretch">
            <div className="w-[45px] lg:w-24 text-green-500 text-xs lg:text-xl font-semibold">
              500M~
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-row items-center gap-2 lg:gap-4">
                <LegendaryDragonSvg className="w-8 h-8 lg:w-12 lg:h-12" />
                <div className="flex flex-row gap-1 lg:gap-2 items-center">
                  <FifthTierSvg className="w-4 h-4 lg:w-6 lg:h-6" />
                  <span className="text-xs lg:text-xl font-semibold">
                    Legendary Dragon
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs lg:text-xl text-green-500 font-semibold gap-2 flex flex-row">
              <span className="text-gray-400">
                Boost <span className="hidden lg:inline">point</span>
              </span>{' '}
              <div>5%</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export const AirdropContainer = () => {
  const router = useRouter()
  const { points, referralCode, referentCode, hasReferent, setReferentCode } =
    usePointContext()
  const { address: userAddress } = useAccount()

  const [mode, setMode] = React.useState<'leaderboard' | 'referral' | 'claim'>(
    'leaderboard',
  )
  const tier = useMemo(
    () => (points ? classifyPointTier(points.totalPoint) : null),
    [points],
  )
  const [currentPercent, experiencePercent] = useMemo(
    () =>
      points && tier
        ? [
            Math.floor((points.totalPoint * 100) / tier.end),
            Math.floor((points.tomorrowTotalPoint * 100) / tier.end),
          ]
        : [0, 0],
    [points, tier],
  )

  useEffect(() => {
    if (!hasReferent && referentCode && userAddress) {
      setMode('referral')
    }
  }, [hasReferent, referentCode, userAddress])

  return (
    <div className="flex flex-col items-center">
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

        <EarnDetailMobile
          router={router}
          setMode={setMode}
          userAddress={userAddress}
        />

        <EarnDetailPC
          router={router}
          setMode={setMode}
          userAddress={userAddress}
        />

        {userAddress && points && tier ? (
          <div className="m-auto px-4 lg:mt-4 lg:px-0 w-[360px] lg:w-[960px]">
            <div className="mb-4 text-sm font-bold lg:text-2xl ">
              My point level
            </div>

            {tier.level === 0 ? (
              <DragonEggCard totalPoint={points.totalPoint} />
            ) : tier.level === 1 ? (
              <BadyDragonCard totalPoint={points.totalPoint} />
            ) : tier.level === 2 ? (
              <BronzeDragonCard totalPoint={points.totalPoint} />
            ) : tier.level === 3 ? (
              <SilverDragonCard totalPoint={points.totalPoint} />
            ) : tier.level === 4 ? (
              <GoldDragonCard totalPoint={points.totalPoint} />
            ) : (
              <LegendaryDragonCard />
            )}

            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="relative rounded-lg bg-gray-100 h-4 overflow-hidden lg:h-6 lg:rounded-xl dark:bg-slate-800">
                <div
                  className="absolute left-0 rounded-lg bg-green-200 dark:bg-green-400 dark:bg-opacity-25 h-full overflow-hidden lg:rounded-xl"
                  style={{ width: `${experiencePercent}%` }}
                />
                <div
                  className="flex justify-end items-center px-2 absolute left-0 rounded-lg bg-green-500 h-full overflow-hidden lg:rounded-xl"
                  style={{ width: `${currentPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 lg:text-lg">
                <span>0</span>
                <span>{toHumanFriendly(points.tomorrowTotalPoint)}</span>
                <span>{toHumanFriendly(tier.end)}</span>
              </div>
            </div>

            <div
              className="relative mb-6 h-10 lg:mb-14"
              style={{
                left: `${5 + experiencePercent}%`,
              }}
            >
              <BalloonModal className="fill-[#22c55e26]">
                <div className="text-xs lg:text-base font-semibold px-4 py-3 rounded-lg bg-[#22c55e26] flex justify-center items-center gap-1">
                  <span>You will earn</span>
                  <span className="text-green-500">
                    {toHumanFriendly(
                      points.tomorrowTotalPoint - points.totalPoint,
                    )}{' '}
                    point
                  </span>
                  <span>tomorrow!</span>
                </div>
              </BalloonModal>
            </div>

            <PointTiers />
          </div>
        ) : (
          <></>
        )}

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
            onClick={() => (userAddress ? setMode('referral') : null)}
            className="group w-[108px] lg:w-[220px] disabled:text-green-500 flex flex-row gap-1 lg:gap-2 items-center justify-center font-bold pb-1 lg:pb-3 border-b-2 border-solid disabled:border-b-green-500 text-gray-400 border-b-transparent"
          >
            <div className="relative">
              <ReferralIconSvg className="group-disabled:stroke-green-500 stroke-gray-400 stroke-2 w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            Referral
          </button>
          <button
            disabled={mode === 'claim'}
            onClick={() => (userAddress ? setMode('claim') : null)}
            className="group w-[96px] lg:w-[220px] disabled:text-green-500 flex flex-row gap-1 lg:gap-2 items-center justify-center font-bold pb-1 lg:pb-3 border-b-2 border-solid disabled:border-b-green-500 text-gray-400 border-b-transparent"
          >
            <div className="relative">
              <ClaimIconSvg className="group-disabled:stroke-green-500 stroke-gray-400 stroke-2 w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            Claim
          </button>
        </div>
      </div>
      <div className="w-[360px] lg:w-[960px]">
        {mode === 'leaderboard' ? (
          <LeaderboardTab userAddress={userAddress} points={points} />
        ) : mode === 'referral' && referralCode ? (
          <ReferralTab
            referralCode={referralCode}
            referentCode={referentCode}
            hasReferent={hasReferent}
            setReferentCode={setReferentCode}
          />
        ) : mode === 'claim' ? (
          <ClaimTab />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
