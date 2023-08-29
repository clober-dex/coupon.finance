import { Currency } from '../model/currency'

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
