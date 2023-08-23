import { Chain, useAccount, useNetwork } from 'wagmi'
import React, { useContext, useMemo } from 'react'

type WalletContext = {
  userAddress?: `0x${string}`
  connectedChain?: Chain & {
    unsupported?: boolean
  }
}

const Context = React.createContext<WalletContext>({})

export function WalletProvider({ children }: React.PropsWithChildren<{}>) {
  const { chain: connectedChain } = useNetwork()
  const { address: userAddress } = useAccount()
  const value = useMemo<WalletContext>(
    () => ({
      userAddress,
      connectedChain,
    }),
    [connectedChain, userAddress],
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useWalletContext() {
  return useContext(Context) as WalletContext
}
