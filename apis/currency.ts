import { createPublicClient, http, zeroAddress } from 'viem'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { CHAIN_IDS, CHAINS } from '../constants/chain'
import { Prices } from '../model/prices'
import { isEtherAddress } from '../contexts/currency-context'
import { Balances } from '../model/balances'
import { COUPON_ORACLE_ABI } from '../abis/core/coupon-oracle-abi'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'
import { PricePoint } from '../model/chart'
import { currentTimestampInSeconds } from '../utils/date'

import { fetchAssets } from './asset'

export async function fetchCurrencies(chainId: CHAIN_IDS) {
  const assets = await fetchAssets(chainId)
  return Object.values<Currency>(
    assets
      .reduce(
        (acc: Currency[], asset) => [
          ...acc,
          asset.underlying,
          ...asset.substitutes.map((substitute) => substitute),
          ...asset.collaterals.map((collateral) => collateral.underlying),
          ...asset.collaterals.map((collateral) => collateral.substitute),
        ],
        [],
      )
      .reduce((acc: { [key in `0x${string}`]: Currency }, currency) => {
        return {
          ...acc,
          [currency.address]: currency,
        }
      }, {}),
  )
}

export async function fetchPricePoints(
  currencyAddress: `0x${string}`,
  resolution: string,
  startTimestamp: number,
): Promise<PricePoint[]> {
  const now = currentTimestampInSeconds()
  const { t, c } = (await fetch(
    `https://api.dex.guru/v1/tradingview/history?symbol=${currencyAddress}-arbitrum_USD&resolution=${resolution}&from=${startTimestamp}&to=${now}`,
  ).then((res) => res.json())) as {
    t: number[]
    c: number[]
  }
  return t.map((timestamp, index) => ({
    timestamp: timestamp,
    value: c[index],
  }))
}

export async function fetchPrices(
  chainId: CHAIN_IDS,
  currencyAddresses: `0x${string}`[],
): Promise<Prices> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const [{ result: prices }, { result: decimals }] =
    await publicClient.multicall({
      contracts: [
        {
          address: CONTRACT_ADDRESSES[chainId].CouponOracle,
          abi: COUPON_ORACLE_ABI,
          functionName: 'getAssetsPrices',
          args: [currencyAddresses],
        },
        {
          address: CONTRACT_ADDRESSES[chainId].CouponOracle,
          abi: COUPON_ORACLE_ABI,
          functionName: 'decimals',
        },
      ],
    })

  if (!prices || !decimals) {
    return {}
  }

  return prices.reduce((acc, value, index) => {
    const currencyAddress = currencyAddresses[index]
    const newAcc = {
      ...acc,
      [currencyAddress]: { value, decimals },
    }
    if (isEtherAddress(currencyAddress)) {
      return {
        ...newAcc,
        [zeroAddress]: { value, decimals },
      }
    } else {
      return newAcc
    }
  }, {})
}

export async function fetchBalances(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
  currencyAddresses: `0x${string}`[],
): Promise<Balances> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const etherBalance = await publicClient.getBalance({ address: userAddress })
  const results = await publicClient.multicall({
    contracts: currencyAddresses.map((currencyAddress) => ({
      address: currencyAddress,
      abi: ERC20_PERMIT_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    })),
  })
  return results.reduce(
    (acc, { result }, index) => {
      const currencyAddress = currencyAddresses[index]
      return {
        ...acc,
        [currencyAddress]: isEtherAddress(currencyAddress)
          ? (result ?? 0n) + etherBalance
          : result,
      }
    },
    {
      [zeroAddress]: etherBalance,
    },
  )
}
