import React from 'react'

import { useThemeContext } from '../contexts/theme-context'

import LightSvg from './svg/light-svg'
import DarkSvg from './svg/dark-svg'

const ThemeToggle = () => {
  const { setTheme } = useThemeContext()
  return (
    <div className="flex rounded bg-gray-100 dark:bg-gray-800 w-16 h-8">
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

export default ThemeToggle
