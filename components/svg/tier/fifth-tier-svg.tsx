import React, { SVGProps } from 'react'

export const FifthTierSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    {...props}
  >
    <path
      d="M15.7412 3H1.25977V15.5L8.50051 13L15.7412 15.5V3Z"
      fill="url(#paint0_linear_2308_4122)"
    />
    <rect y="0.5" width="17" height="2.5" fill="#646DFF" />
    <rect
      x="1.25977"
      y="3"
      width="14.4815"
      height="1.25"
      fill="#616069"
      fillOpacity="0.4"
    />
    <path
      d="M6.29688 5.8125L8.70092 10.1875L10.7043 5.8125"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2308_4122"
        x1="8.50051"
        y1="3"
        x2="8.50051"
        y2="18.3125"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#58D7FF" />
        <stop offset="1" stopColor="#6842FF" />
      </linearGradient>
    </defs>
  </svg>
)
