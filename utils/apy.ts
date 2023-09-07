const YEAR_IN_SECONDS = 31536000

/**
 * Returns the APY for a given proceeds per unit of underlying asset and duration in seconds
 * @param p {number} average proceeds per unit of underlying asset
 * @param d {number} duration until last coupon expires in seconds
 */
export const calculateApy = (p: number, d: number) => {
  return ((1 + p) ** (YEAR_IN_SECONDS / d) - 1) * 100
}
