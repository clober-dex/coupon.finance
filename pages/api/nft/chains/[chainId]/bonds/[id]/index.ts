import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { id, chainId } = query
  res.json({
    id,
    name: `Bond #${id}`,
    description: 'Coupon Finance Bond',
    image: `https://coupon.finance/api/nft/chains/${chainId}/bonds/${id}/image`,
  })
}
