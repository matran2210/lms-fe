import {
  getLocalStorgeActToken,
  getLocalStorgeRefreshToken,
} from '@utils/index'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PUBLIC_PATHS, PageLink } from 'src/constants'
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
    authCheck(router.pathname)

    // on route change start - hide page content by setting
    // authorized to false
    const hideContent = () => setAuthorized(true)
    router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const authCheck = async (url: string) => {
    // redirect to login page if accessing a private page and
    // not logged in

    const path = url?.split('?')?.[0]
    const accessToken = getLocalStorgeActToken()
    const refreshToken = getLocalStorgeRefreshToken()
    if (
      !accessToken &&
      !refreshToken &&
      !PUBLIC_PATHS[path] &&
      router?.pathname !== '/certificates/[id]'
    ) {
      setAuthorized(false)
      router.push(PageLink.AUTH_LOGIN)
    } else {
      setAuthorized(true)
    }

    // Chặn vào login page khi đã đăng nhập
    const isLoginPage = window.location.pathname === PageLink.AUTH_LOGIN
    if (isLoginPage && accessToken) {
      try {
        await dispatch(getMe()).unwrap()
        router.push(PageLink.DASHBOARD)
      } catch (error) {}
    }
  }

  /**
   * @description Check if the current pathname is '/' redirect to '/dashboard'
   */
  useEffect(() => {
    // Check if the current pathname is '/'
    if (router.pathname === '/' && authorized) {
      // Redirect to '/dashboard'
      router.replace(PageLink.DASHBOARD)
    }
  }, []) // Empty dependency array ensures this effect runs only once on component mount

  return authorized ? children : <></>
}
