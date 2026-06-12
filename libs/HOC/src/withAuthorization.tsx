'use client'
import { useFeature, userReducer, UserType } from '@lms/contexts'
import { useEffect, useState } from 'react'
import { SappLoadingGlobal } from '../../ui'

const withAuthorization =
  <P extends object>(allowedRoles: string[]) =>
    (WrappedComponent: React.ComponentType<P>) => {
      const Wrapper = (props: P) => {
        const { pathname, router, useAppSelector, pageLink } = useFeature()
        const userType = useAppSelector?.(userReducer).user.type
        const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
          const timer = setTimeout(() => {
            setIsLoading(false)
          }, 100)
          return () => clearTimeout(timer)
        }, [])

        useEffect(() => {
          if (isLoading) return

          if (!userType) return // Chưa có userType, không làm gì

          if (pathname === '/') {
            if (userType === UserType.TEACHER) router.push(pageLink.MY_CALENDAR)
            else if (userType === UserType.STUDENT) router.push(pageLink.COURSES)
          } else if (!allowedRoles.includes(userType)) {
            router.replace(pageLink.COURSES)
          }
        }, [pathname, userType, isLoading])

        // Đang init hoặc chờ userType → show spinner thay vì màn trắng
        if (isLoading || !userType) {
          return (
            <SappLoadingGlobal loading>
              <></>
            </SappLoadingGlobal>
          )
        }

        // Nếu userType không hợp lệ, không render component
        if (!allowedRoles.includes(userType)) return null

        return <WrappedComponent {...props} />
      }

      Wrapper.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
      return Wrapper
    }

export default withAuthorization
