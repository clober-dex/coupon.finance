import { readContracts } from '@wagmi/core'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory } from '../typechain'

import { fetchAssets } from './asset'

export async function fetchCurrencies() {
  const assets = await fetchAssets()
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

export async function fetchPrices(currencyAddresses: `0x${string}`[]): Promise<{
  prices: { [key in `0x${string}`]: number }
  rawPrices: { [key in `0x${string}`]: bigint }
}> {
  const [{ result }, { result: decimals }] = await readContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.CouponOracle,
        abi: CouponOracle__factory.abi,
        functionName: 'getAssetsPrices',
        args: [currencyAddresses],
      },
      {
        address: CONTRACT_ADDRESSES.CouponOracle,
        abi: CouponOracle__factory.abi,
        functionName: 'decimals',
      },
    ],
  })

  if (!result || !decimals) {
    return {
      prices: {},
      rawPrices: {},
    }
  }

  const rawPrices: { [key in `0x${string}`]: bigint } = result.reduce(
    (acc, val, i) => {
      const currencyAddress = currencyAddresses[i]
      return {
        ...acc,
        [currencyAddress]: val,
      }
    },
    {},
  )

  const prices = Object.fromEntries(
    Object.entries(rawPrices).map(([key, val]) => [
      key,
      Number(val) / 10 ** decimals,
    ]),
  )

  return {
    prices,
    rawPrices,
  }
}
