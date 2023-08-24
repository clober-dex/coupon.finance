import React, { SVGProps } from 'react'

const DownSvg = (props: SVGProps<any>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.75 4.125L6 7.875L2.25 4.125"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)

export default DownSvg
