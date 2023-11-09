import React from 'react'

import LightSvg from '../svg/light-svg'
import DarkSvg from '../svg/dark-svg'

const ThemeToggleButton = ({
  setTheme,
}: {
  setTheme: (theme: 'light' | 'dark') => void
}) => {
  return (
    <div className="flex rounded bg-gray-50 dark:bg-gray-800 w-16 h-8">
      <button
        className="flex flex-1 rounded items-center justify-center border-solid dark:border-none border-gray-950 border-[1.5px]"
        onClick={() => setTheme('light')}
      >
        <LightSvg />
      </button>
      <button
        className="flex flex-1 rounded items-center justify-center border-none dark:border-solid border-white border-[1.5px]"
        onClick={() => setTheme('dark')}
      >
        <DarkSvg />
      </button>
    </div>
  )
}

export default ThemeToggleButton
