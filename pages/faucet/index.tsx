import { NextPage } from 'next'
import Head from 'next/head'
import React, { useCallback } from 'react'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'
import { useAccount, useQuery, useQueryClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { arbitrumGoerli } from 'wagmi/chains'
import Image from 'next/image'

export const FAUCET_AMOUNTS: {
  symbol: string
  name: string
  amount: number
}[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum (once per address)',
    amount: 0.01,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    amount: 1,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    amount: 10000,
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    amount: 10000,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    amount: 10000,
  },
]

const FaucetForm = () => {
  const queryClient = useQueryClient()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { address } = useAccount()
  const publicClient = createPublicClient({
    chain: arbitrumGoerli,
    transport: http(),
  })

  const { data: received } = useQuery(['received', address], async () => {
    if (!address) {
      return false
    }
    const data = await publicClient.readContract({
      address: '0x7Eb217546baa755E3e8561B0460c88e250D97Ad7',
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'isFaucet',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'isFaucet',
      args: [address],
    })
    return data
  })

  const submit = useCallback(
    async (gReCaptchaToken: any) => {
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

      alert('Waiting for transaction to be submitted...')

      if (response.status === 200) {
        const { txHash } = await response.json()
        if (txHash) {
          window.open(`https://goerli.arbiscan.io/tx/${txHash}`, '_blank')
        } else {
          alert('Something went wrong. Please contact the devs.')
        }
      }
    },
    [address],
  )

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault()
      if (!executeRecaptcha) {
        return
      }
      const gReCaptchaToken = await executeRecaptcha('enquiryFormSubmit')
      await submit(gReCaptchaToken)
      await queryClient.invalidateQueries(['received'])
    },
    [executeRecaptcha, queryClient, submit],
  )

  return (
    <form
      className="faucet-form flex flex-col gap-4"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <div className="font-bold text-base sm:text-lg">
          {address
            ? 'Request test tokens'
            : 'Connect your wallet to get test tokens'}
        </div>
        <div className="flex flex-col w-full gap-1">
          {FAUCET_AMOUNTS.map((asset, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white dark:bg-gray-800 px-3 py-2 text-sm sm:text-base rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 relative">
                  <Image
                    src={`/assets/icons/icon-${asset.symbol.toLowerCase()}.svg`}
                    alt={asset.symbol}
                    fill
                  />
                </div>
                <div>{asset.name}</div>
              </div>
              <div>
                {asset.amount} {asset.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={!address || (received ?? true)}
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
      >
        {received ? 'Already received' : 'Request Tokens'}
      </button>
    </form>
  )
}

const Faucet: NextPage = () => {
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
          <title>Faucet</title>
        </Head>

        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-col flex-1 items-center justify-center p-4 sm:p-0 gap-4">
              <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                <FaucetForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </GoogleReCaptchaProvider>
  )
}

export default Faucet
