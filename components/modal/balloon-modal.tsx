import React from 'react'

import { TriangleUpSvg } from '../svg/triangle-up-svg'
import { ZIndices } from '../../utils/z-indices'

export const BalloonModal = ({
  children,
  ...props
}: React.PropsWithChildren) => (
  <div className="absolute" {...props}>
    <TriangleUpSvg
      className={`z-[${ZIndices.panel}] fill-white dark:fill-gray-900`}
    />
    <div className="z-[-1] px-4 text-sm py-3 flex justify-center items-center gap-2.5 relative right-1/2 bg-white dark:bg-gray-900 rounded-lg">
      {children}
    </div>
  </div>
)
