'use client'

import { formatUnits } from 'viem'
import React, { useEffect, useState } from 'react'

import { useCurrencyContext } from '../../contexts/currency-context'
import { Currency } from '../../model/currency'

const BalanceClient = ({ currency }: { currency: Currency }) => {
  const { balances } = useCurrencyContext()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])
  return (
    <>
      {formatUnits(
        hydrated ? balances[currency.address] || 0n : 0n,
        currency.decimals,
      )}
    </>
  )
}

export default BalanceClient
