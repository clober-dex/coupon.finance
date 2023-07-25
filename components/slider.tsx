import React, { SVGProps } from 'react'

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
  value,
  onValueChange,
  ...props
}: {
  value: number
  onValueChange: (value: number) => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex justify-between" {...props}>
      <button
        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-solid ${
          value > 0
            ? 'bg-green-500 border-green-500'
            : 'bg-white dark:bg-gray-800 border-gray-300 '
        } z-10`}
        onClick={() => onValueChange(1)}
      >
        {value === 1 ? <Check /> : <></>}
      </button>
      <div
        className={`flex-1 h-1 mt-2.5 ${
          value > 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />
      <button
        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-solid ${
          value > 1
            ? 'bg-green-500 border-green-500'
            : 'bg-white dark:bg-gray-800 border-gray-300'
        } z-10`}
        onClick={() => onValueChange(2)}
      >
        {value === 2 ? <Check /> : <></>}
      </button>
      <div
        className={`flex-1 h-1 mt-2.5 ${
          value > 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />
      <button
        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-solid ${
          value > 2
            ? 'bg-green-500 border-green-500'
            : 'bg-white dark:bg-gray-800 border-gray-300'
        } z-10`}
        onClick={() => onValueChange(3)}
      >
        {value === 3 ? <Check /> : <></>}
      </button>
      <div
        className={`flex-1 h-1 mt-2.5 ${
          value > 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />
      <button
        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-solid ${
          value > 3
            ? 'bg-green-500 border-green-500'
            : 'bg-white dark:bg-gray-800 border-gray-300'
        } z-10`}
        onClick={() => onValueChange(4)}
      >
        {value === 4 ? <Check /> : <></>}
      </button>
    </div>
  )
}

export default Slider
