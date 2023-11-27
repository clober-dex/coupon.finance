import React, { useCallback } from 'react'
import { usePublicClient, useQueryClient, useWalletClient } from 'wagmi'
import { zeroAddress } from 'viem'

import { Currency } from '../model/currency'
import { formatUnits, toPlacesString } from '../utils/numbers'
import { writeContract } from '../utils/wallet'
import { approve20 } from '../utils/approve20'
import { toWrapETH } from '../utils/currency'
import { WETH_ABI } from '../abis/external/weth-abi'
import { SUBSTITUTE_ABI } from '../abis/periphery/substitute-abi'
import { CouponBalance } from '../model/coupon-balance'
import { permit1155 } from '../utils/permit1155'
import { getDeadlineTimestampInSeconds } from '../utils/date'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { CHAIN_IDS } from '../constants/chain'
import { COUPON_MARKET_ROUTER_ABI } from '../abis/periphery/coupon-market-router-abi'
import { ETH_SUBSTITUTE_MINTER_ABI } from '../abis/periphery/eth-substitute-minter-abi'
import { dummyPermit20Params } from '../utils/permit20'

import { useTransactionContext } from './transaction-context'
import { isEther, useCurrencyContext } from './currency-context'
import { useChainContext } from './chain-context'

type AdvancedContractContext = {
  wrap: (currency: Currency, amount: bigint) => Promise<void>
  unwrap: (currency: Currency, amount: bigint) => Promise<void>
  mintSubstitute: (
    underlying: Currency,
    substitute: Currency,
    amount: bigint,
  ) => Promise<void>
  burnSubstitute: (
    substitute: Currency,
    underlying: Currency,
    amount: bigint,
  ) => Promise<void>
  mintCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
  burnCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
  sellCoupons: (couponBalances: CouponBalance[]) => Promise<void>
}

const Context = React.createContext<AdvancedContractContext>({
  wrap: () => Promise.resolve(),
  unwrap: () => Promise.resolve(),
  mintSubstitute: () => Promise.resolve(),
  burnSubstitute: () => Promise.resolve(),
  mintCoupon: () => Promise.resolve(),
  burnCoupon: () => Promise.resolve(),
  sellCoupons: () => Promise.resolve(),
})

