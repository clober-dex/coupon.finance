import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'

import Panel from './panel'

export default {
  title: 'Panel',
  component: Panel,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Panel>

type Story = StoryObj<typeof Panel>
export const Default: Story = {
  args: {
    open: true,
    setOpen: () => {},
    // @ts-ignore
    router: {
      query: {
        mode: 'borrow',
      },
    },
  },
}
