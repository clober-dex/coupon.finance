import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'

import { dummyPathVizData } from '../.storybook/dummy-data/path-viz'

import OdosPathViz from './odos-path-viz'

export default {
  title: 'OdosPathViz',
  component: OdosPathViz,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="w-[500px] h-[300px]">
      <OdosPathViz {...args} />
    </div>
  ),
} as Meta<typeof OdosPathViz>

type Story = StoryObj<typeof OdosPathViz>

export const Default: Story = {
  args: {
    pathVizData: dummyPathVizData,
  },
}
