'use client'

import React, { useEffect, useState } from 'react'

export const ClientComponent = ({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated ? <div {...props}>{children}</div> : <></>
}
