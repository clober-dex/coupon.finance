import React from 'react'

export const CommunityDropdownModal = () => (
  <div className="absolute top-16 left-0 bg-white dark:bg-gray-800 inline-flex flex-col items-start text-gray-400 rounded-lg">
    <a
      target="_blank"
      href="https://twitter.com/CouponFinance"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center first:rounded-t-lg hover:text-gray-950 dark:hover:text-gray-100"
    >
      Twitter
    </a>
    <a
      target="_blank"
      href="https://discord.com/invite/clober"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center hover:text-gray-950 dark:hover:text-gray-100"
    >
      Discord
    </a>
    <a
      target="_blank"
      href="https://docs.coupon.finance/"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center last:rounded-b-lg hover:text-gray-950 dark:hover:text-gray-100"
    >
      Docs
    </a>
    <a
      target="_blank"
      href="https://t.me/CouponFinance"
      rel="noreferrer"
      className="cursor-pointer flex w-[140px] px-4 pt-4 pb-3 gap-2 items-center last:rounded-b-lg hover:text-gray-950 dark:hover:text-gray-100"
    >
      Telegram
    </a>
  </div>
)
