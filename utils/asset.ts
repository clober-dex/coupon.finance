import { isAddressEqual } from 'viem'

import { Currency } from '../model/currency'

export const adjustCurrencySymbol = (currency: Currency) => {
  if (
    isAddressEqual(
      currency.address,
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    )
  ) {
    return 'USDC.e'
  }
  return currency.symbol
}

export const adjustCurrencyName = (currency: Currency) => {
  if (
    isAddressEqual(
      currency.address,
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    )
  ) {
    return 'Bridged USDC'
  }
  return currency.name
}
