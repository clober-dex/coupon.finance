import React, { useCallback, useEffect } from 'react'

type ThemeContext = {
  setTheme: (theme: 'light' | 'dark') => void
}

const Context = React.createContext<ThemeContext>({
  setTheme: (_) => _,
})

export const ThemeProvider = ({ children }: React.PropsWithChildren<{}>) => {
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem('theme')
    }
  }, [])

  return <Context.Provider value={{ setTheme }}>{children}</Context.Provider>
}

export const useThemeContext = () => React.useContext(Context) as ThemeContext
