import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDate } from '@storybook/blocks'

import { fetchLoanPosition } from '../../../../../../../apis/loan-position'
import { fetchPrices } from '../../../../../../../apis/currency'
import { calculateLtv } from '../../../../../../../utils/ltv'
import { formatUnits } from '../../../../../../../utils/numbers'

import loanSvg from './loan-svg'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { id, chainId } = query
    if (
      !id ||
      !chainId ||
      typeof id !== 'string' ||
      typeof chainId !== 'string'
    ) {
      res.json({
        status: 'error',
        message: 'URL should be /api/nft/bond/[id]?chainId=[chainId]',
      })
      return
    }
    const loanPosition = await fetchLoanPosition(Number(chainId), BigInt(id))
    if (!loanPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, while fetching loan position',
      })
      return
    }
    const prices = await fetchPrices(Number(chainId), [
      loanPosition.underlying.address,
      loanPosition.collateral.underlying.address,
    ])
    const expiresAt = formatDate(
      new Date(Number(loanPosition.toEpoch.endTimestamp) * 1000),
    )
    const currentLtv = calculateLtv(
      loanPosition.underlying,
      prices[loanPosition.underlying.address],
      loanPosition.amount,
      loanPosition.collateral,
      prices[loanPosition.collateral.underlying.address],
      loanPosition.collateralAmount,
    ).toFixed(2)
    const liquidationThreshold = (
      Number(loanPosition.collateral.liquidationThreshold) / 10000
    ).toFixed(2)

    const svg = loanSvg
      .replace(
        /LOAN_AMOUNT/g,
        formatUnits(
          loanPosition.amount,
          loanPosition.underlying.decimals,
          prices[loanPosition.underlying.address],
        ),
      )
      .replace(/LOAN_TOKEN/g, loanPosition.underlying.symbol)
      .replace(/EXPIRES_AT/g, expiresAt)
      .replace(
        /COLLATERAL_AMOUNT/g,
        formatUnits(
          loanPosition.collateralAmount,
          loanPosition.collateral.underlying.decimals,
          prices[loanPosition.collateral.underlying.address],
        ),
      )
      .replace(/COLLATERAL_TOKEN/g, loanPosition.collateral.underlying.symbol)
      .replace(/LTV_VALUE/g, currentLtv)
      .replace(/LIQUIDATION_THRESHOLD/g, liquidationThreshold)

    res
      .writeHead(200, {
        'Content-Type': 'image/svg+xml',
      })
      .end(svg)
  } catch (error) {
    res.json({
      status: 'error',
      message: `Something went wrong, please try again!!!: ${error}`,
    })
  }
}
