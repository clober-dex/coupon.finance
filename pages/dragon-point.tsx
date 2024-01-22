import React, { useEffect } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ChineseNewYearSvg } from '../components/svg/chinese-new-year-svg'
import { DragonEggSvg } from '../components/svg/tier/dragon-egg-svg'
import { BabyDragonSvg } from '../components/svg/tier/baby-dragon-svg'
import { BronzeDragonSvg } from '../components/svg/tier/bronze-dragon-svg'
import { SilverDragonSvg } from '../components/svg/tier/silver-dragon-svg'
import { GoldDragonSvg } from '../components/svg/tier/gold-dragon-svg'
import { LegendaryDragonSvg } from '../components/svg/tier/legendary-dragon-svg'
import { formatAddress } from '../utils/string'
import { ProtocolAaveSvg } from '../components/svg/protocol-aave-svg'
import { PlusSvg } from '../components/svg/plus-svg'
import { ProtocolGMXSvg } from '../components/svg/protocol-gmx-svg'
import { ProtocolPendleSvg } from '../components/svg/protocol-pendle-svg'
import { LeftGoldLogoSvg } from '../components/svg/left-gold-logo-svg'
import { RightGoldLogoSvg } from '../components/svg/right-gold-logo-svg'
import { ProtocolMantaSvg } from '../components/svg/protocol-manta-svg'
import { ProtocolBlastSvg } from '../components/svg/protocol-blast-svg'
import { NFTLilPudgysSvg } from '../components/svg/nft-lil-pudgys-svg'
import { NFTPudgyPresentSvg } from '../components/svg/nft-pudgy-present-svg'
import { usePointContext } from '../contexts/point-context'
import { toHumanFriendly } from '../utils/numbers'
import { NFTPudgyPenguinsSvg } from '../components/svg/nft-pudgy-penguins-svg'
import { DragonPointClaimSuccessModal } from '../components/modal/dragon-point-claim-success-modal'
import { DragonPointNonEligibleModal } from '../components/modal/dragon-point-non-eligible-modal'
import { claimDragonPoint } from '../apis/point'

