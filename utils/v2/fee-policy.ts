import { FeePolicy } from '../../model/v2/fee-policy'

export const isFeePolicyEqual = (a: FeePolicy, b: FeePolicy) => {
  return a.rate === b.rate && a.usesQuote === b.usesQuote
}
