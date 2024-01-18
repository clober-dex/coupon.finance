import React from 'react'

import DepositStatus from '../components/status/deposit-status'
import BorrowStatus from '../components/status/borrow-status'
import { useCurrencyContext } from '../contexts/currency-context'
import { useModeContext } from '../contexts/mode-context'
import { useDepositContext } from '../contexts/deposit-context'
import { useBorrowContext } from '../contexts/borrow-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../constants/debt'
import { CHAIN_IDS } from '../constants/chain'
import { useChainContext } from '../contexts/chain-context'
import { FarmingContainer } from '../containers/farming-container'
import { AirdropContainer } from '../containers/airdrop-container'

const Home = () => {
  const { selectedChain } = useChainContext()
  const { assetStatuses, epochs, prices } = useCurrencyContext()
  const { selectedMode, onSelectedModeChange } = useModeContext()
  const { positions: bondPositions, collect } = useDepositContext()
  const {
    positions: loanPositions,
    multipleFactors,
    pnls,
    removeCollateral,
  } = useBorrowContext()

  return (
    <div className="flex flex-1">
      {selectedMode === 'farming' ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <FarmingContainer />
        </main>
      ) : selectedMode === 'airdrop' ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <AirdropContainer />
        </main>
      ) : (
        <>
          <div className="fixed w-full flex gap-2 sm:gap-16 items-end justify-center pb-1 bg-white dark:bg-gray-900 z-10 h-12 lg:hidden">
            <button
              onClick={() => onSelectedModeChange('deposit')}
              disabled={selectedMode === 'deposit'}
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
            >
              Earn
            </button>
            <button
              onClick={() => onSelectedModeChange('borrow')}
              disabled={selectedMode === 'borrow'}
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
            >
              Strategies
            </button>
          </div>

          <main className="flex flex-1 flex-col justify-center items-center pt-12 md:pt-0">
            {selectedMode === 'deposit' ? (
              <DepositStatus
                assetStatuses={assetStatuses}
                epochs={epochs}
                prices={prices}
                positions={bondPositions}
                collect={collect}
              />
            ) : selectedMode === 'borrow' ? (
              <BorrowStatus
                assetStatuses={assetStatuses}
                epochs={epochs}
                prices={prices}
                positions={loanPositions}
                multipleFactors={multipleFactors}pnls={pnls}
                removeCollateral={removeCollateral}
                minDebtSizeInEth={
                  MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
                }
              />
            ) : (
              <></>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default Home
