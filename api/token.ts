import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Currency } from '../utils/currency'

const { Tokens } = getBuiltGraphSDK()

export async function fetchTokens(): Promise<Currency[]> {
  const { tokens } = await Tokens()

  return tokens.map((token) => ({
    address: getAddress(token.id),
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: `/assets/icons/icon-${token.symbol.toLowerCase()}.svg`,
    substitutes: token.substitutes.map((substitute) => ({
      address: getAddress(substitute.id),
      name: substitute.name,
      symbol: substitute.symbol,
      decimals: substitute.decimals,
    })),
  }))
}
