import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { DragonPointClaimSuccessModal } from './dragon-point-claim-success-modal'

export default {
  title: 'Modal/DragonPointClaimSuccessModal',
  component: DragonPointClaimSuccessModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DragonPointClaimSuccessModal>

type Story = StoryObj<typeof DragonPointClaimSuccessModal>

export const Default: Story = {
  args: {},
}
