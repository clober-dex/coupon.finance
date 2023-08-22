import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import ThemeToggle from './theme-toggle'

const Panel = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-black dark:bg-transparent bg-opacity-50 dark:bg-opacity-5 dark:backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-24">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-gray-950 py-3 shadow-xl">
                    <div className="px-3">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
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
                    <div className="flex flex-col text-gray-950 dark:text-white justify-center font-bold relative mb-6 flex-1 px-6 gap-4">
                      <a
                        target="_blank"
                        href="https://twitter.com/CouponFinance"
                        rel="noreferrer"
                      >
                        Twitter
                      </a>
                      <a
                        target="_blank"
                        href="https://discord.com/invite/clober"
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
                      <ThemeToggle />
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
