import React from 'react'

import ToolSvg from './svg/tool-svg'
import SlippageSelectModal from './modal/slippage-select-modal'

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
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {show ? (
        <SlippageSelectModal slippage={slippage} setSlippage={setSlippage} />
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
