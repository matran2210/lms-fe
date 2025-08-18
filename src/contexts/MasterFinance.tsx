import { createContext, PropsWithChildren, useContext, useState } from 'react'

export interface MasterFinanceContext {
  isOpenCourseResource: boolean
  setIsOpenCourseResource: (isOpen: boolean) => void
}

const MasterFinanceContext = createContext<MasterFinanceContext | null>(null)

export const MasterFinanceProvider = ({ children }: PropsWithChildren) => {
  const [isOpenCourseResource, setIsOpenCourseResource] = useState(false)

  return (
    <MasterFinanceContext.Provider
      value={{ isOpenCourseResource, setIsOpenCourseResource }}
    >
      {children}
    </MasterFinanceContext.Provider>
  )
}

export const useMasterFinanceContext = () => {
  const context = useContext(MasterFinanceContext)
  if (!context) {
    throw new Error(
      'useMasterFinanceContext must be used within a MasterFinanceProvider',
    )
  }

  return context
}

export const withMasterFinanceProvider = <T extends object>(
  Component: React.ComponentType<T>,
) => {
  return function WithMasterFinanceProvider(props: T) {
    return (
      <MasterFinanceProvider>
        <Component {...props} />
      </MasterFinanceProvider>
    )
  }
}
