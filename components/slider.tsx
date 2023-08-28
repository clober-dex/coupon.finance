import React, { SVGProps } from 'react'

import { MAX_EPOCHS } from '../utils/epoch'

const Check = (props: SVGProps<any>) => (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 6.34286L5.80952 10L12 2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
)

const Slider = ({
  count,
  value,
  onValueChange,
  ...props
}: {
  count: number
  value: number
  onValueChange: (value: number) => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  const arr = Array.from(Array(MAX_EPOCHS).keys()).slice(
    MAX_EPOCHS - count,
    MAX_EPOCHS,
  )
  return (
    <div
      className="flex flex-col sm:flex-row h-36 sm:h-auto justify-between"
      {...props}
    >
      {arr.map((i, index) => (
        <>
          <button
            key={`slider-${i}-${index}`}
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-solid ${
              value > i
                ? 'bg-green-500 border-green-500'
                : 'bg-white dark:bg-gray-800 border-gray-300 '
            } z-10`}
            onClick={() => onValueChange(i + 1)}
          >
            {value === i + 1 ? <Check /> : <></>}
          </button>
          {index !== arr.length - 1 && (
            <div
              className={`flex-1 w-1 ml-2.5 sm:ml-0 sm:h-1 sm:mt-2.5 ${
                value > i + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </>
      ))}
    </div>
  )
}

export default Slider
