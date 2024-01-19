import React, { useCallback } from 'react'
import { useAccount, useQuery, useWalletClient } from 'wagmi'
import { useRouter } from 'next/router'

import {
  fetchReferentCode,
  fetchReferralCode,
  setReferentCodeWithSignature,
  setReferralCode,
} from '../apis/referral'
import { Point } from '../model/point'
import { fetchPoints } from '../apis/point'

type PointContext = {
  referralCode: string | null
  referentCode: string | null
  hasReferent: boolean
  setReferentCode: (referentCode: string) => Promise<void>
  points: Point | null
}

const Context = React.createContext<PointContext>({
  referralCode: null,
  referentCode: null,
  hasReferent: false,
  setReferentCode: () => Promise.resolve(),
  points: null,
})

export const PointProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const { address: userAddress } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { data: points } = useQuery(
    ['points', userAddress],
    async () => {
      if (!userAddress) {
        return null
      }
      return fetchPoints(userAddress)
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
      initialData: null,
    },
  )

  const { data: referralCode } = useQuery(
    ['referral-code', userAddress],
    async () => {
      if (!userAddress) {
        return null
      }
      const code = await fetchReferralCode(userAddress)
      return code ? code : setReferralCode(userAddress)
    },
    {
      initialData: null,
    },
  )

  const {
    data: { referentCode, hasReferent },
  } = useQuery(
    ['referent-code', userAddress, router.query],
    async () => {
      if (Object.keys(router.query).length === 0 || !userAddress) {
        return {
          referentCode: null,
          hasReferent: false,
        }
      }
      const [referentCode, myReferralCode] = await Promise.all([
        fetchReferentCode(userAddress),
        fetchReferralCode(userAddress),
      ])
      if (referentCode) {
        return {
          referentCode,
          hasReferent: true,
        }
      }

      const { referralCode: newReferralCode } = router.query
      if (
        typeof newReferralCode === 'string' &&
        myReferralCode !== newReferralCode
      ) {
        localStorage.setItem('referralCode', newReferralCode)
        return {
          referentCode: newReferralCode,
          hasReferent: false,
        }
      } else if (localStorage.getItem('referralCode')) {
        return {
          referentCode: localStorage.getItem('referralCode'),
          hasReferent: false,
        }
      }
      return {
        referentCode: null,
        hasReferent: false,
      }
    },
    {
      initialData: {
        referentCode: null,
        hasReferent: false,
      },
    },
  )

  const setReferentCode = useCallback(
    async (referentCode: string): Promise<void> => {
      if (!userAddress || !walletClient) {
        return
      }
      const signature = await walletClient.signMessage({
        account: walletClient.account.address,
        message: `${userAddress.toLowerCase()}${referentCode}`,
      })
      try {
        await setReferentCodeWithSignature(userAddress, referentCode, signature)
      } catch (e) {
        console.error(e)
      }
    },
    [userAddress, walletClient],
  )

  return (
    <Context.Provider
      value={{
        referralCode,
        referentCode,
        hasReferent,
        setReferentCode,
        points,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const usePointContext = () => React.useContext(Context) as PointContext
