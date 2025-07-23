import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface Context {
  isVisibleGotoModal: boolean
  setVisibleGotoModal: React.Dispatch<React.SetStateAction<boolean>>
  isVisibleRedirectModal: boolean
  setVisibleRedirectModal: React.Dispatch<React.SetStateAction<boolean>>
}

const StaticModalContext = createContext<Context | null>(null)

export const StaticModalProvider = (props: PropsWithChildren) => {
  const [isVisibleGotoModal, setVisibleGotoModal] = useState(true)
  const [isVisibleRedirectModal, setVisibleRedirectModal] = useState(false)
  return (
    <StaticModalContext.Provider
      value={{
        isVisibleGotoModal,
        setVisibleGotoModal,
        isVisibleRedirectModal,
        setVisibleRedirectModal,
      }}
      {...props}
    />
  )
}

export const useStaticModalContext = () => {
  const context = useContext(StaticModalContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
