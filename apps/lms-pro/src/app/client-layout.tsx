"use client"
import { getCountUnRead, showNotification, useAppDispatch } from '@lms/contexts'
import { CERTIFICATE_DETAIL, ENTRANCE_TEST_RESULT, ENTRANCE_TEST_TABLE_RESULT } from '@lms/core'
import { usePathname } from 'next/navigation'
import { NotificationAPI } from './api/notification/route'
import { onMessageListener } from '@lms/utils'
import { useEffect } from 'react'
export default function ClientLayout() {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    useEffect(() => {
        onMessageListener().then((data: any) => {
            dispatch(showNotification())
        })
    })
    useEffect(() => {
        if (
            ![
                ENTRANCE_TEST_TABLE_RESULT,
                ENTRANCE_TEST_RESULT,
                CERTIFICATE_DETAIL,
            ].includes(pathname as string)
        ) {
            try {
                dispatch(getCountUnRead(NotificationAPI))
            } catch (error) { }
        }
    }, [])
    return null
}