const DragonPoint = () => {
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  const { address: userAddress } = useAccount()
  const { dragonPoints } = usePointContext()
  const [showModal, setShowModal] = React.useState(
    dragonPoints && (dragonPoints.point === 0 || dragonPoints.claimed),
  )
  useEffect(() => {
    setShowModal(
      dragonPoints && (dragonPoints.point === 0 || dragonPoints.claimed),
    )
  }, [dragonPoints, userAddress])

  return (
    <main className="flex flex-1 flex-col  justify-center items-center">
      {dragonPoints && dragonPoints.point === 0 && showModal ? (
        <DragonPointNonEligibleModal
          router={router}
          onClose={() => {
            setShowModal(false)
          }}
        />
      ) : (
        <></>
      )}
      {dragonPoints && dragonPoints.point > 0 && showModal ? (
        <DragonPointClaimSuccessModal
          router={router}
          onClose={() => {
            setShowModal(false)
          }}
        />
      ) : (
        <></>
      )}
      <div className="w-full bg-white dark:bg-gray-850">
        <div className="flex flex-col lg:flex-row m-auto w-full max-w-[960px] px-4 gap-0 lg:gap-8">
          <div className="flex flex-col gap-3 lg:gap-8 items-center justify-center">
            <div className="text-center lg:text-start text-2xl font-bold lg:text-5xl lg:font-semibold lg:whitespace-nowrap flex justify-center items-center leading-[32px] lg:leading-[58px]">
              Year of the long(龙), <br />
              Claim your <br className="hidden lg:inline" /> Dragon Points!
            </div>
            <Link
              href="https://docs.coupon.finance/tokenomics/points"
              target="_blank"
            >
              <div className="underline underline-offset-2 flex justify-center lg:justify-start w-full text-green-500 font-semibold text-sm lg:text-base">
                What are dragon points?
              </div>
            </Link>
          </div>
          <div className="flex justify-center">
            <ChineseNewYearSvg className="w-[296px] h-[238px] lg:w-[561px] lg:h-[452px]" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl w-[360px] lg:w-[960px] mt-[24px] lg:mt-[96px] flex p-4 lg:px-8 lg:py-12 flex-col items-center gap-8">
        {userAddress && dragonPoints ? (
          <>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-1 lg:gap-16 self-stretch">
              <div className="text-base lg:text-2xl font-semibold">
                {formatAddress(userAddress)}
              </div>
              <div className="text-gray-500 text-xs lg:text-base font-semibold lg:ml-auto">
                Check how much point is eligible for your wallet!
              </div>
            </div>
            <div className="flex flex-col items-start gap-6 self-stretch">
              <div className="flex py-4 lg:py-8 flex-col items-center gap-4 self-stretch bg-gradient-to-r from-[#00e0531a] to-[#24f2ff1a] rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="font-semibold text-xs lg:text-lg text-gray-500">
                    Your total dragon points
                  </div>
                  <div className="font-semibold text-2xl lg:text-5xl">
                    {toHumanFriendly(dragonPoints.point)}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!userAddress) {
                      return
                    }

                    try {
                      const claimed = await claimDragonPoint(userAddress)
                      setShowModal(claimed)
                    } catch (e) {
                      console.log(e)
                    }
                  }}
                  disabled={dragonPoints.point === 0 || dragonPoints.claimed}
                  className="w-[264px] lg:w-[320px] font-bold text-base bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
                >
                  Claim
                </button>
              </div>

              <div className="flex flex-col items-start gap-3">
                <div className="text-sm lg:text-xl font-semibold">
                  DeFi Connoisseurs point
                </div>
                <div className="w-[328px] lg:w-[896px] rounded-2xl flex px-4 py-6 bg-gray-50 dark:bg-gray-800 flex-col justify-center items-center gap-6">
                  <div className="font-semibold text-xl lg:text-3xl rounded-xl">
                    {toHumanFriendly(dragonPoints.defiPoint)}
                  </div>
                  <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-3 lg:gap-8">
                    <div className="flex items-center gap-3">
                      <ProtocolAaveSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Aave Deposits
                        </div>
                        <div className="font-semibold text-sm text-gray-400">
                          Arbitrum
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-auto">
                      <PlusSvg className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <ProtocolGMXSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          GMX stakers
                        </div>
                        <div className="font-semibold text-sm text-gray-400">
                          Arbitrum
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-auto">
                      <PlusSvg className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <ProtocolPendleSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Pendle stakers
                        </div>
                        <div className="font-semibold text-sm text-gray-400">
                          Mainnet
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3">
                <div className="text-sm lg:text-xl font-semibold">
                  Substantial benefitoor point
                </div>
                <div className="w-[328px] lg:w-[896px] rounded-2xl flex px-4 py-6 bg-gray-50 dark:bg-gray-800 flex-col justify-center items-center gap-6">
                  <div className="font-semibold text-xl lg:text-3xl rounded-xl">
                    {toHumanFriendly(dragonPoints.substantialBenefitPoint)}
                  </div>
                  <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-3 lg:gap-8">
                    <div className="flex items-center gap-3">
                      <ProtocolBlastSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Blast bridge
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-auto">
                      <PlusSvg className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <ProtocolMantaSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Manta bridge
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3">
                <div className="text-sm lg:text-xl font-semibold">
                  Pudgy holders point
                </div>
                <div className="w-[328px] lg:w-[896px] rounded-2xl flex px-4 py-6 bg-gray-50 dark:bg-gray-800 flex-col justify-center items-center gap-6">
                  <div className="font-semibold text-xl lg:text-3xl rounded-xl">
                    {toHumanFriendly(dragonPoints.pudgyPoint)}
                  </div>
                  <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-3 lg:gap-8">
                    <div className="flex items-center gap-3">
                      <NFTPudgyPenguinsSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Pudgy Penguins
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-auto">
                      <PlusSvg className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <NFTLilPudgysSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Lil Pudgys
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full lg:w-auto">
                      <PlusSvg className="w-2 h-2 lg:w-2.5 lg:h-2.5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <NFTPudgyPresentSvg className="w-8 h-8 lg:w-12 lg:h-12 rounded-full dark:bg-white" />
                      <div className="flex flex-col justify-center items-start gap-0.5">
                        <div className="font-semibold text-sm lg:text-lg">
                          Pudgy Present
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start gap-8 text-sm lg:text-2xl font-semibold">
              Connect Wallet to Check Eligibility
            </div>
            <button
              onClick={() => openConnectModal && openConnectModal()}
              className="w-[264px] lg:w-[320px] font-bold text-base bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
            >
              Connect Wallet
            </button>
          </>
        )}
      </div>

      <div className="flex flex-row gap-4 lg:gap-8 mt-8">
        <DragonEggSvg className="w-10 h-10 lg:w-20 lg:h-20" />
        <BabyDragonSvg className="w-10 h-10 lg:w-20 lg:h-20" />
        <BronzeDragonSvg className="w-10 h-10 lg:w-20 lg:h-20" />
        <SilverDragonSvg className="w-10 h-10 lg:w-20 lg:h-20" />
        <GoldDragonSvg className="w-10 h-10 lg:w-20 lg:h-20" />
        <LegendaryDragonSvg className="w-10 h-10 lg:w-20 lg:h-20" />
      </div>

      <div className="hidden lg:absolute lg:block left-0 top-20">
        <LeftGoldLogoSvg />
      </div>
      <div className="hidden lg:absolute lg:block right-0 -bottom-[200px]">
        <RightGoldLogoSvg />
      </div>
    </main>
  )
}

export default DragonPoint
