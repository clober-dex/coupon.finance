import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import EpochSelect from './epoch-select'

export default {
  title: 'EpochSelect',
  component: EpochSelect,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof EpochSelect>

type Story = StoryObj<typeof EpochSelect>
export const Default: Story = {
  args: {
    epochs: [
      { id: 107, startTimestamp: 1688169600, endTimestamp: 1704067199 },
      { id: 108, startTimestamp: 1704067200, endTimestamp: 1719791999 },
      { id: 109, startTimestamp: 1719792000, endTimestamp: 1735689599 },
      { id: 110, startTimestamp: 1735689600, endTimestamp: 1751327999 },
    ],
    value: { id: 107, startTimestamp: 1688169600, endTimestamp: 1704067199 },
    onValueChange: () => {},
  },
}
