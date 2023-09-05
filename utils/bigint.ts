export const LIQUIDATION_TARGET_LTV_PRECISION = 10n ** 6n
export const max = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m))
export const min = (...args: bigint[]) => args.reduce((m, e) => (e < m ? e : m))
