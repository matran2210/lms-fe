import { getKeycloakInstance } from '@utils/helpers/keycloak'
import { getLocalStorgeActToken } from '@utils/index'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { getMe } from 'src/redux/slice/User/User'

interface IProps {
  children: JSX.Element
}

export const RouteGuard = ({ children }: IProps) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  const dispatch = useAppDispatch()
  useEffect(() => {
    // on initial load - run auth check
    authCheck()
    // on route change start - hide page content by setting
    // authorized to false
    // const hideContent = () => setAuthorized(true)
    // router.events.on('routeChangeStart', hideContent)

    // // on route change complete - run auth check
    // router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    // return () => {
    //   // router.events.off('routeChangeStart', hideContent)
    //   // router.events.off('routeChangeComplete', authCheck)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  const callGetMe = async () => {
    try {
      await dispatch(getMe()).unwrap()
    } catch (error) {}
  }

  const authCheck = async () => {
    await getKeycloakInstance()
    callGetMe().then(() => setAuthorized(true))
    // setAuthorized(true)
  }
  /**
   * @description Check if the current pathname is '/' redirect to '/dashboard'
   */
  useEffect(() => {
    // Check if the current pathname is '/'
    if (router.pathname === '/' && getLocalStorgeActToken()) {
      // Redirect to '/courses'
      router.replace(PageLink.COURSES)
    }
  })

  return authorized ? children : <></>
}
