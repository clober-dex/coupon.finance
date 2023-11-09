import BigNumber from 'bignumber.js'

import { Currency } from '../model/currency'
import { Prices } from '../model/prices'
import { isEthereum } from '../contexts/currency-context'

import { dollarValue } from './numbers'

export const convertToETH = (
  currencies: Currency[],
  prices: Prices,
  inputCurrency: Currency | undefined,
  inputAmount: bigint,
): BigNumber => {
  if (!inputCurrency || !inputAmount) {
    return new BigNumber(0)
  }
  const wethCurrency = currencies.find((currency) => isEthereum(currency))
  if (!wethCurrency || inputCurrency.address === wethCurrency.address) {
    return new BigNumber(inputAmount.toString()).div(
      10 ** inputCurrency.decimals,
    )
  }
  return dollarValue(
    inputAmount,
    inputCurrency.decimals,
    prices[inputCurrency.address],
  ).div(
    dollarValue(
      10n ** BigInt(wethCurrency.decimals),
      wethCurrency.decimals,
      prices[wethCurrency.address],
    ),
  )
}
