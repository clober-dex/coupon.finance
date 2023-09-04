const YEAR_IN_SECONDS = 31536000

/**
 * Returns the APR for a given proceeds per unit of underlying asset and duration in seconds
 * @param p {number} average proceeds per unit of underlying asset
 * @param d {number} duration until last coupon expires in seconds
 */
export const calculateApr = (p: number, d: number) => {
  return p * (YEAR_IN_SECONDS / d) * 100
}
