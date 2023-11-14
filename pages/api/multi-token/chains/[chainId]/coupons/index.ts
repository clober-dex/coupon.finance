import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  res.json({
    name: 'Coupon Finance Bond Coupons',
    description: 'Bond Coupons on Coupon Finance',
    image: 'https://x.com/CouponFinance/header_photo',
    external_link: 'https://www.coupon.finance',
  })
}
