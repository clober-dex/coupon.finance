export const max = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m))
export const min = (...args: bigint[]) => args.reduce((m, e) => (e < m ? e : m))

export const applyPercent = (
  amount: bigint,
  percent: number,
  decimal: number = 5,
): bigint => {
  return (
    (amount * BigInt(Math.floor(percent * 10 ** decimal))) /
    BigInt(10 ** decimal)
  )
}
