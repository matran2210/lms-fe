'use client'

import SAPPLoadingGlobal from '@/components/loading/SAPPLoadingGlobal'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/meeting')
  }, [])

  return <SAPPLoadingGlobal loading={true} />
}
