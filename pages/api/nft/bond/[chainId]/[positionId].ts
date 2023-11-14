import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { positionId, chainId } = query
  res.json({
    id: positionId,
    name: `Bond #${positionId}`,
    description: 'Coupon Finance Bond',
    image: `https://coupon.finance/api/nft/bond/${chainId}/${positionId}/image`,
  })
}
