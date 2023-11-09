import React, { useMemo } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import LogoSvg from '../components/svg/logo-svg'
import LogotypeSvg from '../components/svg/logotype-svg'
import ThemeToggleButton from '../components/button/theme-toggle-button'
import MenuSvg from '../components/svg/menu-svg'
import { WalletSelector } from '../components/selector/wallet-selector'
import { CommunityDropdownModal } from '../components/modal/community-dropdown-modal'
import { UserPointButton } from '../components/button/user-point-button'

const HeaderContainer = ({
  onMenuClick,
  setTheme,
}: {
  onMenuClick: () => void
  setTheme: (theme: 'light' | 'dark') => void
}) => {
  const { address, status } = useAccount()
  const router = useRouter()
  const selected = useMemo(() => {
    if (router.query.mode === 'deposit' || router.route.includes('deposit')) {
      return 'deposit'
    }
    if (router.query.mode === 'borrow' || router.route.includes('borrow')) {
      return 'borrow'
    }
    return 'deposit'
  }, [router.query.mode, router.route])
  return (
    <div className="fixed w-full flex justify-between items-center px-4 sm:px-8 bg-white bg-opacity-5 backdrop-blur z-50 h-16">
      <div className="flex h-full items-center gap-12 lg:gap-16">
        <Link href="/">
          <LogoSvg className="h-9 hidden sm:flex w-[232.52px]" />
          <LogotypeSvg className="h-4 sm:hidden w-[123.09px]" />
        </Link>
        <div className="h-full hidden md:flex items-center gap-8 font-bold text-gray-400 hover:text-gray-500">
          <button
            onClick={() => {
              router.replace('/', undefined, { shallow: true })
            }}
            disabled={selected === 'deposit'}
            className="h-full hover:text-gray-950 dark:hover:text-gray-100 disabled:text-gray-950 disabled:dark:text-white text-gray-400"
          >
            Earn
          </button>
          <button
            onClick={() => {
              router.replace('/?mode=borrow', undefined, {
                shallow: true,
              })
            }}
            disabled={selected === 'borrow'}
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
