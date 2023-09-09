import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Deposit from '../components/deposit'
import Borrow from '../components/borrow'
import { AssetStatus } from '../model/asset'
import { fetchAssetStatuses } from '../api/asset'
import { fetchEpochs } from '../api/epoch'
import { Epoch } from '../model/epoch'

export const getServerSideProps: GetServerSideProps<{
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}> = async ({ req }) => {
  const [assetStatuses, epochs] = await Promise.all([
    fetchAssetStatuses(),
    fetchEpochs(),
  ])
  return {
    props: {
      assetStatuses,
      epochs,
    },
  }
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assetStatuses, epochs }) => {
  const router = useRouter()

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
          <Deposit assetStatuses={assetStatuses} epochs={epochs} />
        ) : (
          <Borrow assetStatuses={assetStatuses} epochs={epochs} />
        )}
      </main>
    </div>
  )
}

export default Home
