import React from 'react'

export const GoldMedalIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#FDE68A"
    />
    <path
      d="M12 22C17.5228 22 22 17.5229 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22Z"
      fill="#FBBF24"
    />
    <path
      d="M2.48924 10.9091C3.61357 5.485 8.90205 2.02192 14.3155 3.14846C17.9799 3.94122 20.7699 6.61155 21.811 9.94946C21.0198 6.19431 18.0632 3.06502 14.1073 2.23054C8.69385 1.10399 3.36372 4.6088 2.2394 9.99118C1.86462 11.7436 1.98954 13.4543 2.48924 15.0398C2.19775 13.7046 2.19775 12.3277 2.48924 10.9091Z"
      fill="black"
      fillOpacity="0.25"
    />
    <g filter="url(#filter0_d_2207_7124)">
      <path
        d="M13.717 6.51978V17.3198H11.443V8.68716H11.38L8.91699 10.2375V8.21255L11.5796 6.51978H13.717Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_2207_7124"
        x="8.41699"
        y="6.01978"
        width="6.7998"
        height="12.8"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="0.5" dy="0.5" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2207_7124"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2207_7124"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
)
