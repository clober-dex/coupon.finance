import React, { useEffect } from 'react'
import { Chain, useNetwork } from 'wagmi'

import { supportChains } from '../constants/chain'

type ChainContext = {
  selectedChain: Chain
  setSelectedChain: (chain: Chain) => void
}

const Context = React.createContext<ChainContext>({
  selectedChain: supportChains[0],
  setSelectedChain: (_) => _,
})

export const ChainProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { chain } = useNetwork()
  const [selectedChain, setSelectedChain] = React.useState<Chain>(
    supportChains[0],
  )

  useEffect(() => {
    if (chain) {
      setSelectedChain(chain)
    }
  }, [chain])

  return (
    <Context.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
