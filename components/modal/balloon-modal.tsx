import React from 'react'

import { TriangleUpSvg } from '../svg/triangle-up-svg'

export const BalloonModal = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren) => (
  <div {...props}>
    <div className="absolute">
      <TriangleUpSvg />
      <div className="z-[1] flex justify-center items-center gap-2.5 relative right-1/2">
        {children}
      </div>
    </div>
  </div>
)
