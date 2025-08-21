'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

export interface LayoutContext {
  isShowHeader: boolean
  setIsShowHeader: Dispatch<SetStateAction<boolean>>
  isLoadingGlobal: boolean
  setIsLoadingGlobal: Dispatch<SetStateAction<boolean>>
}

export const LayoutContext = createContext<LayoutContext>({
  isShowHeader: true,
  setIsShowHeader: () => {},
  isLoadingGlobal: false,
  setIsLoadingGlobal: () => {},
})

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isShowHeader, setIsShowHeader] = useState(true)
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false)

  return (
    <LayoutContext.Provider
      value={{
        isShowHeader,
        setIsShowHeader,
        isLoadingGlobal,
        setIsLoadingGlobal,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}
