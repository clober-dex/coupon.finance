import React, { SVGProps } from 'react'

export const ZeroTierSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="27"
    height="24"
    viewBox="0 0 27 24"
    fill="none"
    {...props}
  >
    <path d="M25 4H2V17.3333L13.5 24L25 17.3333V4Z" fill="#41C7AF" />
    <rect width="27" height="4" fill="#0D937B" />
    <rect x="2" y="3" width="23" height="3" fill="#0D937B" fillOpacity="0.4" />
    <path
      d="M17.5 12C17.5 14.6108 15.5889 16.5 13.5 16.5C11.4111 16.5 9.5 14.6108 9.5 12C9.5 9.38919 11.4111 7.5 13.5 7.5C15.5889 7.5 17.5 9.38919 17.5 12Z"
      stroke="white"
      strokeWidth="3"
    />
  </svg>
)
