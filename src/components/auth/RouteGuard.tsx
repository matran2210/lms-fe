import { CERTIFICATE_DETAIL } from '@utils/constants'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ENTRANCE_TEST_RESULT, PageLink } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getMe, userReducer } from 'src/redux/slice/User/User'

interface IProps {
  children: JSX.Element
}

export const RouteGuard = ({ children }: IProps) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const dispatch = useAppDispatch()
  const userSlice = useAppSelector(userReducer)
  useEffect(() => {
    // on initial load - run auth check
    callGetMe()
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
    if (
      userSlice.user.id ||
      [CERTIFICATE_DETAIL, ENTRANCE_TEST_RESULT].includes(router.pathname)
    ) {
      setAuthorized(true)
      return
    }

    try {
      await dispatch(getMe()).unwrap()
      setAuthorized(true)
    } catch (error) {}
  }

  /**
   * @description Check if the current pathname is '/' redirect to '/dashboard'
   */
  useEffect(() => {
    // Check if the current pathname is '/'
    if (router.pathname === '/') {
      // Redirect to '/courses'
      router.replace(PageLink.COURSES)
    }
  })

  return authorized ? children : <></>
}
