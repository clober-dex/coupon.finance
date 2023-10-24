import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyBondPosition } from '../../.storybook/dummy-data/bond-position'
import { ActionButton } from '../action-button'

import WithdrawModal from './withdraw-modal'

export default {
  title: 'WithdrawModal',
  component: WithdrawModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WithdrawModal>

type Story = StoryObj<typeof WithdrawModal>

export const Default: Story = {
  args: {
    position: dummyBondPosition,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    repurchaseFee: 0n,
    maxWithdrawAmount: 1000000000000000000000n,
    depositAssetPrice: {
      value: 99970000n,
      decimals: 8,
    },
    actionButton: (
      <ActionButton disabled={false} onClick={() => {}} text={'Withdraw'} />
    ),
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
