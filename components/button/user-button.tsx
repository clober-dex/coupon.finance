import React from 'react'

import { formatAddress } from '../../utils/string'
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
      className="flex items-center justify-center gap-2 md:justify-start w-8 rounded md:w-full py-0 px-3 cursor-pointer h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active::bg-gray-600 text-base"
      onClick={() => openAccountModal && openAccountModal()}
    >
      <UserIcon
        className="w-4 h-4 rounded-[100%] aspect-square"
        address={address}
      />
      <span className="hidden font-bold text-sm md:block">
        {formatAddress(address || '')}
      </span>
    </button>
  )
}
