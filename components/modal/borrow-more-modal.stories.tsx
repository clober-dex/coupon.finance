import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'
import { ActionButton } from '../action-button'

import BorrowMoreModal from './borrow-more-modal'

export default {
  title: 'BorrowMoreModal',
  component: BorrowMoreModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BorrowMoreModal>

type Story = StoryObj<typeof BorrowMoreModal>

export const Default: Story = {
  args: {
    position: dummyLoanPosition,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    maxLoanableAmount: dummyLoanPosition.amount,
    currentLtv: 60,
    expectedLtv: 70,
    interest: dummyLoanPosition.interest,
    debtAssetPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    actionButton: (
      <ActionButton disabled={false} onClick={() => {}} text={'Borrow More'} />
    ),
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}