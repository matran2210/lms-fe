'use client'
import { getCountUnRead, showNotification, useAppDispatch } from '@lms/contexts'
import { usePathname } from 'next/navigation'
import { onMessageListener } from '@lms/utils'
import { useEffect, useMemo } from 'react'
export default function ClientLayout() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const checkRouteCertificate = useMemo(() => {
    const path = pathname as string

    return (
      /^\/entrance-test\/test-result\/[^/]+$/.test(path) ||
      /^\/entrance-test\/table-result\/[^/]+$/.test(path) ||
      /^\/certificates\/[^/]+$/.test(path)
    )
  }, [pathname])
  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch(showNotification())
    })
  })
  getCountUnRead
  return null
}
