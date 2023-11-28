import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { usePublicClient, useQuery } from 'wagmi'
import Link from 'next/link'

import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchDepositInfosByEpochsDeposited } from '../../apis/market'
import { DepositForm } from '../../components/form/deposit-form'
import BackSvg from '../../components/svg/back-svg'
import { useChainContext } from '../../contexts/chain-context'
import { RiskSidebar } from '../../components/bar/risk-sidebar'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { buildPendingPosition } from '../../model/bond-position'
import { parseUnits } from '../../utils/numbers'
import { HelperModalButton } from '../../components/button/helper-modal-button'
import OdosSwapModalContainer from '../../containers/modal/odos-swap-modal-container'

const Deposit = () => {
  const { selectedChain } = useChainContext()
  const publicClient = usePublicClient()
  const { balances, prices, assets } = useCurrencyContext()
  const { deposit } = useDepositContext()

  const [showHelperModal, setShowHelperModal] = useState(false)
  const [epochs, setEpochs] = useState(0)

  const [value, setValue] = useState('')

  const router = useRouter()
  const asset = useMemo(() => {
    return assets.find(
      (asset) => asset.underlying.symbol === router.query.symbol,
    )
  }, [assets, router.query.symbol])

  const [amount, maxDepositAmount] = useMemo(
    () => [
      parseUnits(value, asset ? asset.underlying.decimals : 18),
      asset ? balances[asset.underlying.address] ?? 0n : 0n,
    ],
    [asset, balances, value],
  )

  const { data: depositInfosByEpochsDeposited } = useQuery(
    ['deposit-simulate', asset, amount, selectedChain], // TODO: useDebounce
    () =>
      asset
        ? fetchDepositInfosByEpochsDeposited(selectedChain.id, asset, amount)
        : [],
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const [apy, proceed, remainingCoupons, endTimestamp] = useMemo(() => {
    return depositInfosByEpochsDeposited &&
      depositInfosByEpochsDeposited.length > 0
      ? [
          depositInfosByEpochsDeposited[epochs].apy ?? 0,
          depositInfosByEpochsDeposited[epochs].proceeds ?? 0n,
          depositInfosByEpochsDeposited[epochs].remainingCoupons ?? [],
          depositInfosByEpochsDeposited[epochs].endTimestamp,
        ]
      : [0, 0n, [], 0]
  }, [epochs, depositInfosByEpochsDeposited])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Deposit {asset?.underlying.symbol}</title>
      </Head>
      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full gap-6">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Deposit
              <div className="flex items-center gap-2">
                <CurrencyIcon
                  currency={asset.underlying}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              <DepositForm
                depositCurrency={asset.underlying}
                maxDepositAmount={maxDepositAmount}
                proceed={proceed}
                depositApy={apy}
                proceedsByEpochsDeposited={depositInfosByEpochsDeposited}
                remainingCoupons={remainingCoupons}
                value={value}
                setValue={setValue}
                epochs={epochs}
                setEpochs={setEpochs}
                actionButtonProps={{
                  disabled: amount === 0n || amount > maxDepositAmount,
                  onClick: async () => {
                    const { timestamp } = await publicClient.getBlock()
                    const hash = await deposit(
                      asset,
                      amount,
                      epochs + 1, // todo: absolute epoch index
                      proceed,
                      asset
                        ? buildPendingPosition(
                            asset.substitutes[0],
                            asset.underlying,
                            proceed,
                            amount,
                            endTimestamp,
                            Number(timestamp),
                          )
                        : undefined,
                    )
                    if (hash) {
                      await router.replace('/?mode=deposit')
                    }
                  },
                  text:
                    amount > maxDepositAmount
                      ? `Insufficient ${asset.underlying.symbol} balance`
                      : 'Deposit',
                }}
                depositAssetPrice={prices[asset.underlying.address]}
              >
                <HelperModalButton
                  onClick={() => {
                    setShowHelperModal(true)
                  }}
                  text={`Get more ${asset.underlying.symbol}`}
                  bounce={amount > maxDepositAmount}
                />
                {showHelperModal ? (
                  <OdosSwapModalContainer
                    onClose={() => setShowHelperModal(false)}
                    defaultOutputCurrency={asset.underlying}
                  />
                ) : (
                  <></>
                )}
              </DepositForm>
              <RiskSidebar
                chainExplorer={
                  selectedChain.blockExplorers?.default.url ??
                  'https://arbiscan.io'
                }
                asset={asset}
                prices={prices}
              />
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Deposit
