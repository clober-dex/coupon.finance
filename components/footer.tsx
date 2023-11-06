import React from 'react'

import HashedSvg from './svg/hashed-svg'
import { CloberLogoSvg } from './svg/clober-logo-svg'
import { CloberSymbolSvg } from './svg/clober-symbol-svg'

export const Footer = () => {
  return (
    <div className="flex h-[68px] bg-white dark:bg-gray-950 shrink-0 pt-0 items-center justify-center">
      <div className="inline-flex gap-12">
        <div className="flex items-center gap-2">
          <div className="text-gray-400 dark:text-white text-sm">
            Powered by
          </div>
          <div className="flex flex-row gap-1">
            <CloberSymbolSvg />
            <CloberLogoSvg />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-400 dark:text-white text-sm">Backed by</div>
          <HashedSvg />
        </div>
      </div>
    </div>
  )
}
