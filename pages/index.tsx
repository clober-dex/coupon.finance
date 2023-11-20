import React from 'react'

import DepositContainer from '../containers/deposit-container'
import BorrowContainer from '../containers/borrow-container'
import { useCurrencyContext } from '../contexts/currency-context'
import { useModeContext } from '../contexts/mode-context'
import SwapContainer from '../containers/swap-container'

const Home = () => {
  const { assetStatuses, epochs } = useCurrencyContext()
  const { selectedMode, onSelectedModeChange } = useModeContext()

  return (
    <div className="flex flex-1">
      <div className="fixed w-full flex gap-16 items-end justify-center pb-1 bg-white dark:bg-gray-900 z-10 h-12 md:hidden">
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
          <DepositContainer assetStatuses={assetStatuses} epochs={epochs} />
        ) : selectedMode === 'borrow' ? (
          <BorrowContainer assetStatuses={assetStatuses} epochs={epochs} />
        ) : (
          <></>
        )}
      </main>
    </div>
  )
}

export default Home
