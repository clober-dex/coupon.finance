import React from 'react'

import { formatAddress, formatShortAddress } from '../../utils/string'
import UserIcon from '../icon/user-icon'

export const UserButton = ({
  address,
  openAccountModal,
}: {
  address: `0x${string}`
  openAccountModal: () => void
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 md:justify-start w-8 rounded-lg sm:w-full py-0 px-3 cursor-pointer h-8 bg-gray-50 md:bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active::bg-gray-600 text-base"
      onClick={() => openAccountModal && openAccountModal()}
    >
      <UserIcon
        className="w-4 h-4 rounded-[100%] aspect-square"
        address={address}
      />
      <span className="hidden font-semibold text-sm sm:block lg:hidden">
        {formatShortAddress(address || '')}
      </span>
      <span className="hidden font-semibold text-sm lg:block">
        {formatAddress(address || '')}
      </span>
    </button>
  )
}
