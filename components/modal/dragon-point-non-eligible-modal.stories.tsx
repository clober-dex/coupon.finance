import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { DragonPointNonEligibleModal } from './dragon-point-non-eligible-modal'

export default {
  title: 'Modal/DragonPointNonEligibleModal',
  component: DragonPointNonEligibleModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DragonPointNonEligibleModal>

type Story = StoryObj<typeof DragonPointNonEligibleModal>

export const Default: Story = {
  args: {},
}
