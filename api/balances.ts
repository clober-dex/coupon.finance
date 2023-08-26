import { readContracts } from '@wagmi/core'

import { IERC20__factory } from '../typechain'
import { isEthereum } from '../utils/currency'

import { fetchCurrencies } from './currency'

export async function fetchBalances(
  userAddress?: `0x${string}` | null,
  ethBalance: bigint = 0n,
): Promise<{ [currency in `0x${string}`]: string }> {
  if (!userAddress) {
    return {}
  }

  const currencies = await fetchCurrencies()
  const results = await readContracts({
    contracts: currencies.map((currency) => ({
      address: currency.address,
      abi: IERC20__factory.abi,
      functionName: 'balanceOf',
      args: [userAddress],
    })),
  })
  const balanceMap: { [currency in `0x${string}`]: bigint } = results.reduce(
    (acc, { result }, i) => {
      const currency = currencies[i]
      return {
        ...acc,
        [currency.address]: isEthereum(currency)
          ? (result ?? 0n) + (ethBalance ?? 0n)
          : result,
      }
    },
    {},
  )

  return Object.fromEntries(
    Object.entries(balanceMap).map(([currency, value]) => [
      currency,
      value.toString(),
    ]),
  )
}
