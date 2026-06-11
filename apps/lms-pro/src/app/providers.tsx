// app/providers.tsx
'use client'

import dynamic from 'next/dynamic'
import {
  CourseNoteProvider,
  CourseProvider,
  FeatureProvider,
  PinnedNotifyProvider,
  PreviousSectionRouteProvider,
  SocketContext,
} from '@lms/contexts'
import {
  ANIMATION,
  AppType,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
} from '@lms/core'
import { RouteGuard } from '@lms/feature-auth'
import { useTailwindBreakpoint } from '@lms/hooks'
import BackToTop from '@lms/ui/back-to-top'
import { SappConfirmDialogContainer } from '@lms/ui/confirm-dialog'
import { Help } from '@lms/ui/help'
import { PinnedNotifications } from '@lms/ui/pinned-notifications'
import AntConfigProvider from '@lms/ui/provider'
import { fetcher } from '@services/request'
import { App as AntdApp } from 'antd'
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
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import CalendarApi from 'src/api/calendar'
import { uploadImageToLinkedIn } from 'src/api/certificate'
import { ClassAPI } from 'src/api/class'
import { CoursesActivationAPI } from 'src/api/course-activation'
import { CoursesAPI } from 'src/api/courses'
import { DashboardAPI } from 'src/api/dashboard'
import { EntranceTestAPI } from 'src/api/entrance-test'
import { EventTestAPI } from 'src/api/event-test'
import { NotificationAPI } from 'src/api/notification'
import MyProfileAPI, { AuthAPI } from 'src/api/profile'
import { QuestionAPI } from 'src/api/question'
import { StorylineAPI } from 'src/api/storyline'
import { TestServiceAPI } from 'src/api/test-api'
import { UploadAPI } from 'src/api/upload'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from 'src/constants/menu-items'
import { PageLink } from 'src/constants/routers'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import UserContextApi from 'src/redux/services/User/user'
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'
import { store } from 'src/redux/store'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { modules } from './module-registry'
import { UserApi } from 'src/api/user'
import { SchedulesAPI } from 'src/api/schedules'
import { ProgressAPI } from 'src/api/progress'
import { TeacherAPI } from 'src/api/teacher'
import { MyRequestAPI } from 'src/api/my-request'
import { RequestAPI } from 'src/api/request'
import { ActivityAPI } from 'src/api/activity'
import DeferredThirdPartyScripts from './deferred-third-party-scripts'

// Lazy load MKTInApp — kéo framer-motion + react-slick + ModalMarketingInApp
// Không cần SSR, chỉ hiện ở một số route → không nên vào initial bundle
const MKTInApp = dynamic(() => import('@components/MKTInApp'), { ssr: false })
const LearningNotesList = dynamic(
  () =>
    import('@lms/feature-courses/src/components/mycourses/LearningNotesList'),
  { ssr: false },
)
const PopupCompletedCourse = dynamic(
  () =>
    import('@lms/feature-courses/src/components/mycourses/PopupCompletedCourse'),
  { ssr: false },
)
const PopupActivated = dynamic(
  () =>
    import('@lms/feature-courses/src/components/mycourses/PopupActivated'),
  { ssr: false },
)

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
// Stable QueryClient — khởi tạo 1 lần duy nhất, không re-create mỗi render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000000,
      refetchOnWindowFocus: false,
    },
  },
})