export const AdvancedContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const { assets, prices, calculateETHValue } = useCurrencyContext()
  const { selectedChain } = useChainContext()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()

  const wrap = useCallback(
    async (currency: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Wrap',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: {
                ...selectedChain.nativeCurrency,
                address: zeroAddress,
              },
              label: selectedChain.nativeCurrency.symbol,
              value: formatUnits(
                amount,
                selectedChain.nativeCurrency.decimals,
                prices[currency.address],
              ),
            },
            {
              direction: 'out',
              currency: currency,
              label: currency.symbol,
              value: formatUnits(
                amount,
                currency.decimals,
                prices[currency.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: currency.address,
          abi: WETH_ABI,
          functionName: 'deposit',
          args: [],
          account: walletClient.account,
          value: amount,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.nativeCurrency,
      setConfirmation,
      walletClient,
    ],
  )

  const unwrap = useCallback(
    async (currency: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Unwrap',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency,
              label: currency.symbol,
              value: formatUnits(
                amount,
                currency.decimals,
                prices[currency.address],
              ),
            },
            {
              direction: 'out',
              currency: {
                ...selectedChain.nativeCurrency,
                address: zeroAddress,
              },
              label: selectedChain.nativeCurrency.symbol,
              value: formatUnits(
                amount,
                currency.decimals,
                prices[currency.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: currency.address,
          abi: WETH_ABI,
          functionName: 'withdraw',
          args: [amount],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.nativeCurrency,
      setConfirmation,
      walletClient,
    ],
  )

  const mintSubstitute = useCallback(
    async (underlying: Currency, substitute: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const ethValue = calculateETHValue(underlying, amount)
        const permitAmount = amount - ethValue
        await approve20(
          selectedChain.id,
          walletClient,
          underlying,
          walletClient.account.address,
          isEther(underlying)
            ? CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                .EthSubstituteMinter
            : substitute.address,
          permitAmount,
        )
        setConfirmation({
          title: 'Minting Substitute',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: toWrapETH(underlying),
              label: toWrapETH(underlying).symbol,
              value: formatUnits(
                permitAmount,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
            {
              direction: 'in',
              currency: {
                address: zeroAddress,
                ...selectedChain.nativeCurrency,
              },
              label: selectedChain.nativeCurrency.symbol,
              value: formatUnits(
                ethValue,
                selectedChain.nativeCurrency.decimals,
                prices[underlying.address],
              ),
            },
            {
              direction: 'out',
              currency: substitute,
              label: substitute.symbol,
              value: formatUnits(
                amount,
                substitute.decimals,
                prices[substitute.address],
              ),
            },
          ],
        })
        if (isEther(underlying)) {
          await writeContract(publicClient, walletClient, {
            address:
              CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                .EthSubstituteMinter,
            abi: ETH_SUBSTITUTE_MINTER_ABI,
            functionName: 'mint',
            args: [
              dummyPermit20Params,
              substitute.address,
              amount,
              walletClient.account.address,
            ],
            account: walletClient.account,
            value: ethValue,
          })
        } else {
          await writeContract(publicClient, walletClient, {
            address: substitute.address,
            abi: SUBSTITUTE_ABI,
            functionName: 'mint',
            args: [amount, walletClient.account.address],
            account: walletClient.account,
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      calculateETHValue,
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      selectedChain.nativeCurrency,
      setConfirmation,
      walletClient,
    ],
  )

  const burnSubstitute = useCallback(
    async (substitute: Currency, underlying: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Burning Substitute',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: substitute,
              label: substitute.symbol,
              value: formatUnits(
                amount,
                substitute.decimals,
                prices[substitute.address],
              ),
            },
            {
              direction: 'out',
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(
                amount,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: substitute.address,
          abi: SUBSTITUTE_ABI,
          functionName: 'burn',
          args: [amount, walletClient.account.address],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [prices, publicClient, queryClient, setConfirmation, walletClient],
  )

  const mintCoupon = useCallback(async () => {
    if (!walletClient) {
      // TODO: alert wallet connect
      return
    }

    try {
      console.log('minting coupon')
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries(['balances']),
        queryClient.invalidateQueries(['coupons']),
      ])
      setConfirmation(undefined)
    }
  }, [queryClient, setConfirmation, walletClient])

  const burnCoupon = useCallback(async () => {
    if (!walletClient) {
      // TODO: alert wallet connect
      return
    }

    try {
      console.log('burning coupon')
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries(['balances']),
        queryClient.invalidateQueries(['coupons']),
      ])
      setConfirmation(undefined)
    }
  }, [queryClient, setConfirmation, walletClient])

  const sellCoupons = useCallback(
    async (couponBalances: CouponBalance[]) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        // erc20 approve
        for (const { market, erc20Balance } of couponBalances) {
          if (erc20Balance > 0n) {
            setConfirmation({
              title: `Approving ${market.baseToken.symbol}`,
              body: 'Please confirm in your wallet.',
              fields: [
                {
                  currency: market.baseToken,
                  label: market.baseToken.symbol,
                  value: toPlacesString(
                    formatUnits(erc20Balance, market.baseToken.decimals),
                  ),
                },
              ],
            })
            await approve20(
              selectedChain.id,
              walletClient,
              market.baseToken,
              walletClient.account.address,
              CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                .CouponMarketRouter,
              erc20Balance,
            )
          }
        }

        const deadline = getDeadlineTimestampInSeconds()
        const { v, r, s } = await permit1155(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].CouponManager,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].CouponMarketRouter,
          deadline,
        )
        setConfirmation({
          title: `Selling Coupons`,
          body: 'Please confirm in your wallet.',
          fields: [
            ...couponBalances.map(({ balance, market }) => ({
              direction: 'out',
              currency: market.baseToken,
              label: market.baseToken.symbol,
              value: toPlacesString(
                formatUnits(balance, market.baseToken.decimals),
              ),
            })),
            ...couponBalances.map(({ assetValue, market }) => {
              const asset = assets.find(({ underlying }) =>
                market.quoteToken.symbol.includes(underlying.symbol),
              )
              if (!asset) {
                return
              }
              return {
                direction: 'in',
                currency: asset.underlying,
                label: asset.underlying.symbol,
                value: toPlacesString(
                  formatUnits(
                    assetValue,
                    asset.underlying.decimals,
                    prices[asset.underlying.address],
                  ),
                ),
              }
            }),
          ] as {
            direction: 'in' | 'out'
            currency: Currency
            label: string
            value: string
          }[],
        })

        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
              .CouponMarketRouter,
          abi: COUPON_MARKET_ROUTER_ABI,
          functionName: 'batchMarketSellCoupons',
          args: [
            couponBalances.map(({ market, balance }) => {
              return {
                market: market.address,
                deadline,
                limitPriceIndex: 0n,
                recipient: walletClient.account.address,
                minRawAmount: 0n,
                couponKey: {
                  asset: market.quoteToken.address,
                  epoch: market.epoch,
                },
                amount: balance,
              }
            }),
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries(['balances']),
          queryClient.invalidateQueries(['coupons']),
        ])
        setConfirmation(undefined)
      }
    },
    [
      assets,
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        wrap,
        unwrap,
        mintSubstitute,
        burnSubstitute,
        mintCoupon,
        burnCoupon,
        sellCoupons,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAdvancedContractContext = () =>
  React.useContext(Context) as AdvancedContractContext
