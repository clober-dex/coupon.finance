import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import LogoSvg from '../components/svg/logo-svg'
import LogotypeSvg from '../components/svg/logotype-svg'
import ThemeToggle from '../components/theme-toggle'
import MenuSvg from '../components/svg/menu-svg'
import { WalletSelector } from '../components/wallet-selector'
import useDropdown from '../hooks/useDropdown'
import { CommunityDropdownModal } from '../components/community-dropdown-modal'

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
    <div className="w-full flex justify-between items-center py-4 px-4 sm:px-8 bg-white bg-opacity-5 backdrop-blur z-50">
      <div className="flex items-center gap-12">
        <Link href="/">
          <LogoSvg className="h-9 hidden sm:flex w-[232.52px]" />
          <LogotypeSvg className="h-4 sm:hidden w-[123.09px]" />
        </Link>
        <div className="flex items-center gap-8"></div>
        <div className="relative hidden sm:flex items-center gap-8 font-bold text-gray-400 hover:text-gray-500">
          <button
            onClick={() => {
              router.replace('/', undefined, { shallow: true })
            }}
            disabled={!router.query.mode || router.query.mode === 'earn'}
            className={`
            ${
              !router.query.mode || router.query.mode === 'earn'
                ? 'text-gray-950'
                : 'text-gray-400'
            }
          `}
          >
            Earn
          </button>
          <button
            onClick={() => {
              router.replace('/?mode=strategy', undefined, {
                shallow: true,
              })
            }}
            disabled={router.query.mode === 'strategy'}
            className={`
            ${
              router.query.mode === 'strategy'
                ? 'text-gray-950'
                : 'text-gray-400'
            }
          `}
          >
            Strategies
          </button>
          <button
            onClick={() => {
              setShowDropdown((prev) => !prev)
            }}
          >
            Community
          </button>
          {showDropdown ? <CommunityDropdownModal /> : <></>}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4 items-center">
        <div className="hidden sm:flex">
          <ThemeToggle setTheme={setTheme} />
        </div>
        <div className="inline-flex h-8 p-2 justify-center items-center gap-1 shrink-0 bg-white dark:bg-gray-400 rounded">
          <span>0</span>
          <span>pts</span>
        </div>
        <WalletSelector address={address} status={status} />
        <button className="flex sm:hidden" onClick={onMenuClick}>
          <MenuSvg />
        </button>
      </div>
    </div>
  )
}

export default HeaderContainer
