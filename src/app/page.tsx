'use client'

import SAPPLoading from '@/components/loading/SAPPLoading'
import { useAuthContext } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function Home() {
  const { user } = useAuthContext()

  useEffect(() => {
    // Use window.location.href to navigate and force reload the page
    if (user) window.location.href = '/meeting'
  }, [user])

  return <SAPPLoading />
}
