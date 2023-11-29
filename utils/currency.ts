import BigNumber from 'bignumber.js'

import { Currency } from '../model/currency'
import { isEther } from '../contexts/currency-context'

import { BigDecimal, dollarValue } from './numbers'

export const ethValue = (
  ethPrice: BigDecimal,
  inputCurrency: Currency | undefined,
  inputAmount: bigint,
  inputPrice: BigDecimal,
  nativeCurrencyDecimals: number = 18,
): BigNumber => {
  if (!inputCurrency || !inputAmount) {
    return new BigNumber(0)
  }
  if (isEther(inputCurrency)) {
    return new BigNumber(inputAmount.toString()).div(
      10 ** inputCurrency.decimals,
    )
  }
  return dollarValue(inputAmount, inputCurrency.decimals, inputPrice).div(
    dollarValue(
      10n ** BigInt(nativeCurrencyDecimals),
      nativeCurrencyDecimals,
      ethPrice,
    ),
  )
}

export const toWrapETH = (currency: Currency): Currency =>
  isEther(currency)
    ? { ...currency, name: 'Wrapped Ether', symbol: 'WETH' }
    : currency
