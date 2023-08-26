import { readContracts } from '@wagmi/core'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory } from '../typechain'

import { fetchCurrencies } from './currency'

export async function fetchPrices(): Promise<{
  [key in `0x${string}`]: number
}> {
  const currencyAddresses = (await fetchCurrencies()).map(
    (currency) => currency.address,
  )
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
  return prices && decimals
    ? prices.reduce((acc, val, i) => {
        const currencyAddress = currencyAddresses[i]
        return {
          ...acc,
          [currencyAddress]: Number(val) / 10 ** decimals,
        }
      }, {})
    : {}
}
