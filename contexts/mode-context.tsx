import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

export type ModeContext = {
  selectedMode: 'deposit' | 'borrow' | 'banker'
  onSelectedModeChange: (
    selectedMode: 'deposit' | 'borrow' | 'banker',
  ) => Promise<void>
}

const Context = React.createContext<ModeContext>({
  selectedMode: 'deposit',
  onSelectedModeChange: () => Promise.resolve(),
})

export const ModeProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const selectedMode = useMemo(() => {
    if (router.route.includes('banker')) {
      return 'banker'
    }
    if (router.query.mode === 'deposit' || router.route.includes('deposit')) {
      return 'deposit'
    }
    if (
      router.query.mode === 'borrow' ||
      router.route.includes('borrow') ||
      router.query.mode === 'leverage' ||
      router.route.includes('leverage')
    ) {
      return 'borrow'
    }
    return 'deposit'
  }, [router.query.mode, router.route])

  const onSelectedModeChange = useCallback(
    async (selectedMode: ModeContext['selectedMode']) => {
      await router.replace(`/?mode=${selectedMode}`, undefined, {
        shallow: true,
      })
    },
    [router],
  )

  return (
    <Context.Provider
      value={{
        selectedMode,
        onSelectedModeChange,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useModeContext = () => React.useContext(Context) as ModeContext
