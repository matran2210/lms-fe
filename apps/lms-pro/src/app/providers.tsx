// app/providers.tsx
'use client'

import MKTInApp from '@components/MKTInApp'
import '@fortune-sheet/react/dist/index.css'
import {
  CourseNoteProvider,
  CourseProvider,
  FeatureProvider,
  PinnedNotifyProvider,
  PreviousSectionRouteProvider,
  SocketContext,
  store,
} from '@lms/contexts'
import {
  ANIMATION,
  AppType,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
} from '@lms/core'
import { RouteGuard } from '@lms/feature-auth'
import { LearningNotesList, PopupCompletedCourse } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  AntConfigProvider,
  BackToTop,
  Help,
  PinnedNotifications,
  SappConfirmDialogContainer,
} from '@lms/ui'
import { initializeGA, pageview } from '@lms/utils'
import { fetcher } from '@services/requestV2'
import { App as AntdApp, ConfigProvider } from 'antd'
import Aos from 'aos'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { io } from 'socket.io-client'
import { ActivityAPI } from 'src/api/activity'
import CalendarApi from 'src/api/calendar'
import { uploadImageToLinkedIn } from 'src/api/certificate'
import { ClassAPI } from 'src/api/class'
import { CoursesAPI } from 'src/api/courses'
import { DashboardAPI } from 'src/api/dashboard'
import { EntranceTestAPI } from 'src/api/entrance-test'
import { EventTestAPI } from 'src/api/event-test'
import { NotificationAPI } from 'src/api/notification'
import MyProfileAPI, { AuthAPI } from 'src/api/profile'
import { QuestionAPI } from 'src/api/question'
import { TestServiceAPI } from 'src/api/test-api'
import { UploadAPI } from 'src/api/upload'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from 'src/constants/menu-items'
import { PageLink } from 'src/constants/routers'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import UserApi from 'src/redux/services/User/user'
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'

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
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const query = useSearchParams()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3000000,
        refetchOnWindowFocus: false,
        // Đặt thời gian stale tại đây, ví dụ: 30 giây (30000 miligiây)
      },
    },
  })
  const [socket, setSocket] = useState<any>(null)
  const authenticationManager = new AuthenticationManager()

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ''
  const tagManagerArgs: TagManagerArgs = { gtmId }

  const { isMobileView } = useTailwindBreakpoint()

  // Check if URL contains '/teachers'
  const isTeacherPage = pathname?.includes('/teachers')
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })
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
  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initializeGA()
      window.GA_INITIALIZED = true
    }
  }, [])

  useEffect(() => {
    if (!pathname) return
    pageview(pathname as any)
  }, [pathname])

  const isActivityPage = !activityPath.some((path) => pathname?.includes(path))
  const showBackToTop = isMobileView ? isActivityPage : true

  const showHelp = showSupportWidget.includes(pathname || '') && !isTeacherPage // Add condition to hide help on teacher pages
  const showMKTInApp = showHelp && !isMobileView
  const hiddenChatbot = !showHelp
  // Handle HubSpot widget visibility based on URL

  //TODO: Next14
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
    // const handleRouteChange = () => {
    //     setTimeout(hideHubspotWidget, 300) // Short delay to ensure DOM is updated
    // }

    return () => observer.disconnect()
  }, [router, showHelp, hiddenChatbot])

  useEffect(() => {
    if (prevPathRef.current) {
      localStorage.setItem('previousUrl', prevPathRef.current)

      if (
        prevPathRef.current.includes('courses') &&
        !prevPathRef.current.includes('your-answers-detail')
      ) {
        localStorage.setItem('previousCourseUrl', prevPathRef.current)
      }
    }

    prevPathRef.current = pathname
  }, [pathname])

  const searchParams = useSearchParams()

  useEffect(() => {
    if (!window.gtag) return

    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return (
    <AntConfigProvider>
      <Provider store={store}>
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
              entranceTestApi: EntranceTestAPI,
              eventTestApi: EventTestAPI,
              calendarApi: CalendarApi,
              myProfileApi: MyProfileAPI,
              submitQuizTest: TestServiceAPI.submitQuizTest,
              dashboardApi: DashboardAPI,
              authManager: new AuthenticationManager(),
              pageLink: PageLink,
              menuItems: MENU_ITEMS,
              menuItemsEvent: MENU_ITEMS_EVENT,
              menuBottom: MENU_BOTTOM,
              router: router,
              pathname,
              params,
              query: Object.fromEntries(query.entries()),
              fetcher: fetcher,
              videoUrl: process.env.NEXT_PUBLIC_VIDEO_URL as string,
              testServiceApi: TestServiceAPI,
              certificateApi: {
                uploadImageToLinkedIn,
              },
              uploadImageToLinkedIn: uploadImageToLinkedIn,
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
                    <PreviousSectionRouteProvider pathname={pathname}>
                      <Toaster
                        toastOptions={{
                          style: {
                            maxWidth: '400px', // Tăng chiều rộng của toast
                          },
                        }}
                      />
                      <SappConfirmDialogContainer />
                      <RouteGuard>
                        <ConfigProvider>
                          <div className="relative">
                            <PinnedNotifications />
                          </div>
                          <AntdApp>{children}</AntdApp>
                          <>
                            {showBackToTop && <BackToTop />}
                            <MKTInApp showMKTInApp={showMKTInApp} />
                            {showHelp && <div id="floating-btn-divider" />}
                            <Help showHelp={showHelp} />
                            <LearningNotesList appType={AppType.LMS_PRO} />
                            <PopupCompletedCourse />
                          </>
                        </ConfigProvider>
                      </RouteGuard>
                    </PreviousSectionRouteProvider>
                  </SocketContext.Provider>
                </QueryClientProvider>
              </CourseNoteProvider>
            </CourseProvider>
          </FeatureProvider>
        </PinnedNotifyProvider>
      </Provider>
    </AntConfigProvider>
  )
}
