'use client'
import { useFeature, userReducer, UserType } from '@lms/contexts'
import { useEffect, useState } from 'react'

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
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '4px solid #FFB700',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
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
