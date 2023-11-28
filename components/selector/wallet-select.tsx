import React from 'react'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'

import { ConnectButton } from '../button/connect-button'
import { UserButton } from '../button/user-button'
import { WrongNetworkButton } from '../button/wrong-network-button'

export function WalletSelect({
  address,
  status,
}: {
  address: `0x${string}` | undefined
  status: 'connected' | 'disconnected' | 'reconnecting' | 'connecting'
}) {
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  return (
    <div className="flex items-center">
      {status === 'disconnected' ? (
        <ConnectButton openConnectModal={openConnectModal} />
      ) : openAccountModal && address ? (
        <UserButton address={address} openAccountModal={openAccountModal} />
      ) : openChainModal ? (
        <WrongNetworkButton openChainModal={openChainModal} />
      ) : (
        <button
          disabled={true}
          className="flex items-center justify-center rounded-lg py-0 px-3 text-green-500 h-8 bg-gray-100 dark:bg-gray-800 text-base"
        >
          {status}
        </button>
      )}
    </div>
  )
}
