import { readContracts } from '@wagmi/core'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { IERC20__factory } from '../typechain'
import { isEthereum } from '../utils/currency'

import { fetchCurrencies } from './currency'

export async function fetchAllowances(
  userAddress?: `0x${string}`,
  ethBalance: bigint = 0n,
): Promise<{
  [spender in `0x${string}`]: { [currency in `0x${string}`]: string }
}> {
  if (!userAddress) {
    return {}
  }

  const currencies = await fetchCurrencies()
  const spenders = [
    CONTRACT_ADDRESSES.BorrowController,
    CONTRACT_ADDRESSES.DepositController,
    CONTRACT_ADDRESSES.OdosRepayAdapter,
  ]
  const contracts = spenders
    .map((spender) => {
      return currencies.map((currency) => ({
        address: currency.address,
        abi: IERC20__factory.abi,
        functionName: 'allowance',
        args: [userAddress, spender],
      }))
    }, [])
    .flat()
  const results = await readContracts({
    contracts,
  })
  const allowanceMap: {
    [spender in `0x${string}`]: { [currency in `0x${string}`]: bigint }
  } =
    results.reduce(
      (
        acc: {
          [spender in `0x${string}`]: { [currency in `0x${string}`]: bigint }
        },
        { result },
        i,
      ) => {
        const currency = currencies[i % currencies.length]
        const spender = spenders[Math.floor(i / currencies.length)]
        const resultValue = (result ?? 0n) as bigint
        return {
          ...acc,
          [spender]: {
            ...acc[spender],
            [currency.address]: isEthereum(currency)
              ? resultValue + (ethBalance ?? 0n)
              : resultValue,
          },
        }
      },
      spenders.reduce((acc, spender) => ({ ...acc, [spender]: {} }), {}),
    ) || {}

  return Object.fromEntries(
    Object.entries(allowanceMap).map(([spender, currencyMap]) => [
      spender,
      Object.fromEntries(
        Object.entries(currencyMap).map(([currency, value]) => [
          currency,
          value.toString(),
        ]),
      ),
    ]),
  )
}
