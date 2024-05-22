import React from 'react'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'

import UserIcon from '../icon/user-icon'
import { formatAddress } from '../../utils/string'
import { TriangleDownSvg } from '../svg/triangle-down-svg'

export function WalletSelectForComingSoon({
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
        <button
          className="flex px-12 py-4 justify-center items-center gap-2 text-white text-base font-semibold rounded-[32px] bg-green-500"
          onClick={() => openConnectModal && openConnectModal()}
        >
          Connect Wallet
        </button>
      ) : openAccountModal && address ? (
        <button
          className="flex px-12 py-4 justify-center items-center gap-2 text-white text-base font-semibold rounded-[32px] bg-gray-700 opacity-70"
          onClick={() => openAccountModal && openAccountModal()}
        >
          <UserIcon
            className="w-4 h-4 rounded-[100%] aspect-square"
            address={address}
          />
          {formatAddress(address || '')}
        </button>
      ) : openChainModal ? (
        <button
          className="flex px-12 py-4 justify-center items-center gap-2 text-white text-base font-semibold rounded-[32px] bg-gray-700 opacity-70"
          onClick={() => openChainModal && openChainModal()}
        >
          <span className="text-red-500 inline-block">Wrong Network</span>
          <TriangleDownSvg className="fill-red-500" />
        </button>
      ) : (
        <button
          disabled={true}
          className="flex px-12 py-4 justify-center items-center gap-2 text-white text-base font-semibold rounded-[32px] bg-green-500"
        >
          {status}
        </button>
      )}
    </div>
  )
}
