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
  integrated: getIntegratedQuery | undefined
  integratedPositions: getIntegratedPositionsQuery | undefined
  integratedPoint: getIntegratedPointQuery | undefined
}

const Context = React.createContext<SubgraphContext>({
  integrated: undefined,
  integratedPositions: undefined,
  integratedPoint: undefined,
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
      initialData: undefined,
    },
  )

  const { data: integratedPositions } = useQuery(
    ['integrated-positions', selectedChain, userAddress],
    async () => {
      if (!userAddress) {
        return undefined
      }
      return fetchIntegratedPositions(selectedChain.id, userAddress)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
      initialData: undefined,
    },
  )

  const { data: integratedPoint } = useQuery(
    ['integrated-point', selectedChain, userAddress],
    async () => {
      if (!userAddress) {
        return undefined
      }
      return fetchIntegratedPoint(selectedChain.id, userAddress)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
      initialData: undefined,
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
