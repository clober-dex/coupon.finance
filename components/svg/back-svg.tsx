import React, { SVGProps } from 'react'

const BackSvg = (props: SVGProps<any>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M27 16L6 16"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-white"
    />
    <path
      d="M14 7L5 16L14 25"
      strokeWidth="2.5"
      strokeLinecap="square"
      className="stroke-gray-950 dark:stroke-white"
    />
  </svg>
)

export default BackSvg
