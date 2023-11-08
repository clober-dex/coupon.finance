import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import LogoSvg from '../components/svg/logo-svg'
import LogotypeSvg from '../components/svg/logotype-svg'
import ThemeToggleButton from '../components/button/theme-toggle-button'
import MenuSvg from '../components/svg/menu-svg'
import { WalletSelector } from '../components/selector/wallet-selector'
import useDropdown from '../hooks/useDropdown'
import { CommunityDropdownModal } from '../components/modal/community-dropdown-modal'
import { UserPointButton } from '../components/button/user-point-button'

const HeaderContainer = ({
  onMenuClick,
  setTheme,
}: {
  onMenuClick: () => void
  setTheme: (theme: 'light' | 'dark') => void
}) => {
  const { showDropdown, setShowDropdown } = useDropdown()
  const { address, status } = useAccount()
  const router = useRouter()

  return (
    <div className="w-full flex justify-between items-center py-4 px-4 sm:px-8 bg-white bg-opacity-5 backdrop-blur z-5">
      <div className="flex items-center gap-12">
        <Link href="/">
          <LogoSvg className="h-9 hidden sm:flex w-[232.52px]" />
          <LogotypeSvg className="h-4 sm:hidden w-[123.09px]" />
        </Link>
        <div className="relative hidden sm:flex items-center gap-8 font-bold text-gray-400 hover:text-gray-500">
          <button
            onClick={() => {
              router.replace('/', undefined, { shallow: true })
            }}
            disabled={!router.query.mode || router.query.mode === 'deposit'}
            className="disabled:text-gray-950 disabled:dark:text-white text-gray-400"
          >
            Earn
          </button>
          <button
            onClick={() => {
              router.replace('/?mode=borrow', undefined, {
                shallow: true,
              })
            }}
            disabled={router.query.mode === 'borrow'}
            className="disabled:text-gray-950 disabled:dark:text-white text-gray-400"
          >
            Strategies
          </button>
          <button
            onClick={() => {
              setShowDropdown((prev) => !prev)
            }}
            className="hidden lg:flex"
          >
            Community
          </button>
          {showDropdown ? <CommunityDropdownModal /> : <></>}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4 items-center">
        <div className="hidden lg:flex">
          <ThemeToggleButton setTheme={setTheme} />
        </div>
        {address ? <UserPointButton score={0} /> : <></>}
        <WalletSelector address={address} status={status} />
        <button className="flex lg:hidden" onClick={onMenuClick}>
          <MenuSvg />
        </button>
      </div>
    </div>
  )
}

export default HeaderContainer
