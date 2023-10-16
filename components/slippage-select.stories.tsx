import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import SlippageSelect from './slippage-select'

export default {
  title: 'Common/SlippageSelect',
  component: SlippageSelect,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof SlippageSelect>

const SlippageSelectWithHooks = () => {
  const [showSlippageSelect, setShowSlippageSelect] = useState(false)
  const [slippage, setSlippage] = useState('1')

  return (
    <SlippageSelect
      show={showSlippageSelect}
      setShow={setShowSlippageSelect}
      slippage={slippage}
      setSlippage={setSlippage}
    />
  )
}

export const Example: StoryObj<typeof SlippageSelect> = {
  render: () => <SlippageSelectWithHooks />,
}
