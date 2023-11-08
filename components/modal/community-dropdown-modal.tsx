import React from 'react'

export const CommunityDropdownModal = () => (
  <div className="absolute bottom-[-170px] right-[-50px] bg-white inline-flex flex-col items-start shadow text-gray-400 rounded-lg">
    <a
      target="_blank"
      href="https://twitter.com/CouponFinance"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center first:rounded-t-lg hover:text-gray-950"
    >
      Twitter
    </a>
    <a
      target="_blank"
      href="https://discord.com/invite/clober"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center hover:text-gray-950"
    >
      Discord
    </a>
    <a
      target="_blank"
      href="https://docs.coupon.finance/"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center last:rounded-b-lg hover:text-gray-950"
    >
      Docs
    </a>
  </div>
)