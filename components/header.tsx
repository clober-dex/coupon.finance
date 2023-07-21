import React, { SVGProps } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useThemeContext } from '../contexts/theme-context'

const LightSvg = (props: SVGProps<any>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.00033 11.3334C9.84127 11.3334 11.3337 9.84103 11.3337 8.00008C11.3337 6.15913 9.84127 4.66675 8.00033 4.66675C6.15938 4.66675 4.66699 6.15913 4.66699 8.00008C4.66699 9.84103 6.15938 11.3334 8.00033 11.3334Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 fill-gray-950 dark:stroke-gray-500 dark:fill-gray-500"
    />
    <path
      d="M8 0.666748V2.00008"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M8 14V15.3333"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M2.81348 2.81323L3.76014 3.7599"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M12.2402 12.24L13.1869 13.1867"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M0.666992 8H2.00033"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M14 8H15.3333"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M2.81348 13.1867L3.76014 12.24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
    <path
      d="M12.2402 3.7599L13.1869 2.81323"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-gray-500 "
    />
  </svg>
)

const DarkSvg = (props: SVGProps<any>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.9999 8.52667C13.8951 9.66147 13.4692 10.7429 12.7721 11.6445C12.075 12.5461 11.1356 13.2305 10.0637 13.6177C8.99188 14.0049 7.83192 14.0787 6.7196 13.8307C5.60728 13.5827 4.5886 13.023 3.78275 12.2172C2.97691 11.4113 2.41723 10.3927 2.16921 9.28033C1.92118 8.16801 1.99508 7.00806 2.38224 5.9362C2.7694 4.86434 3.45382 3.92491 4.35541 3.22784C5.257 2.53076 6.33847 2.10487 7.47327 2C6.80888 2.89884 6.48917 4.0063 6.57229 5.12094C6.65541 6.23559 7.13584 7.28337 7.9262 8.07373C8.71656 8.86409 9.76435 9.34452 10.879 9.42765C11.9936 9.51077 13.1011 9.19106 13.9999 8.52667Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="dark:stroke-white stroke-gray-500 "
    />
  </svg>
)

const TwitterSvg = (props: SVGProps<any>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.27767 17.5C3.96696 17.5 1.81298 16.8352 0 15.6882C1.53928 15.7867 4.25576 15.5508 5.94541 13.9566C3.40363 13.8413 2.25733 11.913 2.10781 11.089C2.32378 11.1714 3.35379 11.2703 3.93524 11.0396C1.01136 10.3144 0.562805 7.77637 0.662483 7.00178C1.21071 7.38083 2.14104 7.51268 2.50652 7.47972C-0.218005 5.55147 0.762161 2.65086 1.24394 2.02459C3.19916 4.70395 6.12943 6.20877 9.75456 6.29248C9.68621 5.99596 9.65011 5.68725 9.65011 5.37018C9.65011 3.09467 11.5096 1.25 13.8034 1.25C15.0018 1.25 16.0817 1.75358 16.8398 2.55907C17.6406 2.37344 18.8459 1.93891 19.4352 1.56313C19.1382 2.6179 18.2135 3.49779 17.6542 3.82391C17.6589 3.83501 17.6497 3.81277 17.6542 3.82391C18.1455 3.75041 19.4748 3.49771 20 3.14528C19.7403 3.73784 18.76 4.72307 17.9555 5.27465C18.1052 11.8041 13.0546 17.5 6.27767 17.5Z"
      fill="#030712"
      className="dark:fill-white"
    />
  </svg>
)

const DiscordSvg = (props: SVGProps<any>) => (
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

const Header = () => {
  const { setTheme } = useThemeContext()
  return (
    <div className="fixed w-full flex justify-between items-center p-4 bg-white bg-opacity-5">
      <div className="flex items-center gap-12">
        <h1 className="text-[24px] text-gray-950 dark:text-white">
          Coupon Finance
        </h1>
        <div className="flex items-center gap-8">
          <TwitterSvg />
          <DiscordSvg />
          <div className="text-sm font-bold text-gray-950 dark:text-white">
            DOCS
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex rounded bg-gray-100 dark:bg-gray-800 w-16 h-8">
          <button
            className="flex flex-1 rounded items-center justify-center border-solid dark:border-none border-gray-950 border-[1.5px]"
            onClick={() => setTheme('light')}
          >
            <LightSvg />
          </button>
          <button
            className="flex flex-1 rounded items-center justify-center border-none dark:border-solid border-white border-[1.5px]"
            onClick={() => setTheme('dark')}
          >
            <DarkSvg />
          </button>
        </div>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
