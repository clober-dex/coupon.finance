export const max = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m))
export const min = (...args: bigint[]) => args.reduce((m, e) => (e < m ? e : m))
