import React, { useState } from 'react'
import Image from 'next/image'

import { Currency, getLogo } from '../../model/currency'

export const CurrencyIcon = ({
  currency,
  ...props
}: {
  currency: Currency
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [useFallbackSrc, setUseFallbackSrc] = useState(false)
  return (
    <div className="flex relative">
      <div {...props}>
        <Image
          src={useFallbackSrc ? '/unknown.svg' : getLogo(currency)}
          alt={currency.name}
          className="rounded-full"
          fill
          onError={() => {
            setUseFallbackSrc(true)
          }}
        />
      </div>
    </div>
  )
}
