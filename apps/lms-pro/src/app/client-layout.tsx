'use client'
import { getCountUnRead, showNotification } from '@lms/contexts'
import { onMessageListener } from '@lms/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { NotificationAPI } from 'src/api/notification'
import { useAppDispatch } from 'src/redux/hook'

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // chỉ subscribe 1 lần khi mount
  useEffect(() => {
    if (!checkRouteCertificate) {
      try {
        dispatch(getCountUnRead(NotificationAPI))
      } catch (error) { }
    }
  }, [])
  return null
}

