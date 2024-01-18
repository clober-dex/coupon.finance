import React from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { WalletIconSvg } from '../../components/svg/wallet-icon-svg'
import { ProtocolGMXSvg } from '../../components/svg/protocol-gmx-svg'
import { ProtocolAaveSvg } from '../../components/svg/protocol-aave-svg'
import { ProtocolPendleSvg } from '../../components/svg/protocol-pendle-svg'
import { ProtocolBlastSvg } from '../../components/svg/protocol-blast-svg'
import { ProtocolMantaSvg } from '../../components/svg/protocol-manta-svg'
import { NFTPudgyPenguinsSvg } from '../../components/svg/nft-pudgy-penguins-svg'
import { NFTLilPudgysSvg } from '../../components/svg/nft-lil-pudgys-svg'
import { NFTPudgyPresentSvg } from '../../components/svg/nft-pudgy-present-svg'

const DragonPointContainer = () => {
  const { openConnectModal } = useConnectModal()

  return (
    <main className="flex flex-1 flex-col justify-center items-center">
      <div className="w-full bg-white dark:bg-gray-850">
        <div className="flex flex-col m-auto w-full max-w-[960px] px-4 py-6 lg:py-20 gap-8">
          <div className="text-2xl font-bold lg:text-5xl lg:font-semibold lg:whitespace-nowrap flex justify-center">
            Have you ever used <br className="flex lg:hidden" /> lending
            protocol?
            <br />
            Them claim dragon point <br className="flex lg:hidden" /> and earn
            $CPN!
          </div>
          <div className="text-xs font-semibold text-gray-500 lg:text-base flex justify-center lg:justify-start">
            If you’ve ever used lending protocol or have NFT{' '}
            <br className="flex lg:hidden" /> written below, you can collect
            dragon point.
            <br />
            Let’s open the year of the dragon!
          </div>
        </div>
      </div>

      <div className="p-4 lg:py-16">
        <div className="bg-white rounded-xl dark:bg-gray-850 lg:w-[960px]">
          <div className="px-4 py-6 lg:py-12 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-center lg:mb-8">
              <div className="flex justify-center mb-4 lg:mb-0 lg:mr-8">
                <WalletIconSvg className="w-16 h-16 lg:w-20 lg:h-20" />
              </div>

              <div className="mb-8 text-center text-base font-semibold lg:text-2xl lg:text-left lg:mb-0">
                Connect your wallet to check
                <br />
                if you are eligible for dragon point!
              </div>
            </div>

            <button
              className="m-auto mb-8 max-w-[530px] lg:mb-12 flex justify-center items-center py-3 w-full h-12 rounded-lg bg-green-500 hover:bg-green-400 dark:hover:bg-green-600 disabled:bg-gray-800 text-white font-semibold disabled:text-green-500 text-base"
              onClick={() => openConnectModal && openConnectModal()}
            >
              Connect Wallet
            </button>

            <div className="flex flex-col gap-8 lg:gap-4">
              <div>
                <div className="mb-4 text-center text-sm font-bold lg:mb-6 lg:text-lg">
                  Eligible lending protocols
                </div>
                <div className="m-auto mb-4 grid grid-cols-2 gap-3 text-sm font-bold lg:flex max-w-3xl lg:flex-wrap lg:justify-center lg:text-xl lg:mb-12">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <ProtocolGMXSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>GMX</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <ProtocolAaveSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Aave</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <ProtocolPendleSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Pendle</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 text-center text-sm font-bold lg:mb-6 lg:text-lg">
                  Eligible L2 protocols
                </div>
                <div className="m-auto mb-4 grid grid-cols-2 gap-3 text-sm font-bold lg:flex max-w-3xl lg:flex-wrap lg:justify-center lg:text-xl lg:mb-12">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <ProtocolBlastSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Blast</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <ProtocolMantaSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Manta</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 text-center text-sm font-bold lg:mb-6 lg:text-lg">
                  Eligible NFTs
                </div>
                <div className="m-auto grid grid-cols-1 gap-3 text-sm font-bold lg:flex max-w-3xl lg:flex-wrap lg:justify-center lg:text-xl">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <NFTPudgyPenguinsSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Pudgy Penguins</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <NFTLilPudgysSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12" />
                    <span>Lil Pudgys</span>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800  px-3 py-2 rounded-xl gap-2 lg:px-4 lg:py-3 lg:gap-4">
                    <NFTPudgyPresentSvg className="w-8 h-8 rounded-full lg:w-12 lg:h-12 bg-white" />
                    <span>PudgyPresent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DragonPointContainer
