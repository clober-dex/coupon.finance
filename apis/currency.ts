import { createPublicClient, http, zeroAddress } from 'viem'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'
import { CHAIN_IDS, CHAINS } from '../constants/chain'
import { Prices } from '../model/prices'
import { isEtherAddress } from '../contexts/currency-context'
import { Balances } from '../model/balances'

import { fetchAssets } from './asset'

export async function fetchCurrencies(chainId: CHAIN_IDS) {
  const assets = await fetchAssets(chainId)
  return Object.values<Currency>(
    assets
      .reduce(
        (acc: Currency[], asset) => [
          ...acc,
          asset.underlying,
          ...asset.collaterals.map((collateral) => collateral.underlying),
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
          abi: CouponOracle__factory.abi,
          functionName: 'getAssetsPrices',
          args: [currencyAddresses],
        },
        {
          address: CONTRACT_ADDRESSES[chainId].CouponOracle,
          abi: CouponOracle__factory.abi,
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
  etherBalance: bigint,
  currencyAddresses: `0x${string}`[],
): Promise<Balances> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const results = await publicClient.multicall({
    contracts: currencyAddresses.map((currencyAddress) => ({
      address: currencyAddress,
      abi: IERC20__factory.abi,
      functionName: 'balanceOf',
      args: [userAddress],
    })),
  })
  return results.reduce((acc, { result }, index) => {
    const currencyAddress = currencyAddresses[index]
    return {
      ...acc,
      [currencyAddress]: isEtherAddress(currencyAddress)
        ? (result ?? 0n) + etherBalance
        : result,
    }
  }, {})
}
