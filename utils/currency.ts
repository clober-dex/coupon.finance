import { Currency } from '../model/currency'

export const isEthereum = (currency: Currency) =>
  currency.name === 'Ethereum' &&
  currency.symbol === 'ETH' &&
  currency.decimals === 18
