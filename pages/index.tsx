import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { getToken } from 'next-auth/jwt'
import { useAccount } from 'wagmi'

import Deposit from '../components/deposit'
import Borrow from '../components/borrow'
import { AssetStatus } from '../model/asset'
import { fetchAssetStatuses } from '../api/asset'
import { fetchEpochs } from '../api/epoch'
import { Epoch } from '../model/epoch'
import { fetchBondPositions } from '../api/bond-position'
import { fetchLoanPositions } from '../api/loan-position'

export const getServerSideProps: GetServerSideProps<{
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}> = async ({ req }) => {
  const queryClient = new QueryClient()
  const token = await getToken({ req })
  const userAddress = token?.sub as `0x${string}` | undefined

  await queryClient.prefetchQuery(
    ['bond-positions', userAddress],
    () => userAddress && fetchBondPositions(userAddress),
  )
  await queryClient.prefetchQuery(
    ['loan-positions', userAddress],
    () => userAddress && fetchLoanPositions(userAddress),
  )

  const [assetStatuses, epochs] = await Promise.all([
    fetchAssetStatuses(),
    fetchEpochs(),
  ])
  return {
    props: {
      assetStatuses,
      epochs,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assetStatuses, epochs }) => {
  const router = useRouter()
  const { address: userAddress } = useAccount()

  const { data: bondPositions } = useQuery(
    ['bond-positions', userAddress],
    () => (userAddress ? fetchBondPositions(userAddress) : []),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 2 * 1000,
      initialData: [],
    },
  )

  const { data: loanPositions } = useQuery(
    ['loan-positions', userAddress],
    () => (userAddress ? fetchLoanPositions(userAddress) : []),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 2 * 1000,
      initialData: [],
    },
  )

  return (
    <div className="flex flex-1">
      <Head>
        <title>Coupon Finance</title>
      </Head>

      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex mt-24">
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode !== 'borrow'}
            onClick={() => router.replace('/', undefined, { shallow: true })}
          >
            Deposit
          </button>
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
            disabled={router.query.mode === 'borrow'}
            onClick={() =>
              router.replace('/?mode=borrow', undefined, { shallow: true })
            }
          >
            Borrow
          </button>
          <Link href="/faucet">
            <button
              className="flex font-bold items-center justify-center text-base sm:text-2xl w-18 sm:w-36 bg-transparent text-gray-400 dark:text-gray-500 disabled:text-gray-950 border-0 dark:disabled:text-white rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-gray-950 dark:disabled:border-b-white"
              disabled={router.query.mode === 'faucet'}
            >
              Faucet
            </button>
          </Link>
        </div>
        {router.query.mode !== 'borrow' ? (
          <Deposit
            assetStatuses={assetStatuses}
            epochs={epochs}
            positions={bondPositions}
          />
        ) : (
          <Borrow
            assetStatuses={assetStatuses}
            epochs={epochs}
            positions={loanPositions}
          />
        )}
      </main>
    </div>
  )
}

export default Home
