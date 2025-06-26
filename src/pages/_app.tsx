import BackToTop from '@components/BackToTop'
import Help from '@components/Help'
import { RouteGuard } from '@components/auth/RouteGuard'
import AntConfigProvider from '@components/base/Provider/AntConfigProvider'
import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import Metadata from '@components/common/Metadata'
import PinnedNotifications from '@components/layout/PinnedNotifications'
import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import LearningNotesList from '@components/mycourses/LearningNotesList'
import PopupCompletedCourse from '@components/mycourses/PopupCompletedCourse'
import { PinnedNotifyProvider } from '@contexts/PinnedNotifyContext'
import { SocketContext } from '@contexts/SocketContext'
import { CourseProvider } from '@contexts/index'
import '@fortune-sheet/react/dist/index.css'
import '@styles/globals.scss'
import { CERTIFICATE_DETAIL } from '@utils/constants'
import initializeGA from '@utils/google-analytics'
import { pageview } from '@utils/index'
import Aos from 'aos'
import 'aos/dist/aos.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { io } from 'socket.io-client'
import {
  ANIMATION,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
} from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { injectStore } from 'src/redux/services/httpService'
import {
  getCountUnRead,
  showNotification,
} from 'src/redux/slice/Notification/Notification'
import { onMessageListener } from 'src/utils/firebase'
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'
import { URL } from 'url'
import { store, wrapper } from '../redux/store'
import 'sapp-common-package/dist/index.css'
import 'preview-part/dist/index.css'

type MyAppProps = AppProps & {
  Component: {
    layout?: String
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  injectStore(store)

  const router = useRouter()
  const dispatch = useAppDispatch()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3000000,
        refetchOnWindowFocus: false,
        // Đặt thời gian stale tại đây, ví dụ: 30 giây (30000 miligiây)
      },
    },
  })

  // Check if URL contains '/teachers'
  const isTeacherPage = router.asPath.includes('/teachers')

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

  const [socket, setSocket] = useState<any>(null)
  const authenticationManager = new AuthenticationManager()
  useEffect(() => {
    const token = authenticationManager.getToken()
    if (token !== '') {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
        extraHeaders: {
          authorization: token,
        },
      })
      setSocket(newSocket)
      return () => {
        newSocket.disconnect()
      }
    }
  }, [authenticationManager]) // reconnect khi authToken thay đổi

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
    '/teachers',
  ]

  const showHelp =
    !excludedPathsHelp.some((path) => router.pathname.includes(path)) &&
    !isTeacherPage // Add condition to hide help on teacher pages

  // Handle HubSpot widget visibility based on URL
  useEffect(() => {
    const hideHubspotWidget = () => {
      // Target specific elements from the DOM structure we observed
      const container = document.getElementById(
        'hubspot-messages-iframe-container',
      )
      const chatFrame = document.getElementById('hubspot-messages-iframe')
      const widgetContainer = document.querySelector('.hs-shadow-container')

      if (isTeacherPage) {
        // Hide HubSpot chat widget on teacher pages
        if (container) {
          container.classList.add('visible-icon')
          // Add additional inline styles for redundancy
          container.style.display = 'none'
        }

        if (chatFrame) {
          chatFrame.style.display = 'none'
        }

        if (widgetContainer) {
          widgetContainer.classList.add('visible-icon')
        }

        // Add CSS rule to ensure it stays hidden
        const style = document.createElement('style')
        style.id = 'hubspot-hide-style'
        style.innerHTML = `
          #hubspot-messages-iframe-container, 
          #hubspot-messages-iframe,
          .hs-shadow-container { 
            display: none !important; 
            visibility: hidden !important; 
          }
        `
        // Only add if it doesn't exist already
        if (!document.getElementById('hubspot-hide-style')) {
          document.head.appendChild(style)
        }
      } else {
        // Remove the style tag if path doesn't contain '/teachers'
        const styleTag = document.getElementById('hubspot-hide-style')
        if (styleTag) {
          document.head.removeChild(styleTag)
        }

        // Only show if not in excluded paths
        if (showHelp) {
          if (container) {
            container.classList.remove('visible-icon')
            container.style.display = ''
          }

          if (chatFrame) {
            chatFrame.style.display = ''
          }

          if (widgetContainer) {
            widgetContainer.classList.remove('visible-icon')
          }
        }
      }
    }

    // Initial run
    hideHubspotWidget()

    // Set up an observer to handle dynamically loaded HubSpot elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // If HubSpot elements are dynamically added, hide them if needed
          hideHubspotWidget()
        }
      }
    })

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also listen for route changes
    const handleRouteChange = () => {
      setTimeout(hideHubspotWidget, 300) // Short delay to ensure DOM is updated
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      observer.disconnect()
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [isTeacherPage, router, showHelp])

  useEffect(() => {
    if (
      ![
        ENTRANCE_TEST_TABLE_RESULT,
        ENTRANCE_TEST_RESULT,
        CERTIFICATE_DETAIL,
      ].includes(router.pathname)
    ) {
      try {
        dispatch(getCountUnRead())
      } catch (error) {}
    }
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      // Lưu URL hiện tại vào localStorage trước khi đổi sang URL mới
      localStorage.setItem('previousUrl', router.asPath)
      if (
        router.asPath.includes('courses') &&
        !router.asPath.includes('your-answers-detail')
      ) {
        localStorage.setItem('previousCourseUrl', router.asPath)
      }
    }

    // Lắng nghe sự kiện chuyển route
    router.events.on('routeChangeStart', handleRouteChange)

    // Cleanup listener
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return (
    <main>
      <Metadata />
      <AntConfigProvider>
        <PinnedNotifyProvider>
          <CourseProvider>
            <QueryClientProvider client={queryClient}>
              <SocketContext.Provider value={socket}>
                <Toaster
                  toastOptions={{
                    style: {
                      maxWidth: '400px', // Tăng chiều rộng của toast
                    },
                  }}
                />
                <SappConfirmDialogContainer />
                <RouteGuard>
                  <>
                    <div className="relative">
                      <PinnedNotifications />
                      <CtaTrial />
                      <Component {...pageProps} />
                    </div>
                    <BackToTop />
                    <Help showHelp={showHelp} />
                    <LearningNotesList />
                    <PopupCompletedCourse />
                  </>
                </RouteGuard>
              </SocketContext.Provider>
            </QueryClientProvider>
          </CourseProvider>
        </PinnedNotifyProvider>
      </AntConfigProvider>
    </main>
  )
}

export default wrapper.withRedux(MyApp)
