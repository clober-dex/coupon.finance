import React, { useMemo } from 'react'
import { useQuery } from 'wagmi'
import { getAddress, isAddressEqual } from 'viem'

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
import { fetchAaveBorrowApys } from '../apis/aave-borrow-apys'
import { MAX_VISIBLE_MARKETS } from '../utils/market'
import { currentTimestampInSeconds, formatDate } from '../utils/date'
import { calculateApy } from '../utils/apy'

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

  const { data: aaveBorrowApys } = useQuery(['borrow-apys'], async () => {
    return fetchAaveBorrowApys()
  })

  const borrowApys = useMemo(() => {
    const currentTimestamp = currentTimestampInSeconds()
    const _assetStatuses = assetStatuses
      .filter((assetStatus) => assetStatus.epoch.id === epochs[0].id)
      .filter((assetStatus) => assetStatus.totalBorrowAvailable !== 0n)
      .map((assetStatus) => {
        const assetStatusesByAsset = assetStatuses
          .filter(({ asset }) =>
            isAddressEqual(
              asset.underlying.address,
              assetStatus.asset.underlying.address,
            ),
          )
          .filter(({ epoch }) => Number(epoch.endTimestamp) > currentTimestamp)
          .slice(0, MAX_VISIBLE_MARKETS)
        const apys = assetStatusesByAsset.map(
          ({ epoch, totalBorrowAvailable }) => ({
            date: formatDate(new Date(Number(epoch.endTimestamp) * 1000)),
            apy:
              totalBorrowAvailable > 0n
                ? calculateApy(
                    assetStatusesByAsset
                      .filter(({ epoch: _epoch }) => _epoch.id <= epoch.id)
                      .reduce(
                        (acc, { bestCouponAskPrice }) =>
                          acc + bestCouponAskPrice,
                        0,
                      ),
                    epoch.endTimestamp - currentTimestamp,
                  )
                : Number.NaN,
          }),
        )
        return {
          ...assetStatus,
          lowestApy: Math.min(
            ...apys
              .filter(({ apy }) => !Number.isNaN(apy))
              .map(({ apy }) => apy),
          ),
        }
      })
    return _assetStatuses.reduce(
      (acc, { asset, lowestApy }) => ({
        ...acc,
        [getAddress(asset.underlying.address)]: lowestApy,
      }),
      {} as { [address: `0x${string}`]: number },
    )
  }, [assetStatuses, epochs])

  return (
    <div className="flex flex-1">
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
            multipleFactors={multipleFactors}
            pnls={pnls}
            removeCollateral={removeCollateral}
            minDebtSizeInEth={
              MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
            }
            borrowAPYs={borrowApys}
            aaveBorrowAPYs={
              aaveBorrowApys
                ? aaveBorrowApys.reduce(
                    (acc, cur) => ({
                      ...acc,
                      [cur.address]: cur.apy,
                    }),
                    {},
                  )
                : {}
            }
          />
        ) : selectedMode === 'farming' ? (
          <FarmingContainer />
        ) : (
          <></>
        )}
      </main>
    </div>
  )
}

export default Home
