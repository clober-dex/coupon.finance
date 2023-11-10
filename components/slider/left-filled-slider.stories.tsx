import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { DotSvg } from '../svg/dot-svg'

import LeftFilledSlider from './left-filled-slider'

export default {
  title: 'LeftFilledSlider',
  component: LeftFilledSlider,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(1)
    return (
      <div className="w-96">
        <LeftFilledSlider {...args} value={value} onValueChange={setValue} />
      </div>
    )
  },
} as Meta<typeof LeftFilledSlider>

type Story = StoryObj<typeof LeftFilledSlider>
export const Default: Story = {
  args: {
    length: 4,
    leftFilledPercentage: 10,
    children: (
      <div className="flex w-[96px] flex-col items-center gap-2 shrink-0">
        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 text-gray-400 text-xs">
          90 Days
        </div>
        <DotSvg />
        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-sm text-green-500 font-bold">
          +$23.64
        </div>
      </div>
    ),
  },
}
