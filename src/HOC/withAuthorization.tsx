import { useEffect } from 'react'
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

        // useEffect(() => {
        //   if (!userType) return

        //   if (router.pathname === '/') {
        //     if (userType === UserType.TEACHER) router.push('/teachers')
        //     else if (userType === UserType.STUDENT) router.push('/courses')
        //   } else if (!allowedRoles.includes(userType)) {
        //     router.replace('/404')
        //   }

        // }, [router.pathname, userType])

        // if (!userType || !allowedRoles.includes(userType)) return null

        return <WrappedComponent {...props} />
      }

      Wrapper.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
      return Wrapper
    }

export default withAuthorization
