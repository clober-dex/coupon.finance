import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { NextRouter } from 'next/router'

import { ZIndices } from '../utils/z-indices'
import { ModeContext } from '../contexts/mode-context'

import ThemeToggleButton from './button/theme-toggle-button'

const Panel = ({
  open,
  setOpen,
  setTheme,
  router,
  selectedMode,
  onSelectedModeChange,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  router: NextRouter
  selectedMode: ModeContext['selectedMode']
  onSelectedModeChange: ModeContext['onSelectedModeChange']
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative ${ZIndices.panel}`}
        onClose={setOpen}
      >
        <div className="fixed inset-0 bg-black dark:bg-transparent bg-opacity-50 dark:bg-opacity-5 dark:backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-gray-950 shadow-xl">
                    <div className="flex items-center px-4 h-16 justify-end">
                      <div className="flex items-start">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-400 hover:text-gray-500 outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col text-gray-950 dark:text-white justify-center text-base font-bold relative mb-6 flex-1 pl-6 pr-16 gap-8">
                      <div className="flex flex-col gap-4 items-start w-[192px]">
                        <button
                          disabled={selectedMode === 'deposit'}
                          onClick={async () => {
                            setOpen(false)
                            await onSelectedModeChange('deposit')
                          }}
                        >
                          Earn
                        </button>
                        <button
                          disabled={router.query.mode === 'borrow'}
                          onClick={async () => {
                            setOpen(false)
                            await onSelectedModeChange('borrow')
                          }}
                        >
                          Strategies
                        </button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="192"
                          height="2"
                          viewBox="0 0 192 2"
                          fill="none"
                        >
                          <path
                            d="M0 1H192"
                            strokeWidth="1.5"
                            className="stroke-gray-300 dark:stroke-gray-600"
                          />
                        </svg>
                        <a
                          target="_blank"
                          href="https://twitter.com/CouponFinance"
                          rel="noreferrer"
                        >
                          Twitter
                        </a>
                        <a
                          target="_blank"
                          href="https://discord.gg/clober-coupon-finance"
                          rel="noreferrer"
                        >
                          Discord
                        </a>
                        <a
                          target="_blank"
                          href="https://docs.coupon.finance/"
                          rel="noreferrer"
                        >
                          Docs
                        </a>
                        <a
                          target="_blank"
                          href="https://t.me/CouponFinance"
                          rel="noreferrer"
                        >
                          Telegram
                        </a>
                      </div>
                      <ThemeToggleButton setTheme={setTheme} />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Panel
