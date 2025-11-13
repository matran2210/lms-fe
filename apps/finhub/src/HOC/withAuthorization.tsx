import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { UserType } from 'src/redux/types/User/urser'

const withAuthorization =
  <P extends object>(allowedRoles: string[]) =>
  (WrappedComponent: React.ComponentType<P>) => {
    const Wrapper = (props: P) => {
      const router = useRouter()
      const userType = useAppSelector(userReducer).user.type
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

        if (router.pathname === '/') {
          if (userType === UserType.TEACHER) router.push('/teachers')
          else if (userType === UserType.STUDENT) router.push('/short-course')
        } else if (!allowedRoles.includes(userType)) {
          router.replace('/short-course')
        }
      }, [router.pathname, userType, isLoading])

      // Chỉ loading khi đang loading
      if (isLoading) return null

      // Nếu chưa có userType, có thể show loading hoặc null
      if (!userType) return null

      // Nếu userType không hợp lệ, không render component
      if (!allowedRoles.includes(userType)) return null

      return <WrappedComponent {...props} />
    }

    Wrapper.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return Wrapper
  }

export default withAuthorization
