import React, { SVGProps } from 'react'

export const FirstTierSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    {...props}
  >
    <path
      d="M15.7412 3H1.25977V11.3333L8.50051 15.5L15.7412 11.3333V3Z"
      fill="#77B255"
    />
    <rect y="0.5" width="17" height="2.5" fill="#3E721D" />
    <rect
      x="1.25977"
      y="2.375"
      width="14.4815"
      height="1.875"
      fill="#3E721D"
      fillOpacity="0.4"
    />
    <rect
      x="7.55469"
      y="4.875"
      width="1.88889"
      height="6.25"
      rx="0.944444"
      fill="white"
    />
  </svg>
)
