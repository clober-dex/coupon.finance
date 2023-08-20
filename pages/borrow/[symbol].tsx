import React, { SVGProps, useCallback, useMemo, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Slider from '../../components/slider'
import NumberInput from '../../components/number-input'
import { CURRENCY_MAP } from '../../utils/currency'

const Arrow = (props: SVGProps<any>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M27 16L6 16"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="round"
      className="stroke-gray-950 dark:stroke-white"
    />
    <path
      d="M14 7L5 16L14 25"
      strokeWidth="2.5"
      strokeLinecap="square"
      className="stroke-gray-950 dark:stroke-white"
    />
  </svg>
)

const dummy = [
  { date: '24-06-30', profit: '102.37' },
  { date: '24-12-31', profit: '102.37' },
  { date: '25-06-30', profit: '102.37' },
  { date: '25-12-31', profit: '102.37' },
]
const Borrow: NextPage = () => {
  const [selected, _setSelected] = useState(0)
  const [value, setValue] = useState('')

  const router = useRouter()

  const currency = useMemo(
    () =>
      CURRENCY_MAP[router.isReady ? (router.query.symbol as string) : 'USDC'],
    [router.isReady, router.query.symbol],
  )

  const setSelected = useCallback(
    (value: number) => {
      _setSelected(value === selected ? value - 1 : value)
    },
    [selected],
  )
  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {currency.symbol}</title>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.svg" rel="icon" />
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex flex-1 flex-col w-[1080px]">
          <button
            className="flex w-full font-bold text-2xl gap-3 mt-24"
            onClick={() => router.back()}
          >
            <Arrow />
            Borrow
            <div className="flex gap-2">
              <img
                src={currency.logo}
                alt={currency.name}
                className="w-8 h-8"
              />
              <div>{currency.symbol}</div>
            </div>
          </button>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col shadow bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 w-[480px] gap-8">
              <div className="flex flex-col gap-4">
                <div className="font-bold text-lg">
                  How much collateral would you like to add?
                </div>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex flex-col flex-1 justify-between gap-2">
                    <NumberInput
                      className="text-2xl placeholder-gray-400 outline-none bg-transparent"
                      value={value}
                      onValueChange={setValue}
                      placeholder="0.0000"
                    />
                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                      ~$0.0000
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                      <img
                        src={currency.logo}
                        alt={currency.name}
                        className="w-5 h-5"
                      />
                      <div>{currency.symbol}</div>
                    </div>
                    <div className="flex text-sm gap-2">
                      <div className="text-gray-500">Available</div>
                      <div>2.1839</div>
                      <button className="text-green-500">MAX</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="font-bold text-lg">
                  How much would you like to borrow?
                </div>
                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex flex-col flex-1 justify-between gap-2">
                    <NumberInput
                      className="text-2xl placeholder-gray-400 outline-none bg-transparent"
                      value={value}
                      onValueChange={setValue}
                      placeholder="0.0000"
                    />
                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                      ~$0.0000
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                      <img
                        src={currency.logo}
                        alt={currency.name}
                        className="w-5 h-5"
                      />
                      <div>{currency.symbol}</div>
                    </div>
                    <div className="flex text-sm gap-2">
                      <div className="text-gray-500">Available</div>
                      <div>2.1839</div>
                      <button className="text-green-500">MAX</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-lg mb-4">
                  Select expiration date.
                </div>
                <div className="flex flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="px-6 mb-2">
                    <Slider value={selected} onValueChange={setSelected} />
                  </div>
                  <div className="flex justify-between">
                    {dummy.map(({ date }, i) => (
                      <button
                        key={i}
                        className="flex flex-col items-center gap-2 w-[72px]"
                        onClick={() => setSelected(i + 1)}
                      >
                        <div className="text-sm">{date}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex w-fit text-sm gap-2">
                    <span className="text-gray-500">APY</span>
                    <div className="flex gap-1">
                      <div className="text-gray-800 dark:text-white">3.15%</div>
                      <div className="text-gray-400">
                        (10.1234 {currency.symbol} in interest)
                      </div>
                    </div>
                  </div>
                  <div className="flex w-fit text-sm gap-2">
                    <span className="text-gray-500">LTV</span>
                    <div className="text-yellow-500">15.24%</div>
                  </div>
                </div>
              </div>
              <button
                disabled={true}
                className="font-bold text-xl disabled:bg-gray-100 dark:disabled:bg-gray-800 h-16 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Borrow
