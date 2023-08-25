import React, { SVGProps } from 'react'

const SearchSvg = (props: SVGProps<any>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="7.22222"
      cy="7.22222"
      r="5.47222"
      strokeWidth="1.5"
      className="stroke-gray-950 dark:stroke-white"
    />
    <path
      d="M11.3701 11.3701L14.9997 14.9997"
      strokeWidth="1.5"
      className="stroke-gray-950 dark:stroke-white"
    />
  </svg>
)

export default SearchSvg
