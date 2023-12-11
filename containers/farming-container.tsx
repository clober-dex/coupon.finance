import React from 'react'

import { CouponSvg } from '../components/svg/coupon-svg'
import CurrencyAmountInput from '../components/input/currency-amount-input'
import { dummyCurrencies } from '../.storybook/dummy-data/currencies'
import { ActionButton } from '../components/button/action-button'

export const FarmingContainer = () => (
  <div className="flex flex-1 flex-col w-full md:w-[640px] lg:w-[960px] mt-8 md:mt-16 gap-4 lg:gap-16">
    <div className="flex flex-row justify-center lg:justify-start text-center lg:text-start lg:gap-[196px]">
      <div className="flex flex-col lg:gap-6">
        <h1 className="flex justify-center text-center lg:justify-start lg:text-start font-bold text-3xl lg:text-5xl lg:leading-[48px] mb-6">
          <p>
            <span className="block">Catch phrase</span>
            <span className="block">for farming page</span>
          </p>
        </h1>
        <h3 className="flex justify-center text-center lg:justify-start lg:text-start font-semibold text-gray-500 dark:text-gray-400">
          <p>
            <span className="block lg:inline">Deposit USDC to farm CPN. </span>
            <span className="hidden lg:inline">
              Some description about it.{' '}
            </span>
            <span className="block lg:hidden">
              If you’re curious about our tokenomics?
            </span>
            <span className="block lg:hidden">Check it out in our docs!</span>
            <span className="hidden lg:block">
              If you’re curious about our tokenomics? Check it out in our docs!
            </span>
          </p>
        </h3>
      </div>
      <CouponSvg className="w-0 h-0 lg:block lg:w-[224px] lg:h-[224px] shrink-0" />
    </div>
    <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-4 p-4">
      <div className="flex w-full p-4 lg:px-6 flex-col items-center gap-3 lg:gap-4 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="text-sm lg:text-lg text-gray-950 dark:text-white font-semibold">
          1) Deposit USDC
        </div>
        <div className="text-xs lg:text-sm text-center text-gray-950 dark:text-white">
          The more USDC you deposit, the more CPN you get!
        </div>
      </div>
      <div className="flex w-full p-4 lg:px-6 flex-col items-center gap-3 lg:gap-4 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="text-sm lg:text-lg text-gray-950 dark:text-white font-semibold">
          2) Withdraw it back
        </div>
        <div className="text-xs lg:text-sm text-center text-gray-950 dark:text-white">
          Deposit USDC for 6 months, then withdraw it back.
        </div>
      </div>
      <div className="flex w-full p-4 lg:px-6 flex-col items-center gap-3 lg:gap-4 bg-white dark:bg-gray-900 rounded-2xl">
        <div className="text-sm lg:text-lg text-gray-950 dark:text-white font-semibold">
          3) Earn CPN token
        </div>
        <div className="text-xs lg:text-sm text-center text-gray-950 dark:text-white">
          You can earn CPN token linearly during 18 months!
        </div>
      </div>
    </div>
    <div className="flex flex-col justify-center lg:justify-start text-center lg:text-start px-4">
      <h1 className="flex justify-center text-center lg:justify-start lg:text-start font-bold text-xl lg:leading-[48px] mb-6">
        <p>Phase 1</p>
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex w-full p-3 flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl">
          <div className="text-sm lg:text-xl font-semibold text-gray-500 dark:text-gray-400">
            Deposit Cap
          </div>
          <div className="flex flex-row gap-1 lg:gap-3 font-semibold">
            <span className="text-lg lg:text-xl">
              1,248,912 <span className="text-xs lg:text-base">USDC</span>
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-lg lg:text-xl">
              /
            </span>
            <span className="text-lg lg:text-xl">
              3,000,000 <span className="text-xs lg:text-base">USDC</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col p-4 lg:p-6 gap-8 bg-white dark:bg-gray-900 rounded-2xl">
          <div className="flex gap-8 sm:gap-14 items-start flex-col lg:flex-row w-full">
            <div className="flex flex-1 flex-col items-start gap-3 self-stretch">
              <div className="flex text-sm lg:text-lg font-semibold">
                How much USDC you’d like to deposit?
              </div>
              <CurrencyAmountInput
                currency={dummyCurrencies[0]}
                value={'0'}
                onValueChange={() => {}}
                availableAmount={0n}
              />
              <div className="text-start text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
                You can deposit from over 30,000 USDC.
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start gap-6 sm:gap-8 self-stretch">
              <div className="flex text-sm lg:text-lg font-semibold">
                Your position term will be...
              </div>
              Slider
              <div className="text-start text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
                For each epochs(total 7 epochs), coupons will be issued.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            <button
              className="flex px-6 py-4 flex-row justify-center items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              disabled={true}
              onClick={() => {}}
            >
              <span className="text-gray-400 font-semibold text-base sm:text-xl">
                You&apos;ll earn
              </span>{' '}
              <span className="text-green-500 font-semibold text-base sm:text-xl">
                123,123 CPN
              </span>
            </button>
            <ActionButton
              disabled={false}
              onClick={() => {}}
              text={'Confirm'}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)
