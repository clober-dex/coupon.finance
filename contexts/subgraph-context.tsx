import React from 'react'
import { useAccount, useQuery } from 'wagmi'

import {
  getIntegratedPointQuery,
  getIntegratedPositionsQuery,
  getIntegratedQuery,
} from '../.graphclient'
import {
  fetchIntegrated,
  fetchIntegratedPoint,
  fetchIntegratedPositions,
} from '../apis/integrated'

import { useChainContext } from './chain-context'

type SubgraphContext = {
  integrated: getIntegratedQuery | null
  integratedPositions: getIntegratedPositionsQuery | null
  integratedPoint: getIntegratedPointQuery | null
}

const Context = React.createContext<SubgraphContext>({
  integrated: null,
  integratedPositions: null,
  integratedPoint: null,
})

export const SubgraphProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()

  const { data: integrated } = useQuery(
    ['integrated', selectedChain],
    async () => {
      return fetchIntegrated(selectedChain.id)
    },
    {
      initialData: null,
    },
  )

  const { data: integratedPositions } = useQuery(
    ['integrated-positions', selectedChain, userAddress],
    async () => {
      if (!userAddress) {
        return null
      }
      return fetchIntegratedPositions(selectedChain.id, userAddress)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
      initialData: null,
    },
  )

  const { data: integratedPoint } = useQuery(
    ['integrated-point', selectedChain, userAddress],
    async () => {
      if (!userAddress) {
        return null
      }
      return fetchIntegratedPoint(selectedChain.id, userAddress)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
      initialData: null,
    },
  )

  return (
    <Context.Provider
      value={{
        integrated,
        integratedPositions,
        integratedPoint,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSubgraphContext = () =>
  React.useContext(Context) as SubgraphContext
