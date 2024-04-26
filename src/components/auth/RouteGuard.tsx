import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  removeJwtToken,
  setCookieActToken,
  setCookieRefreshToken,
} from '@utils/index'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PUBLIC_PATHS, PageLink } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { apiURL } from 'src/redux/services/httpService'
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
    const accessToken = await AsyncStorage.getItem('accessToken')
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    if (!accessToken && !refreshToken && !PUBLIC_PATHS[path]) {
      setAuthorized(false)
      router.push(PageLink.AUTH_LOGIN)
    } else {
      setAuthorized(true)
    }
  }

  return authorized ? children : <></>
}
