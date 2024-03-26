import React from 'react'

import { CloberLogoSvg } from './svg/clober-logo-svg'
import { CloberSymbolSvg } from './svg/clober-symbol-svg'

export const Footer = () => {
  return (
    <div className="flex flex-col px-4 sm:px-0 sm:flex-row gap-2 sm:gap-12 mt-[64px] h-[68px] bg-white dark:bg-opacity-5 shrink-0 pt-0 items-start sm:items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="text-gray-400 dark:text-gray-500 text-sm">
          Powered by
        </div>
        <div className="flex items-center gap-1">
          <CloberSymbolSvg />
          <CloberLogoSvg />
        </div>
      </div>
    </div>
  )
}
