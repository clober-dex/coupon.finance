import { promises as fs } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'
import BigNumber from 'bignumber.js'

import { getBuiltGraphSDK } from '../../../../.graphclient'
import { fetchPrices } from '../../../../apis/currency'
import { toCurrency } from '../../../../apis/asset'
import { dollarValue, formatUnits } from '../../../../utils/numbers'

const { getLoanPosition } = getBuiltGraphSDK()

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
    const { loanPosition } = await getLoanPosition(
      {
        positionId: positionId,
      },
      {
        url: process.env.SUBGRAPH_URL,
      },
    )
    if (!loanPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const loanAmount = BigInt(loanPosition.amount)
    const collateralAmount = BigInt(loanPosition.collateralAmount)
    const loanToken = toCurrency(loanPosition.underlying)
    const collateralToken = toCurrency(loanPosition.collateral.underlying)
    const prices = await fetchPrices([
      loanToken.address,
      collateralToken.address,
    ])
    const expiresAt = new Date(Number(loanPosition.toEpoch.endTimestamp) * 1000)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '-')
    const ltv = dollarValue(
      loanAmount,
      loanToken.decimals,
      prices[loanToken.address],
    )
      .times(100)
      .div(
        dollarValue(
          collateralAmount,
          collateralToken.decimals,
          prices[collateralToken.address],
        ),
      )
      .toFixed(2)
    const liquidationThreshold = BigNumber(
      loanPosition.collateral.liquidationThreshold / 10000,
    ).toFixed(2)

    const baseSvg = (
      await fs.readFile('public/position-nft-loan.svg')
    ).toString()

    const svg = baseSvg
      .replace(
        /LOAN_AMOUNT/g,
        formatUnits(loanAmount, loanToken.decimals, prices[loanToken.address]),
      )
      .replace(/LOAN_TOKEN/g, loanToken.symbol)
      .replace(/EXPIRES_AT/g, expiresAt)
      .replace(
        /COLLATERAL_AMOUNT/g,
        formatUnits(
          collateralAmount,
          collateralToken.decimals,
          prices[collateralToken.address],
        ),
      )
      .replace(/COLLATERAL_TOKEN/g, collateralToken.symbol)
      .replace(/LTV_VALUE/g, ltv)
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
