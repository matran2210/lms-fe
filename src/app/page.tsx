'use client'

import SAPPLoading from '@/components/loading/SAPPLoading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/meeting')
  }, [])

  return <SAPPLoading />
}
