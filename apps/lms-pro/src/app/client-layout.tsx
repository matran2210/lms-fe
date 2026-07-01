'use client'
import { getCountUnRead, showNotification } from '@lms/contexts'
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
    if (checkRouteCertificate) return

    let isBootstrapped = false

    const bootstrapNotifications = async () => {
      if (isBootstrapped) return
      isBootstrapped = true

      try {
        const { onMessageListener } = await import('@lms/utils/firebase')

        dispatch(getCountUnRead(NotificationAPI))
        onMessageListener().then(() => {
          dispatch(showNotification())
        })
      } catch {
        // Ignore notification bootstrap failures on initial page load.
      }
    }

    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

    for (const eventName of events) {
      window.addEventListener(eventName, bootstrapNotifications, {
        once: true,
        passive: true,
      })
    }

    return () => {
      for (const eventName of events) {
        window.removeEventListener(eventName, bootstrapNotifications)
      }
    }
  }, [checkRouteCertificate, dispatch])

  return null
}

