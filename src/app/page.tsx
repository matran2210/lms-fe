'use client'

import SAPPLoading from '@/components/loading/SAPPLoading'
import { HOME_LMS_URL } from '@/constants'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('HOME_LMS_URL', HOME_LMS_URL)
    router.push('/meeting')
  }, [])

  return <SAPPLoading />
}
