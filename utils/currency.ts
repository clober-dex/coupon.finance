import BigNumber from 'bignumber.js'

import { Currency } from '../model/currency'
import { Prices } from '../model/prices'
import { CHAIN_IDS } from '../constants/chain'
import { ETH_CURRENCY } from '../constants/currency'

import { dollarValue } from './numbers'

export const convertToETH = (
  chainId: CHAIN_IDS,
  prices: Prices,
  inputCurrency: Currency,
  inputAmount: bigint,
): BigNumber => {
  if (!inputAmount) {
    return new BigNumber(0)
  }
  const wethCurrency = ETH_CURRENCY[chainId]
  if (inputCurrency.address === wethCurrency.address) {
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
