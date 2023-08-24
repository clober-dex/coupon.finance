import React, { SVGProps } from 'react'

const LeftSvg = (props: SVGProps<any>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 13L5 8L10 3"
      stroke="#030712"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)

export default LeftSvg
