import React from 'react'

export const DotSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      fill="#22C55E"
      stroke="#22C55E"
      strokeWidth="2"
    />
  </svg>
)
