import React, { SVGProps } from 'react'

export const TriangleUpSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M8 0L0 16H16L8 0Z" />
  </svg>
)
