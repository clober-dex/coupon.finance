import React, { SVGProps } from 'react'

export const GreenCircleSvg = (props: SVGProps<any>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <circle cx="6" cy="6" r="6" fill="#22C55E" />
  </svg>
)
