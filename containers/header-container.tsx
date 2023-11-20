import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import LogoSvg from '../components/svg/logo-svg'
import LogotypeSvg from '../components/svg/logotype-svg'
import ThemeToggleButton from '../components/button/theme-toggle-button'
import MenuSvg from '../components/svg/menu-svg'
import { WalletSelector } from '../components/selector/wallet-selector'
import { CommunityDropdownModal } from '../components/modal/community-dropdown-modal'
import { UserPointButton } from '../components/button/user-point-button'
import { ZIndices } from '../utils/z-indices'
import { useModeContext } from '../contexts/mode-context'
import { useCurrencyContext } from '../contexts/currency-context'
import { SwapButton } from '../components/button/swap-button'

const HeaderContainer = ({
  onMenuClick,
  setTheme,
}: {
  onMenuClick: () => void
  setTheme: (theme: 'light' | 'dark') => void
}) => {
  const { address, status } = useAccount()
  const { point } = useCurrencyContext()
  const { selectedMode, onSelectedModeChange } = useModeContext()
  return (
    <div
      className={`fixed w-full flex flex-col justify-between items-center px-4 md:px-8 bg-white dark:bg-gray-900 md:dark:bg-transparent md:bg-opacity-5 md:backdrop-blur ${ZIndices.modal} h-12 md:h-16`}
    >
      <div className="flex w-full justify-between items-center h-12 md:h-full">
        <div className="flex h-full items-center gap-6 lg:gap-16">
          <Link href="/">
            <LogoSvg className="h-9 hidden md:flex w-[232.52px]" />
            <LogotypeSvg className="h-4 md:hidden w-[123.09px]" />
          </Link>
          <div className="h-full hidden md:flex items-center gap-6 lg:gap-8 font-bold text-gray-400 hover:text-gray-500">
            <button
              onClick={() => onSelectedModeChange('deposit')}
              disabled={selectedMode === 'deposit'}
              className="h-full hover:text-gray-950 dark:hover:text-gray-100 disabled:text-gray-950 disabled:dark:text-white text-gray-400"
            >
              Earn
            </button>
            <button
              onClick={() => onSelectedModeChange('borrow')}
              disabled={selectedMode === 'borrow'}
              className="h-full hover:text-gray-950 dark:hover:text-gray-100 disabled:text-gray-950 disabled:dark:text-white text-gray-400"
            >
              Strategies
            </button>
            <button className="relative h-full items-center text-gray-400 group dark:hover:text-gray-100 hover:text-gray-950 hidden lg:flex">
              Community
              <div className="hidden group-hover:flex">
                <CommunityDropdownModal />
              </div>
            </button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="hidden lg:flex">
            <ThemeToggleButton setTheme={setTheme} />
          </div>
          {address ? <UserPointButton score={Number(point)} /> : <></>}
          <SwapButton openSwapModal={() => {}} />
          <WalletSelector address={address} status={status} />
          <button
            className="w-8 h-8 hover:bg-gray-100 md:hover:bg-gray-200 dark:hover:bg-gray-700 rounded sm:rounded-lg flex items-center justify-center lg:hidden "
            onClick={onMenuClick}
          >
            <MenuSvg />
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeaderContainer
