import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface Context {
  isOpenAddModal: boolean
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>
  isOpenEditModal: boolean
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>
  isOpenDeleteModal: boolean
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  isOpenViewModal: boolean
  setIsOpenViewModal: React.Dispatch<React.SetStateAction<boolean>>
  isReFetch: boolean
  setIsReFetch: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestContext = createContext<Context | null>(null)

export const RequestProvider = (props: PropsWithChildren) => {
  const [isOpenAddModal, setOpenAddModal] = useState(false)
  const [isOpenEditModal, setOpenEditModal] = useState(false)
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false)
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [isReFetch, setIsReFetch] = useState(false)
  return (
    <RequestContext.Provider
      value={{
        isOpenAddModal,
        setOpenAddModal,
        isOpenEditModal,
        setOpenEditModal,
        isOpenDeleteModal,
        setOpenDeleteModal,
        isOpenViewModal,
        setIsOpenViewModal,
        isReFetch,
        setIsReFetch,
      }}
      {...props}
    />
  )
}

export const useRequestContext = () => {
  const context = useContext(RequestContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
