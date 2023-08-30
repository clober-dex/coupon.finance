import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DateSelect({
  dates,
  value,
  onValueChange,
}: {
  dates: string[]
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Listbox value={value} onChange={onValueChange}>
      {({ open }) => (
        <>
          <div className="relative w-40">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white dark:bg-gray-800 py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6">
              <span className="block truncate">{value}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400 dark:text-white"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {dates.map((date, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-green-500' : '',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={date}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          )}
                        >
                          {date}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active
                                ? 'text-gray-900 dark:text-white'
                                : 'text-green-500',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
