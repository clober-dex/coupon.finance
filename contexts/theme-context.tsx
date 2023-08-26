'use client'
import React, { useCallback, useEffect } from 'react'

type ThemeContext = {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const Context = React.createContext<ThemeContext>({
  theme: 'light',
  setTheme: (_) => _,
})

export const ThemeProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [theme, _setTheme] = React.useState<'light' | 'dark'>('light')
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      _setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      _setTheme('light')
    }
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      _setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('theme')
      _setTheme('light')
    }
  }, [])

  return (
    <Context.Provider value={{ theme, setTheme }}>{children}</Context.Provider>
  )
}

export const useThemeContext = () => React.useContext(Context) as ThemeContext
