import { isAddressEqual } from 'viem'

import { Currency } from '../model/currency'

export const WETH_ADDRESS = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
export const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'

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
