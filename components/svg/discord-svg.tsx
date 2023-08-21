import React, { SVGProps } from 'react'

const DiscordSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.5289 1.84768C15.3051 1.30979 13.9967 0.91886 12.6289 0.696287C12.4608 0.981637 12.2646 1.36543 12.1293 1.67075C10.6751 1.46531 9.23437 1.46531 7.80702 1.67075C7.67174 1.36543 7.47098 0.981637 7.30152 0.696287C5.93213 0.91886 4.62223 1.31122 3.39856 1.85053C0.930404 5.35463 0.261327 8.77171 0.595866 12.1402C2.23288 13.2888 3.81933 13.9864 5.37902 14.443C5.76412 13.9451 6.10757 13.4158 6.40346 12.8579C5.83995 12.6567 5.30023 12.4085 4.79023 12.1203C4.92554 12.0261 5.05787 11.9277 5.18574 11.8264C8.29623 13.1932 11.6758 13.1932 14.7491 11.8264C14.8784 11.9277 15.0108 12.0261 15.1446 12.1203C14.6331 12.4099 14.0919 12.6581 13.5284 12.8593C13.8243 13.4158 14.1662 13.9465 14.5528 14.4444C16.114 13.9879 17.7019 13.2902 19.3389 12.1402C19.7315 8.23525 18.6684 4.84955 16.5289 1.84768ZM6.8272 10.0686C5.89348 10.0686 5.12775 9.24964 5.12775 8.25238C5.12775 7.25506 5.87712 6.4347 6.8272 6.4347C7.77731 6.4347 8.543 7.25363 8.52665 8.25238C8.52817 9.24964 7.77731 10.0686 6.8272 10.0686ZM13.1076 10.0686C12.1739 10.0686 11.4081 9.24964 11.4081 8.25238C11.4081 7.25506 12.1575 6.4347 13.1076 6.4347C14.0577 6.4347 14.8234 7.25363 14.8071 8.25238C14.8071 9.24964 14.0577 10.0686 13.1076 10.0686Z"
      fill="#030712"
      className="dark:fill-white"
    />
  </svg>
)

export default DiscordSvg