import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'
import { getAddress } from 'viem'

import { useTransactionContext } from '../../contexts/transaction-context'
import { Asset } from '../../model/asset'
import { fetchAssets } from '../../api/asset'

export const FAUCET_AMOUNTS: { [symbol: string]: number } = {
  ETH: 0.1,
  USDC: 100,
  DAI: 100,
  USDT: 100,
  WBTC: 0.1,
}

const FaucetForm = ({ assets }: { assets: Asset[] }) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { setConfirmation } = useTransactionContext()
  const [address, setAddress] = useState('')
  const submitEnquiryForm = useCallback(
    async (gReCaptchaToken: any) => {
      setConfirmation({
        title: 'Faucet',
        body: 'You will receive test tokens in a few seconds.',
        fields: assets.map((asset) => ({
          currency: asset.underlying,
          label: asset.underlying.symbol,
          value: FAUCET_AMOUNTS[asset.underlying.symbol].toString(),
        })),
      })

      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          gRecaptchaToken: gReCaptchaToken,
        }),
      })

      if (response.status === 200) {
        const { txHash } = await response.json()
        window.open(`http://dev-rpc.coupon.finance:4000/tx/${txHash}`, '_blank')
        setConfirmation(undefined)
      }
    },
    [address, assets, setConfirmation],
  )

  const handleSumitForm = useCallback(
    (e: any) => {
      e.preventDefault()
      if (!executeRecaptcha) {
        return
      }
      executeRecaptcha('enquiryFormSubmit').then((gReCaptchaToken) => {
        submitEnquiryForm(gReCaptchaToken)
      })
    },
    [executeRecaptcha, submitEnquiryForm],
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const address = event.target.value.match(
        /^0x[a-fA-F0-9]{40}$|^0x[a-fA-F0-9]{42}$/,
      )
      if (address && address[0]) {
        setAddress(getAddress(address[0]))
      }
    },
    [setAddress],
  )
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
      className="faucet-form"
      method="POST"
      onSubmit={handleSumitForm}
    >
      <div className="flex flex-col gap-4">
        <div className="font-bold text-sm sm:text-lg">
          Write your address to get test tokens
        </div>
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg p-3 gap-2">
          <div className="flex flex-1 justify-between gap-2">
            <input
              className="flex-1 text-xl sm:text-2xl placeholder-gray-400 outline-none bg-transparent"
              value={address}
              name="address"
              type="text"
              onChange={handleChange}
              placeholder="0x0000000000000000000000000000000000000000"
              required={true}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={address.length === 0}
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
      >
        Faucet
      </button>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<{
  assets: Asset[]
}> = async () => {
  const assets = await fetchAssets()
  return {
    props: { assets },
  }
}

const Faucet: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assets }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lce3uMnAAAAALuDAg71x3qku80Avq7xl_y8O2OH"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <div className="flex flex-1">
        <Head>
          <title>Coupon Finance</title>
          <meta
            content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
            name="description"
          />
          <link href="/favicon.svg" rel="icon" />
        </Head>

        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-1 sm:items-center justify-center">
              <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                <FaucetForm assets={assets} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </GoogleReCaptchaProvider>
  )
}

export default Faucet
