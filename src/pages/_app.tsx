import BackToTop from '@components/BackToTop'
import Help from '@components/Help'
import { RouteGuard } from '@components/auth/RouteGuard'
import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import PinnedNotifications from '@components/layout/PinnedNotifications'
import LearningNotesList from '@components/mycourses/LearningNotesList'
import PopupCert from '@components/mycourses/PopupCert'
import { PinnedNotifyProvider } from '@contexts/PinnedNotifyContext'
import { SocketContext } from '@contexts/SocketContext'
import { CourseProvider } from '@contexts/index'
import '@fortune-sheet/react/dist/index.css'
import '@styles/globals.scss'
import initializeGA from '@utils/google-analytics'
import { getActToken, pageview } from '@utils/index'
import Aos from 'aos'
import 'aos/dist/aos.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { io } from 'socket.io-client'
import { ANIMATION, LOCAL_STORAGE_KEYS, SOCKET_EVENTS } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { injectStore } from 'src/redux/services/httpService'
import {
  getCountUnRead,
  showNotification,
} from 'src/redux/slice/Notification/Notification'
import { onMessageListener } from 'src/utils/firebase'
import { URL } from 'url'
import { store, wrapper } from '../redux/store'

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
  const [openLimit, setOpenLimit] = useState<boolean>(false)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3000000, // Đặt thời gian stale tại đây, ví dụ: 30 giây (30000 miligiây)
      },
    },
  })

  // const { getPinnedData } = usePinnedNotifyContext()

  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch(showNotification())
    })
  })

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

      socket?.on(SOCKET_EVENTS.NOTIFICATION_UNREAD, (data: any) => {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
          data.payload.data.unread,
        )
        window.dispatchEvent(new Event('storage'))
      })

      return () => {
        socket?.off(SOCKET_EVENTS.NOTIFICATION_UNREAD)
      }
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

  const accessToken = getActToken()
  useEffect(() => {
    if (accessToken) {
      try {
        dispatch(getCountUnRead())
      } catch (error) {}
    }
  }, [accessToken])

  return (
    <main>
      <PinnedNotifyProvider>
        <CourseProvider>
          <QueryClientProvider client={queryClient}>
            <SocketContext.Provider value={socket}>
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
            </SocketContext.Provider>
          </QueryClientProvider>
        </CourseProvider>
      </PinnedNotifyProvider>
    </main>
  )
}

export default wrapper.withRedux(MyApp)
