import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useThemeContext } from '../contexts/theme-context'

import LogoSvg from './svg/logo-svg'
import LightSvg from './svg/light-svg'
import DarkSvg from './svg/dark-svg'
import TwitterSvg from './svg/twitter-svg'
import DiscordSvg from './svg/discord-svg'

const Header = () => {
  const { setTheme } = useThemeContext()
  return (
    <div className="fixed w-full flex justify-between items-center py-4 px-8 bg-white bg-opacity-5">
      <div className="flex items-center gap-12">
        <LogoSvg className="h-9 w-fit" />
        <div className="flex items-center gap-8">
          <a
            target="_blank"
            href="https://twitter.com/CouponFinance"
            rel="noreferrer"
          >
            <TwitterSvg />
          </a>
          <a
            target="_blank"
            href="https://discord.com/invite/clober"
            rel="noreferrer"
          >
            <DiscordSvg />
          </a>
          <a
            className="text-sm font-bold text-gray-950 dark:text-white"
            target="_blank"
            href="https://docs.coupon.finance/"
            rel="noreferrer"
          >
            DOCS
          </a>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex rounded bg-gray-100 dark:bg-gray-800 w-16 h-8">
          <button
            className="flex flex-1 rounded items-center justify-center border-solid dark:border-none border-gray-950 border-[1.5px]"
            onClick={() => setTheme('light')}
          >
            <LightSvg />
          </button>
          <button
            className="flex flex-1 rounded items-center justify-center border-none dark:border-solid border-white border-[1.5px]"
            onClick={() => setTheme('dark')}
          >
            <DarkSvg />
          </button>
        </div>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
