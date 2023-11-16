import React, { useCallback } from 'react'

import { Currency } from '../model/currency'

type AdvancedContractContext = {
  mintSubstitute: (
    underlying: Currency,
    substitute: Currency,
    amount: bigint,
  ) => Promise<void>
  burnSubstitute: (
    underlying: Currency,
    substitute: Currency,
    amount: bigint,
  ) => Promise<void>
  mintCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
  burnCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
}

const Context = React.createContext<AdvancedContractContext>({
  mintSubstitute: () => Promise.resolve(),
  burnSubstitute: () => Promise.resolve(),
  mintCoupon: () => Promise.resolve(),
  burnCoupon: () => Promise.resolve(),
})

export const AdvancedContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const mintSubstitute = useCallback(
    async (underlying: Currency, substitute: Currency, amount: bigint) => {},
    [],
  )
  const burnSubstitute = useCallback(
    async (underlying: Currency, substitute: Currency, amount: bigint) => {},
    [],
  )
  const mintCoupon = useCallback(async () => {}, [])
  const burnCoupon = useCallback(async () => {}, [])
  return (
    <Context.Provider
      value={{
        mintSubstitute,
        burnSubstitute,
        mintCoupon,
        burnCoupon,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAdvancedContractContext = () =>
  React.useContext(Context) as AdvancedContractContext
