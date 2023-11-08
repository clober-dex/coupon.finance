import React from 'react'

import { TriangleUpSvg } from '../svg/triangle-up-svg'

export const BalloonModal = ({ text }: { text: string }) => (
  <div className="absolute">
    <TriangleUpSvg className="z-[10000] fill-white dark:fill-black" />
    <div className="z-[-1] px-4 text-sm py-3 flex justify-center items-center gap-2.5 relative right-1/2 bg-white dark:bg-black shadow rounded-lg">
      {text}
    </div>
  </div>
)
