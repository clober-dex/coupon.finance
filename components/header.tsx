import React, { SVGProps } from 'react'

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

const Header = () => {
  const { setTheme } = useThemeContext()
  return (
    <div className="flex justify-between items-center p-4 dark:bg-white dark:bg-opacity-5">
      <h1 className="text-gray-950 dark:text-white">Coupon Finance</h1>
      <div className="flex gap-4">
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
      </div>
    </div>
  )
}

export default Header
