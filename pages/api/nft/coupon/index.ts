import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.json({
    name: 'Coupon Bond',
    description: 'Coupon Finance Bond Contract URI',
    image: '',
    external_link: 'https://coupon.finance/',
  })
}
