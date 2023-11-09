import React from 'react'

export const ConnectButton = ({
  openConnectModal,
}: {
  openConnectModal?: () => void
}) => {
  return (
    <button
      className="flex items-center py-0 px-3 md:px-4 h-8 rounded-lg bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 disabled:bg-gray-800 text-white font-semibold disabled:text-green-500 text-xs sm:text-sm"
      onClick={() => openConnectModal && openConnectModal()}
    >
      Connect<span className="hidden md:block md:ml-1">Wallet</span>
    </button>
  )
}
