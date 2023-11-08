import React from 'react'

import NumberInput from '../input/number-input'

const SlippageSelectModal = ({
  slippage,
  setSlippage,
}: {
  slippage: string
  setSlippage: React.Dispatch<React.SetStateAction<string>>
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="flex flex-col absolute bottom-10 right-0 p-4 bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl gap-4">
      <div className="font-bold">Set Slippage</div>
      <div className="flex bg-white dark:bg-gray-700 items-center justify-between rounded shadow pr-3">
        <NumberInput
          value={slippage}
          onValueChange={setSlippage}
          onBlur={() => +slippage > 50 && setSlippage('50')}
          className="p-3 outline-none bg-transparent"
          placeholder="0"
        />
        %
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setSlippage('0.5')}
          className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 dark:text-white text-sm bg-green-500 dark:bg-transparent bg-opacity-10 border-[1.5px] border-solid border-gray-700 hover:bg-opacity-20 dark:hover:border-white flex-1"
        >
          0.5%
        </button>
        <button
          onClick={() => setSlippage('1')}
          className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 dark:text-white text-sm bg-green-500 dark:bg-transparent bg-opacity-10 border-[1.5px] border-solid border-gray-700 hover:bg-opacity-20 dark:hover:border-white flex-1"
        >
          1.0%
        </button>
        <button
          onClick={() => setSlippage('1.5')}
          className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 dark:text-white text-sm bg-green-500 dark:bg-transparent bg-opacity-10 border-[1.5px] border-solid border-gray-700 hover:bg-opacity-20 dark:hover:border-white flex-1"
        >
          1.5%
        </button>
      </div>
    </div>
  )
}

export default SlippageSelectModal
