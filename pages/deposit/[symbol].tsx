import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'
import { useQuery } from 'wagmi'
import Link from 'next/link'
import Image from 'next/image'

import { useDepositContext } from '../../contexts/deposit-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import {
  fetchDepositApyByEpochsDeposited,
  fetchRemainingCouponsByEpochsDeposited,
} from '../../apis/market'
import { DepositForm } from '../../components/form/deposit-form'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import { useChainContext } from '../../contexts/chain-context'
import { RiskSidebar } from '../../components/risk-sidebar'
import { Collateral } from '../../model/collateral'
import { BigDecimal } from '../../utils/numbers'

const dummyCollateralRiskInfos = [
  {
    collateral: {
      underlying: {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      substitute: {
        address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
        name: 'Wrapped Aave Wrapped BTC',
        symbol: 'WaWBTC',
        decimals: 8,
      },
      liquidationThreshold: 800000n,
      liquidationTargetLtv: 700000n,
      ltvPrecision: 1000000n,
    },
    collateralPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    collateralized: 123000000n,
    borrowing: 23000000n,
  },
  {
    collateral: {
      underlying: {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      substitute: {
        address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
        name: 'Wrapped Aave Wrapped BTC',
        symbol: 'WaWBTC',
        decimals: 8,
      },
      liquidationThreshold: 800000n,
      liquidationTargetLtv: 700000n,
      ltvPrecision: 1000000n,
    },
    collateralPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    collateralized: 123000000n,
    borrowing: 23000000n,
  },
] as {
  collateral: Collateral
  collateralPrice: BigDecimal
  collateralized: bigint
  borrowing: bigint
}[]

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
  const [showRiskSidebar, setShowRiskSidebar] = useState(false)

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
    ['deposit-apy-simulate', asset, amount, selectedChain], // TODO: useDebounce
    () => fetchDepositApyByEpochsDeposited(selectedChain.id, asset, amount),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const { data: remainingCoupons } = useQuery(
    ['deposit-remaining-coupons-simulate', asset, amount, selectedChain],
    () =>
      fetchRemainingCouponsByEpochsDeposited(selectedChain.id, asset, amount),
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
          <div className="flex flex-1 flex-col w-full gap-6">
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
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4">
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
                showRiskSidebar={showRiskSidebar}
                setShowRiskSidebar={setShowRiskSidebar}
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
              <RiskSidebar
                collateralRiskInfos={dummyCollateralRiskInfos}
                showRiskSidebar={showRiskSidebar}
                setShowRiskSidebar={setShowRiskSidebar}
                className={
                  showRiskSidebar
                    ? 'lg:opacity-100 transition-all duration-700'
                    : 'lg:w-0 lg:opacity-0 duration-700'
                }
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
