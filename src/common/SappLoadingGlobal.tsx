import React, { ReactNode } from 'react'
import SappLoading from './SappLoading'

interface IProps {
  loading: boolean
  children: ReactNode
}
const SappLoadingGlobal = ({ children, loading }: IProps) => {
  return <>{loading ? <SappLoading /> : <>{children}</>}</>
}

export default SappLoadingGlobal