function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const query = useSearchParams()
  const dispatch = useAppDispatch()
  const [socket, setSocket] = useState<any>(null)
  // Stable authenticationManager — dùng useRef để không tạo instance mới mỗi render
  const authManagerRef = useRef<AuthenticationManager | null>(null)
  if (!authManagerRef.current) {
    authManagerRef.current = new AuthenticationManager()
  }
  const authenticationManager = authManagerRef.current

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ''
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''
  const { isMobileView } = useTailwindBreakpoint()

  // Stable query object — tránh tạo object mới mỗi render
  const queryObj = useMemo(
    () => Object.fromEntries(query.entries()),
    [query],
  )

  // Stable featureProviderValue — tránh re-render toàn bộ consumer khi Providers re-render
  const featureProviderValue = useMemo(
    () => ({
      courseApi: CoursesAPI,
      questionApi: QuestionAPI,
      uploadApi: UploadAPI,
      userApi: UserApi,
      userContextApi: UserContextApi,
      notificationApi: NotificationAPI,
      authApi: AuthAPI,
      classApi: ClassAPI,
      activityApi: ActivityAPI,
      courseActivityApi: CourseActivityApi,
      entranceTestApi: EntranceTestAPI,
      eventTestApi: EventTestAPI,
      calendarApi: CalendarApi,
      myProfileApi: MyProfileAPI,
      myRequestApi: MyRequestAPI,
      requestApi: RequestAPI,
      submitQuizTest: TestServiceAPI.submitQuizTest,
      dashboardApi: DashboardAPI,
      storylineApi: StorylineAPI,
      schedulesApi: SchedulesAPI,
      progressApi: ProgressAPI,
      teacherApi: TeacherAPI,
      authManager: authManagerRef.current!,
      pageLink: PageLink,
      menuItems: MENU_ITEMS,
      menuItemsEvent: MENU_ITEMS_EVENT,
      menuBottom: MENU_BOTTOM,
      router: router,
      pathname,
      params,
      query: queryObj,
      fetcher: fetcher,
      videoUrl: process.env.NEXT_PUBLIC_VIDEO_URL as string,
      testServiceApi: TestServiceAPI,
      certificateApi: {
        uploadImageToLinkedIn,
      },
      uploadImageToLinkedIn: uploadImageToLinkedIn,
      courseActivationAPI: CoursesActivationAPI,
      dispatch: dispatch,
      useAppSelector: useAppSelector,
      appModules: modules,
      domainTest: process.env.NEXT_PUBLIC_DOMAIN_TEST as string,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, pathname, params, queryObj, dispatch],
  )

  // Check if URL contains '/teachers'
  const isTeacherPage = pathname?.includes('/teachers')
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  }, []) // chỉ chạy 1 lần khi mount
  useEffect(() => {
    const token = authenticationManager.getToken()
    if (token !== '') {
      let cleanup: (() => void) | undefined
      import('socket.io-client').then(({ io }) => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
          extraHeaders: {
            authorization: token,
          },
        })
        setSocket(newSocket)
        cleanup = () => newSocket.disconnect()
      })
      return () => cleanup?.()
    }
  }, []) // chỉ chạy 1 lần khi mount — authenticationManager là stable ref

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => { })
      socket.on('disconnect', () => { })
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
  const isActivityPage = !activityPath.some((path) => pathname?.includes(path))
  const showBackToTop = isMobileView ? isActivityPage : true

  const showHelp = showSupportWidget.includes(pathname || '') && !isTeacherPage // Add condition to hide help on teacher pages
  const showMKTInApp = showHelp && !isMobileView
  const hiddenChatbot = !showHelp
  // // Handle HubSpot widget visibility based on URL

  // //TODO: Next14
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
  }, [showHelp, hiddenChatbot]) // bỏ router — không cần re-subscribe khi navigate

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

  return (
    <AntConfigProvider>
      <PinnedNotifyProvider
        router={router}
        api={{
          getPinnedNotifications: UserContextApi.getPinnedNotifications,
        }}
      >
        <FeatureProvider
          value={featureProviderValue}
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
                    <RouteGuard>
                  <PreviousSectionRouteProvider pathname={pathname}>
                    <Toaster
                      toastOptions={{
                        style: {
                          maxWidth: '400px', // Tăng chiều rộng của toast
                        },
                      }}
                    />
                    <SappConfirmDialogContainer />
                        <PinnedNotifications />
                        <AntdApp>{children}</AntdApp>
                          {showBackToTop && <BackToTop />}
                          <MKTInApp showMKTInApp={showMKTInApp} />
                          {showHelp && <div id="floating-btn-divider" />}
                          <Help showHelp={showHelp} />
                          <LearningNotesList appType={AppType.LMS_PRO} />
                          <PopupCompletedCourse />
                          <PopupActivated />
                          <DeferredThirdPartyScripts gaId={gaId} gtmId={gtmId} />
                  </PreviousSectionRouteProvider>
                    </RouteGuard>
                </SocketContext.Provider>
              </QueryClientProvider>
            </CourseNoteProvider>
          </CourseProvider>
        </FeatureProvider>
      </PinnedNotifyProvider>
    </AntConfigProvider>
  )
}

export function ProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Providers>{children}</Providers>
    </Provider>
  )
}
