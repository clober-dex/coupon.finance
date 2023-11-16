import React, { SVGProps } from 'react'

export const ArrowSvg = (props: SVGProps<any>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.875 6L9.75 6"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 9.375L10.125 6L6.75 2.625"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)
