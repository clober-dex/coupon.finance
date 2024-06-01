import React from 'react'
import { useAccount } from 'wagmi'
import Image from 'next/image'

import XLogoSvg from '../components/svg/x-logo-svg'
import DiscordLogoSvg from '../components/svg/discord-logo-svg'
import LogoBlackSmallSvg from '../components/svg/logo-black-small-svg'
import { WalletSelectForComingSoon } from '../components/selector/wallet-select-for-coming-soon'
import CouponBlackSvg from '../components/svg/coupon-black-svg'

export const ComingSoonContainer = () => {
  const { address, status } = useAccount()
  return (
    <div className="text-gray-950 bg-gray-50 bg-[url('../public/coming-soon-background-mobile.png')] sm:bg-contain bg-contain bg-no-repeat bg-[center_bottom_700px] sm:bg-bottom sm:bg-[url('../public/coming-soon-background.png')] w-screen min-h-screen">
      <div className="flex flex-col items-center gap-[48px] sm:hidden">
        <div className="flex flex-col items-center gap-10">
          <div className="flex w-screen px-4 py-2 items-center">
            <div className="flex px-0 py-[6px] items-center flex-[1_0_0]">
              <LogoBlackSmallSvg />
            </div>
          </div>
          <div className="mx-[26px] inline-flex flex-col items-center gap-8 w-[100%]">
            <div className="flex flex-col items-center gap-6">
              <div className="flex px-5 py-2 justify-center items-center gap-2.5 border-[1.5px] border-gray-950 border-solid rounded-[40px] inline-flex">
                <div className="text-slate-800 text-base font-semibold">
                  Coming soon
                </div>
              </div>
              <div className="text-center text-gray-900 text-[32px] font-semibold leading-[34px]">
                Fixed term, Fixed rate
                <br />
                Lending protocol.
              </div>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="opacity-70 text-gray-700 text-base">
                  Stay tune for our update!
                </div>
                <div className="flex items-start gap-3">
                  <a
                    className="flex items-center gap-3 p-2 pr-5 rounded-[32px] bg-[#374151] opacity-70 cursor-pointer"
                    target="_blank"
                    href="https://twitter.com/CouponFinance"
                    rel="noreferrer"
                  >
                    <XLogoSvg />
                    <div className="text-white text-base font-semibold">
                      Twitter
                    </div>
                  </a>
                  <a
                    className="flex items-center gap-3 p-2 pr-5 rounded-[32px] bg-[#374151] opacity-70 cursor-pointer"
                    target="_blank"
                    href="https://discord.gg/clober-coupon-finance"
                    rel="noreferrer"
                  >
                    <DiscordLogoSvg />
                    <div className="text-white text-base font-semibold">
                      Discord
                    </div>
                  </a>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="text-gray-700 text-center text-base font-semibold opacity-70">
                  If you have a position,
                  <br />
                  you can use the service.
                </div>
                <WalletSelectForComingSoon address={address} status={status} />
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-[700px] bg-[url('../public/iphone-14-pro-mockup.png')] bg-cover bg-center overflow-hidden">
          <div className="absolute bottom-8 left-[50%] -translate-x-2/4 flex gap-2">
            <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
              <div className="text-white text-base tracking-tight">Deposit</div>
            </div>
            <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
              <div className="text-white text-base tracking-tight">Borrow</div>
            </div>
            <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
              <div className="text-white text-base tracking-tight">Margin</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen h-auto pt-[69px] pb-[69px] pl-5 pr-5 hidden sm:block">
        <div className="flex gap-[132px] justify-center items-start overflow-hidden flex-wrap">
          <div className="mt-[31px] inline-flex flex-col items-start gap-16 shrink-0">
            <div className="flex justify-center items-center gap-[100px]">
              <CouponBlackSvg />
              <div className="flex px-[32px] py-[14px] justify-center items-center gap-2.5 border-[1.5px] border-gray-950 border-solid rounded-[40px] inline-flex">
                <div className="text-slate-800 text-base font-bold">
                  Coming soon
                </div>
              </div>
            </div>
            <div className="text-gray-900 text-[60px] font-bold leading-[80px]">
              Fixed term, Fixed rate
              <br />
              Lending protocol.
            </div>
            <div className="flex flex-col items-start gap-8">
              <div className="flex flex-col justify-center items-start gap-5">
                <div className="opacity-70 text-gray-700 text-base">
                  Stay tune for our update!
                </div>
                <div className="flex items-start gap-3">
                  <a
                    className="flex items-center gap-3 p-2 pr-5 rounded-[32px] bg-[#374151] opacity-70 cursor-pointer"
                    target="_blank"
                    href="https://twitter.com/CouponFinance"
                    rel="noreferrer"
                  >
                    <XLogoSvg />
                    <div className="text-white text-base font-semibold">
                      Twitter
                    </div>
                  </a>
                  <a
                    className="flex items-center gap-3 p-2 pr-5 rounded-[32px] bg-[#374151] opacity-70 cursor-pointer"
                    target="_blank"
                    href="https://discord.gg/clober-coupon-finance"
                    rel="noreferrer"
                  >
                    <DiscordLogoSvg />
                    <div className="text-white text-base font-semibold">
                      Discord
                    </div>
                  </a>
                </div>
              </div>
              <WalletSelectForComingSoon address={address} status={status} />
            </div>
          </div>
          <div className="relative w-[600px] h-[657px] bg-[url('../public/iphone-14-pro-mockup.png')] bg-cover bg-center overflow-hidden rounded-[32px] shrink-0">
            <div className="absolute bottom-[33px] left-[43px] flex gap-2">
              <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
                <div className="text-white text-base tracking-tight">
                  Deposit
                </div>
              </div>
              <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
                <div className="text-white text-base tracking-tight">
                  Borrow
                </div>
              </div>
              <div className="px-5 py-2 rounded-[50px] border-[1.5px] border-white border-solid justify-center">
                <div className="text-white text-base tracking-tight">
                  Margin
                </div>
              </div>
            </div>
            <div className="absolute top-[9px] right-[17px] text-gray-500 text-right text-base">
              The best lending solution.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
