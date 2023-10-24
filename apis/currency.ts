import { readContracts } from '@wagmi/core'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory } from '../typechain'
import { BigDecimal } from '../utils/numbers'

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
  [key in `0x${string}`]: BigDecimal
}> {
  const [{ result: prices }, { result: decimals }] = await readContracts({
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

  if (!prices || !decimals) {
    return {}
  }

  return prices.reduce((acc, value, index) => {
    const currencyAddress = currencyAddresses[index]
    return {
      ...acc,
      [currencyAddress]: { value, decimals },
    }
  }, {})
}
