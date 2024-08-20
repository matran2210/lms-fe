import { RouteGuard } from '@components/auth/RouteGuard'
import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import LearningNotesList from '@components/mycourses/LearningNotesList'
import LearningResource from '@components/mycourses/LearningResource'
import '@fortune-sheet/react/dist/index.css'
import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { injectStore } from 'src/redux/services/httpService'
import {
  getCountUnRead,
  showNotification,
  hideNotification,
} from 'src/redux/slice/Notification/Notification'
import { onMessageListener } from 'src/utils/firebase'
import { store, wrapper } from '../redux/store'
import { ANIMATION, PageLink } from 'src/constants'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { getKeycloakInstance } from '../utils/helpers/keycloak'
import {
  getLocalStorgeRefreshToken,
  getLocalStorgeActToken,
  getActToken,
  pageview,
  setActToken,
  setRefreshToken,
} from '@utils/index'
import { CourseProvider } from '@contexts/index'
import { URL } from 'url'
import { io } from 'socket.io-client'
import { ICourseScore } from 'src/type'
import { PinnedNotifyProvider } from '@contexts/PinnedNotifyContext'
import PinnedNotifications from '@components/layout/PinnedNotifications'
import PopupCert from '@components/mycourses/PopupCert'
import Help from '@components/Help'
import BackToTop from '@components/BackToTop'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import initializeGA from '@utils/google-analytics'
import SappLoading from 'src/common/SappLoading'

type MyAppProps = AppProps & {
  Component: {
    layout?: String
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  injectStore(store)
  // const [show, setShow] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  // const gettingNotiUnread = useAppSelector(
  //   (state) => state.notificationReducer?.loading,
  // )
  const getNotiUnread = useAppSelector(
    (state) => state.notificationReducer?.total_records,
  )

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3000000, // Đặt thời gian stale tại đây, ví dụ: 30 giây (30000 miligiây)
      },
    },
  })

  // const { getPinnedData } = usePinnedNotifyContext()

  const excludedPaths = [
    PageLink.AUTH_LOGIN,
    PageLink.AUTH_CHANGE_PASSWORD,
    PageLink.AUTH_CHANGE_PASSWORD_SUCCESS,
    PageLink.AUTH_FORGOT_PASSWORD,
    PageLink.AUTH_FORGOT_PASSWORD_RECOVER,
  ]

  const coutNotificationsUnRead = async () => {
    const accessToken = getActToken()
    if (accessToken && excludedPaths.every((path) => router?.asPath !== path)) {
      try {
        await dispatch(getCountUnRead())
      } catch (error) {}
    }
  }

  useEffect(() => {
    const keycloak = getKeycloakInstance()
    const accessToken = getLocalStorgeActToken()
    const refreshToken = getLocalStorgeRefreshToken()

    if (keycloak) {
      keycloak
        .init({ onLoad: 'login-required' })
        .then((authenticated: boolean) => {
          if (authenticated) {
            if (!accessToken && !refreshToken) {
              setActToken(keycloak.token ?? '')
              setRefreshToken(keycloak.refreshToken ?? '')
            }
          }
          setLoading(false)
        })
        .catch((error: Error) => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch(showNotification())
    })
  })

  const handleOnChangePage = () => {
    // Đếm số lượng noti chưa đọc, nếu lớn hơn 0 thì hiển thị thông báo
    coutNotificationsUnRead()
  }

  useEffect(() => {
    handleOnChangePage()
  }, [router.pathname])

  useEffect(() => {
    if (getNotiUnread > 0) {
      dispatch(showNotification())
    } else {
      dispatch(hideNotification())
    }
  }, [getNotiUnread])

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

  /**
   * @description Sử dụng useEffect để thực hiện các tác vụ liên quan đến việc theo dõi thay đổi trong route của ứng dụng để check GA
   */
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageview(url as any)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Lấy token từ cokkieStorage (giả sử 'accessToken' là key lưu token)

  const [openCert, setOpenCert] = useState(false)

  let authToken = getActToken()

  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    if (authToken) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
        extraHeaders: {
          authorization: authToken,
        },
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [authToken]) // reconnect khi authToken thay đổi

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {})
      socket.on('disconnect', () => {})
    }
  }, [socket])

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ''
  const tagManagerArgs: TagManagerArgs = { gtmId }

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initializeGA()
      window.GA_INITIALIZED = true
    }
  }, [])

  const excludedPathsHelp = [
    '/test/[id]',
    '/case-study/[id]',
    '/certificates/[id]',
    '/case-study/result/[id]',
  ]

  const showHelp = !excludedPathsHelp.some((path) =>
    router.pathname.includes(path),
  )

  useEffect(() => {
    const container = document.getElementById('hubspot-conversations-iframe')
    const message = document.getElementById(
      'hubspot-messages-iframe-container',
    ) as HTMLElement
    if (container) {
      if (!showHelp) {
        container.classList.add('visible-icon')
        message.classList.add('visible-icon')
      } else {
        container.classList.remove('visible-icon')
        message.classList.remove('visible-icon')
      }
    }
  }, [showHelp])

  if (loading) {
    return <>{loading ? <SappLoading /> : <></>}</>
  }

  return (
    <main>
      <PinnedNotifyProvider>
        <CourseProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <SappConfirmDialogContainer />
            <RouteGuard>
              <>
                <PinnedNotifications />
                <Component {...pageProps} />
                {getActToken() && showHelp && (
                  <>
                    <BackToTop />
                    <Help showHelp={showHelp} />
                  </>
                )}
                <LearningNotesList />
                <PopupCert />
              </>
            </RouteGuard>
          </QueryClientProvider>
        </CourseProvider>
      </PinnedNotifyProvider>
    </main>
  )
}

export default wrapper.withRedux(MyApp)
