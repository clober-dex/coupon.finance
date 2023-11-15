import React from 'react'
import Image from 'next/image'

import { Currency, getLogo } from '../../model/currency'

export const CurrencyIcon = ({
  currency,
  ...props
}: {
  currency: Currency
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div className="flex relative">
      <div {...props}>
        <Image
          src={getLogo(currency)}
          alt={currency.name}
          className="rounded-full"
          fill
          onError={(e) => {
            e.currentTarget.src = '/unknown.svg'
          }}
        />
      </div>
    </div>
  )
}
