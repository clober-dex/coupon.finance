import React, { SVGProps, useCallback, useState } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'

import Slider from '../components/slider'
import NumberInput from '../components/number-input'

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
  { date: '24-06-01', profit: '102.37' },
  { date: '24-12-31', profit: '102.37' },
  { date: '25-06-01', profit: '102.37' },
  { date: '25-12-31', profit: '102.37' },
]
const Deposit: NextPage = () => {
  const [selected, _setSelected] = useState(0)
  const [value, setValue] = useState('')

  const router = useRouter()

  const setSelected = useCallback(
    (value: number) => {
      _setSelected(value === selected ? value - 1 : value)
    },
    [selected],
  )
  return (
    <div className="flex flex-1">
      <Head>
        <title>Deposit ETH</title>
        <meta
          content="Cash in the coupons on your assets. The only liquidity protocol that enables a 100% utilization rate."
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex flex-1 flex-col w-[1080px]">
          <button
            className="flex w-full font-bold text-2xl gap-3 mt-24"
            onClick={() => router.back()}
          >
            <Arrow />
            Deposit
            <div className="flex gap-2">
              <img alt="ETH" className="w-8 h-8" />
              <div>ETH</div>
            </div>
          </button>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col shadow bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 w-[480px] gap-8">
              <div className="flex flex-col gap-4">
                <div className="font-bold text-lg">
                  How much would you like to deposit?
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
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3">
                      <img alt="ETH" className="w-5 h-5" />
                      <div>ETH</div>
                    </div>
                    <div className="flex text-sm gap-2">
                      <div className="text-gray-500">Available</div>
                      <div>2.1839</div>
                      <button className="text-green-500">MAX</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-lg">
                    Select expiration date.
                  </div>
                  <div className="text-gray-500 text-sm">
                    The longer you deposit, the more interest you earn!
                  </div>
                </div>
                <div className="flex flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="px-6 mb-2">
                    <Slider value={selected} onValueChange={setSelected} />
                  </div>
                  <div className="flex justify-between">
                    {dummy.map(({ date, profit }, i) => (
                      <button
                        key={i}
                        className="flex flex-col items-center gap-2 w-[72px]"
                        onClick={() => setSelected(i + 1)}
                      >
                        <div className="text-sm">{date}</div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            selected === i + 1
                              ? 'bg-gray-100 dark:bg-white dark:bg-opacity-10'
                              : selected <= i + 1
                              ? 'bg-green-500 text-green-500 bg-opacity-10'
                              : 'bg-red-500 text-red-500 bg-opacity-10'
                          }`}
                        >
                          {selected <= i + 1 ? `+${profit}` : `-${profit}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex px-3 py-1.5 bg-gray-100 dark:bg-gray-800 w-fit rounded font-bold text-sm gap-2">
                  <span className="text-gray-400">APY</span>
                  <div className="text-gray-800 dark:text-white">3.15%</div>
                </div>
              </div>
              <div className="flex flex-col p-4 border-solid border-[1.5px] border-gray-200 dark:border-gray-700 rounded-lg gap-3">
                <div>
                  <label className="font-bold text-lg">
                    Your interest payout will be
                  </label>
                </div>
                <CountUp
                  end={dummy
                    .slice(0, selected)
                    .reduce((acc, { profit }) => acc + +profit, 0)}
                  suffix=" ETH"
                  className={`flex gap-2${
                    selected === 0 ? 'text-gray-400' : ''
                  } text-xl`}
                  preserveValue
                />
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

export default Deposit
