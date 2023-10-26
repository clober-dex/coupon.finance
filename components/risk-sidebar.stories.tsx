import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import { RiskSidebar } from './risk-sidebar'

export default {
  title: 'RiskSidebar',
  component: RiskSidebar,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="border border-solid border-gray-700">
        <RiskSidebar {...args} />
      </div>
    )
  },
} as Meta<typeof RiskSidebar>

type Story = StoryObj<typeof RiskSidebar>
export const Default: Story = {
  args: {
    showRiskSidebar: true,
    setShowRiskSidebar: () => {},
  },
}
