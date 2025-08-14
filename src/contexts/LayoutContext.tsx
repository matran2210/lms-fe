'use client'

import { createContext, useContext, useState } from 'react'

export interface LayoutContext {
  isShowHeader: boolean
  setIsShowHeader: (isShowHeader: boolean) => void
}

export const LayoutContext = createContext<LayoutContext>({
  isShowHeader: true,
  setIsShowHeader: () => {},
})

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isShowHeader, setIsShowHeader] = useState(true)

  return <LayoutContext.Provider value={{ isShowHeader, setIsShowHeader }}>{children}</LayoutContext.Provider>
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}
