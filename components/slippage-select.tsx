import React from 'react'

import ToolSvg from './svg/tool-svg'
import NumberInput from './number-input'

const SlippageSelect = ({
  show,
  setShow,
  slippage,
  setSlippage,
}: {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  slippage: string
  setSlippage: React.Dispatch<React.SetStateAction<string>>
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {show ? (
        <div className="flex flex-col absolute bottom-10 right-0 p-4 bg-gray-50 shadow-md rounded-xl gap-4">
          <div className="font-bold">Set Slippage</div>
          <div className="flex bg-white items-center justify-between rounded shadow pr-3">
            <NumberInput
              value={slippage}
              onValueChange={setSlippage}
              onBlur={() => +slippage > 50 && setSlippage('50')}
              className="p-3 outline-none"
              placeholder="0"
            />
            %
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSlippage('')}
              className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 text-sm bg-green-500 bg-opacity-10 hover:bg-opacity-20 flex-1"
            >
              0.0%
            </button>
            <button
              onClick={() => setSlippage('0.5')}
              className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 text-sm bg-green-500 bg-opacity-10 hover:bg-opacity-20 flex-1"
            >
              0.5%
            </button>
            <button
              onClick={() => setSlippage('1')}
              className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 text-sm bg-green-500 bg-opacity-10 hover:bg-opacity-20 flex-1"
            >
              1.0%
            </button>
            <button
              onClick={() => setSlippage('1.5')}
              className="flex items-center justify-center rounded px-3 py-1.5 text-green-500 text-sm bg-green-500 bg-opacity-10 hover:bg-opacity-20 flex-1"
            >
              1.5%
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <button
        className="flex items-center gap-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 py-1 px-2 rounded"
        onClick={() => setShow(!show)}
      >
        <ToolSvg />
        <div className="text-green-500 text-xs sm:text-sm">
          Slippage {+slippage}%
        </div>
      </button>
    </div>
  )
}

export default SlippageSelect
