import React, { SVGProps } from 'react'

export const PlusSvg = (props: SVGProps<any>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    {...props}
  >
    <path
      d="M2.9887 8V0H5.0113V8H2.9887ZM0 5.0113V2.9887H8V5.0113H0Z"
      className="fill-[#030712] dark:fill-white"
    />
  </svg>
)
