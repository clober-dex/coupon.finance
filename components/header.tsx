import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

import LogoSvg from './svg/logo-svg'
import LogotypeSvg from './svg/logotype-svg'
import TwitterSvg from './svg/twitter-svg'
import DiscordSvg from './svg/discord-svg'
import MenuSvg from './svg/menu-svg'
import ThemeToggle from './theme-toggle'

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className="fixed w-full flex justify-between items-center py-4 px-4 sm:px-8 bg-white bg-opacity-5 backdrop-blur">
      <div className="flex items-center gap-12">
        <Link href="/">
          <LogoSvg className="h-9 hidden sm:flex w-[232.52px]" />
          <LogotypeSvg className="h-4 sm:hidden w-[123.09px]" />
        </Link>
        <div className="hidden sm:flex items-center gap-8">
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
      <div className="flex gap-3 sm:gap-4 items-center">
        <div className="hidden sm:flex">
          <ThemeToggle />
        </div>
        <ConnectButton />
        <button className="flex sm:hidden" onClick={onMenuClick}>
          <MenuSvg />
        </button>
      </div>
    </div>
  )
}

export default Header
