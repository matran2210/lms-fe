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
        // Đợi một chút để Redux store được hydrate
        const timer = setTimeout(() => {
          setIsLoading(false)
        }, 100)

        return () => clearTimeout(timer)
      }, [])

      useEffect(() => {
        if (isLoading || !userType) return

        if (router.pathname === '/') {
          if (userType === UserType.TEACHER) router.push('/teachers')
          else if (userType === UserType.STUDENT) router.push('/courses')
        } else if (!allowedRoles.includes(userType)) {
          router.replace('/404')
        }
      }, [router.pathname, userType, isLoading])

      // Hiển thị loading hoặc null khi đang load
      if (isLoading || !userType) return null

      // Kiểm tra lại một lần nữa trước khi render
      if (!allowedRoles.includes(userType)) return null

      return <WrappedComponent {...props} />
    }

    Wrapper.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
    return Wrapper
  }

export default withAuthorization
