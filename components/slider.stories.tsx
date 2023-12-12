import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import { DotSvg } from './svg/dot-svg'
import Slider from './slider'

export default {
  title: 'Common/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(-1)
    return (
      <div className="w-96">
        <Slider {...args} value={value} onValueChange={setValue} />
      </div>
    )
  },
} as Meta<typeof Slider>

type Story = StoryObj<typeof Slider>
export const Default: Story = {
  args: {},
}

export const Disabled: Story = {
  args: {
    segments: 3,
    disabled: true,
  },
}

export const TickMarks: Story = {
  args: {
    segments: 3,
    tickMarks: [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
    ],
  },
}

export const TickMarks2: Story = {
  args: {
    segments: 3,
    tickMarks: [{ value: 1, label: '1' }],
  },
}

export const Segments: Story = {
  args: {
    segments: 3,
    minPosition: 15,
  },
}

export const RenderControl: Story = {
  args: {
    minPosition: 25,
    renderControl: () => (
      <div className="flex w-[96px] flex-col items-center gap-2 shrink-0">
        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 text-gray-400 text-xs font-bold">
          90 Days
        </div>
        <DotSvg />
        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
          +$23.64
        </div>
      </div>
    ),
  },
}
