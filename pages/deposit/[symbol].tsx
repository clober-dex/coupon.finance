import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'
import { useQuery } from 'wagmi'
import Link from 'next/link'
import Image from 'next/image'

import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchDepositApyByEpochsDeposited } from '../../apis/market'
import { DepositForm } from '../../components/form/deposit-form'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import { useChainContext } from '../../contexts/chain-context'

const Deposit = () => {
  const { selectedChain } = useChainContext()
  const { balances, prices, assets } = useCurrencyContext()
  const { deposit } = useDepositContext()

  const [epochs, _setEpochs] = useState(0)
  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const [value, setValue] = useState('')

  const router = useRouter()
  const asset = useMemo(() => {
    return (
      assets.find((asset) => asset.underlying.symbol === router.query.symbol) ||
      assets[0]
    )
  }, [assets, router.query.symbol])

  const [amount, maxDepositAmount] = useMemo(
    () => [
      parseUnits(value, asset.underlying.decimals ?? 18),
      balances[asset.underlying.address] ?? 0n,
    ],
    [asset.underlying.address, asset.underlying.decimals, balances, value],
  )

  const { data: proceedsByEpochsDeposited } = useQuery(
    ['deposit-simulate', asset, amount, selectedChain], // TODO: useDebounce
    () => fetchDepositApyByEpochsDeposited(selectedChain.id, asset, amount),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const [apy, proceed] = useMemo(() => {
    return epochs && proceedsByEpochsDeposited
      ? [
          proceedsByEpochsDeposited[epochs - 1].apy ?? 0,
          proceedsByEpochsDeposited[epochs - 1].proceeds ?? 0n,
        ]
      : [0, 0n]
  }, [epochs, proceedsByEpochsDeposited])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Deposit {asset?.underlying.symbol}</title>
      </Head>
      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-24 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Deposit
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={getLogo(asset.underlying)}
                    alt={asset.underlying.name}
                    fill
                  />
                </div>
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <DepositForm
              depositCurrency={asset.underlying}
              maxDepositAmount={maxDepositAmount}
              proceed={proceed}
              depositApy={apy}
              proceedsByEpochsDeposited={proceedsByEpochsDeposited}
              value={value}
              setValue={setValue}
              epochs={epochs}
              setEpochs={setEpochs}
              actionButtonProps={{
                disabled:
                  amount === 0n || epochs === 0 || amount > maxDepositAmount,
                onClick: async () => {
                  const hash = await deposit(asset, amount, epochs, proceed)
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
            />
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Deposit
