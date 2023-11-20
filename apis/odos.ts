import { getAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { CHAIN_IDS } from '../constants/chain'
import { Currency } from '../model/currency'
import { Prices } from '../model/prices'
import { Balances } from '../model/balances'
import { PathViz } from '../model/pathviz'

export async function fetchOdosApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_ODOS_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_ODOS_API_BASE_URL}/${path}`
    : `https://api.odos.xyz/${path}`
  const response = await fetch(endpoint, options)

  if (response.ok) {
    return response.json()
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}

export async function fetchCurrenciesByOdos({
  chainId,
}: {
  chainId: CHAIN_IDS
}): Promise<Currency[]> {
  return Object.entries(
    (
      await fetchOdosApi<{
        tokenMap: Currency[]
      }>(`info/tokens/${chainId}`)
    ).tokenMap,
  ).map(([address, currency]) => ({
    address: getAddress(address),
    name: currency.name,
    symbol: currency.symbol,
    decimals: currency.decimals,
  }))
}

export async function fetchPricesByOdos({
  chainId,
}: {
  chainId: CHAIN_IDS
}): Promise<Prices> {
  return Object.entries(
    (
      await fetchOdosApi<{
        tokenPrices: { [key in `0x${string}`]: number }
      }>(`pricing/token/${chainId}`)
    ).tokenPrices,
  ).reduce((acc, [address, price]) => {
    acc[getAddress(address)] = {
      value: BigInt(new BigNumber(10).pow(8).times(price).toFixed(0)),
      decimals: 8,
    }
    return acc
  }, {} as Prices)
}

export async function fetchBalancesByOdos({
  chainId,
  userAddress,
}: {
  chainId: CHAIN_IDS
  userAddress: `0x${string}`
}): Promise<Balances> {
  return Object.values(
    (
      await fetchOdosApi<{
        balances: { address: string; balance: string }[]
      }>(`balances/${userAddress}/${chainId}`)
    ).balances,
  ).reduce((acc, { address, balance }) => {
    return {
      ...acc,
      [getAddress(address)]: BigInt(balance),
    }
  }, {} as Balances)
}

export async function fetchCallDataByOdos({
  pathId,
  userAddress,
}: {
  pathId: string
  userAddress: string
}): Promise<`0x${string}`> {
  const { transaction } = await fetchOdosApi<{
    transaction: {
      data: `0x${string}`
    }
  }>('sor/assemble', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      pathId,
      simulate: true,
      userAddr: userAddress,
    }),
  })
  return transaction.data
}

export async function fetchAmountOutByOdos({
  chainId,
  amountIn,
  tokenIn,
  tokenOut,
  slippageLimitPercent,
  userAddress,
  gasPrice,
}: {
  chainId: CHAIN_IDS
  amountIn: string
  tokenIn: string
  tokenOut: string
  slippageLimitPercent: number
  userAddress: string
  gasPrice: number
}): Promise<{
  amountOut: bigint
  gasLimit: bigint
  pathViz: PathViz | undefined
  pathId: string
}> {
  const result: {
    outAmounts: string[]
    pathViz: PathViz
    pathId: string
    gasEstimate: number
  } = await fetchOdosApi('sor/quote/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      chainId,
      inputTokens: [
        {
          tokenAddress: tokenIn,
          amount: amountIn,
        },
      ],
      outputTokens: [
        {
          tokenAddress: tokenOut,
          proportion: 1,
        },
      ],
      gasPrice: gasPrice / 1e9,
      userAddr: userAddress,
      slippageLimitPercent,
      sourceBlacklist: [],
      pathViz: false,
    }),
  })
  return {
    amountOut: BigInt(result.outAmounts[0]),
    gasLimit: BigInt(result.gasEstimate),
    pathViz: result.pathViz,
    pathId: result.pathId,
  }
}
