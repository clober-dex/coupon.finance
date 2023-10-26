import { promises as fs } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchPrices } from '../../../../apis/currency'
import { formatUnits } from '../../../../utils/numbers'
import { calculateLtv } from '../../../../utils/ltv'
import { fetchLoanPosition } from '../../../../apis/loan-position'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { positionId } = query
    if (!positionId || typeof positionId !== 'string') {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const loanPosition = await fetchLoanPosition(BigInt(positionId))
    if (!loanPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const prices = await fetchPrices([
      loanPosition.underlying.address,
      loanPosition.collateral.underlying.address,
    ])
    const expiresAt = new Date(Number(loanPosition.toEpoch.endTimestamp) * 1000)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '-')
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

    const baseSvg = (
      await fs.readFile('public/loan-position-nft.svg')
    ).toString()

    const svg = baseSvg
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
    console.log(error)
    res.json({
      status: 'error',
      message: 'Something went wrong, please try again!!!',
    })
  }
}
