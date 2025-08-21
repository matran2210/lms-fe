import { useLayoutContext } from '@/contexts/LayoutContext'
import { ReactNode, useEffect } from 'react'
import SAPPLoading from './SAPPLoading'

interface SAPPLoadingGlobalProps {
  loading: boolean
  children?: ReactNode
}

const SAPPLoadingGlobal = ({ children, loading }: SAPPLoadingGlobalProps) => {
  const { setIsLoadingGlobal } = useLayoutContext()

  useEffect(() => {
    setIsLoadingGlobal(loading)
  }, [loading])

  if (loading) {
    return <SAPPLoading />
  }

  return children
}

export default SAPPLoadingGlobal
