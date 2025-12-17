import MKTInApp from '@components/MKTInApp'
import Metadata from '@components/common/Metadata'
import '@fortune-sheet/react/dist/index.css'
import {
  CourseNoteProvider,
  CourseProvider,
  FeatureProvider,
  getCountUnRead,
  PinnedNotifyProvider,
  PreviousSectionRouteProvider,
  showNotification,
  SocketContext,
  store,
  useAppDispatch,
  wrapper,
} from '@lms/contexts'
import {
  ANIMATION,
  AppType,
  CERTIFICATE_DETAIL,
  ENTRANCE_TEST_RESULT,
  ENTRANCE_TEST_TABLE_RESULT,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
} from '@lms/core'
import { RouteGuard } from '@lms/feature-auth'
import { LearningNotesList, PopupCompletedCourse } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import '@lms/styles'
import {
  AntConfigProvider,
  BackToTop,
  Help,
  PinnedNotifications,
  SappConfirmDialogContainer,
} from '@lms/ui'
import { initializeGA, onMessageListener, pageview } from '@lms/utils'
import { ErrorBoundary } from '@sentry/nextjs'
import { fetcher } from '@services/requestV2'
import '@styles/index.scss'
import '@xyflow/react/dist/style.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import 'entrance-test-result-package/dist/index.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'preview-part/dist/index.css'
import 'quiz-result-package/dist/index.css'
import { useEffect, useState } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'sapp-common-package/dist/index.css'
import 'sapp-common-package/dist/sapp-editor.css'
import 'sapp-notification/dist/index.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { io } from 'socket.io-client'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from 'src/constants/menu-items'
import { PageLink } from 'src/constants/routers'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import UserApi from 'src/redux/services/User/user'
import { injectStore } from 'src/redux/services/httpService'
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'
import { URL } from 'url'
import { ActivityAPI } from './api/activity'
import { CaseStudyAPI } from './api/case-study'
import { ClassAPI } from './api/class'
import { CoursesAPI } from './api/courses'
import { EntranceTestAPI } from './api/entrance-test'
import { EventTestAPI } from './api/event-test'
import { NotificationAPI } from './api/notification'
import MyProfileAPI, { AuthAPI } from './api/profile'
import { QuestionAPI } from './api/question'
import { UploadAPI } from './api/upload'
import ErrorRedirectPage from './error-redirect'
import CalendarApi from './api/calendar'
import { TestServiceAPI } from './api/test-api'
dayjs.extend(utc)
dayjs.extend(weekday)

const showSupportWidget = [
  '/courses',
  '/entrance-test',
  '/calendar',
  '/exam_list',
  '/overview',
]

const activityPath = ['/courses/[id]/activity/[activityId]']
type MyAppProps = AppProps & {
  Component: {
    layout?: String
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  injectStore(store)

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isMobileView } = useTailwindBreakpoint()
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
  const isActivityPage = !activityPath.some((path) =>
    router.pathname.includes(path),
  )
  const showBackToTop = isMobileView ? isActivityPage : true

  const showHelp = showSupportWidget.includes(router.pathname) && !isTeacherPage // Add condition to hide help on teacher pages
  const showMKTInApp = showHelp && !isMobileView
  const hiddenChatbot = !showHelp
  // Handle HubSpot widget visibility based on URL
  useEffect(() => {
    const hideHubspotWidget = () => {
      // Target specific elements from the DOM structure we observed
      const container = document.getElementById(
        'hubspot-messages-iframe-container',
      )
      const chatFrame = document.getElementById('hubspot-messages-iframe')
      const widgetContainer = document.querySelector('.hs-shadow-container')

      if (hiddenChatbot) {
        // Hide HubSpot chat widget on teacher pages and other excluded paths
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
  }, [router, showHelp, hiddenChatbot])

  useEffect(() => {
    if (
      ![
        ENTRANCE_TEST_TABLE_RESULT,
        ENTRANCE_TEST_RESULT,
        CERTIFICATE_DETAIL,
      ].includes(router.pathname)
    ) {
      try {
        dispatch(getCountUnRead(NotificationAPI))
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
    <ErrorBoundary fallback={<ErrorRedirectPage />}>
      <main>
        <Metadata />
        <AntConfigProvider>
          <PinnedNotifyProvider
            router={router}
            api={{
              getPinnedNotifications: UserApi.getPinnedNotifications,
            }}
          >
            <FeatureProvider
              value={{
                courseApi: CoursesAPI,
                questionApi: QuestionAPI,
                uploadApi: UploadAPI,
                userApi: UserApi,
                notificationApi: NotificationAPI,
                authApi: AuthAPI,
                classApi: ClassAPI,
                activityApi: ActivityAPI,
                courseActivityApi: CourseActivityApi,
                caseStudyApi: CaseStudyAPI,
                entranceTestApi: EntranceTestAPI,
                eventTestApi: EventTestAPI,
                calendarApi: CalendarApi,
                myProfileApi: MyProfileAPI,
                submitQuizTest: TestServiceAPI.submitQuizTest,
                authManager: new AuthenticationManager(),
                pageLink: PageLink,
                menuItems: MENU_ITEMS,
                menuItemsEvent: MENU_ITEMS_EVENT,
                menuBottom: MENU_BOTTOM,
                router: router,
                fetcher: fetcher,
                videoUrl: process.env.NEXT_PUBLIC_VIDEO_URL as string,
                testServiceApi: TestServiceAPI,
              }}
            >
              <CourseProvider
                router={router}
                api={{
                  get: EventTestAPI.get,
                }}
              >
                <CourseNoteProvider router={router} api={CoursesAPI}>
                  <QueryClientProvider client={queryClient}>
                    <SocketContext.Provider value={socket}>
                      <PreviousSectionRouteProvider router={router}>
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
                              <Component {...pageProps} />
                            </div>
                            {showBackToTop && <BackToTop />}
                            <MKTInApp showMKTInApp={showMKTInApp} />
                            {showHelp && <div id="floating-btn-divider" />}
                            <Help showHelp={showHelp} />
                            <LearningNotesList appType={AppType.LMS_PRO} />
                            <PopupCompletedCourse />
                          </>
                        </RouteGuard>
                      </PreviousSectionRouteProvider>
                    </SocketContext.Provider>
                  </QueryClientProvider>
                </CourseNoteProvider>
              </CourseProvider>
            </FeatureProvider>
          </PinnedNotifyProvider>
        </AntConfigProvider>
      </main>
    </ErrorBoundary>
  )
}

export default wrapper.withRedux(MyApp)
