import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import { Footer } from './footer'

export default {
  title: 'Common/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className="w-screen">
      <Footer />
    </div>
  ),
} as Meta<typeof Footer>

type Story = StoryObj<typeof Footer>
export const Default: Story = {
  args: {},
}
