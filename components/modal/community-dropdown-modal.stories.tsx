import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { CommunityDropdownModal } from './community-dropdown-modal'

export default {
  title: 'Modal/CommunityDropdownModal',
  component: CommunityDropdownModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CommunityDropdownModal>

type Story = StoryObj<typeof CommunityDropdownModal>

export const Default: Story = {
  args: {},
}
