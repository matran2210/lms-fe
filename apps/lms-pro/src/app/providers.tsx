// app/providers.tsx
'use client'

import '@fortune-sheet/react/dist/index.css'
import {
  CourseNoteProvider,
  CourseProvider,
  FeatureProvider,
  PinnedNotifyProvider,
  PreviousSectionRouteProvider,
  SocketContext,
} from '@lms/contexts'
import { RouteGuard } from '@lms/feature-auth'
import '@lms/styles'
import { SappConfirmDialogContainer } from '@lms/ui'
import '@sapp-fe/entrance-test-result-package/dist/index.css'
import '@sapp-fe/preview-part/dist/index.css'
import '@sapp-fe/quiz-result-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/sapp-editor.css'
import '@sapp-fe/sapp-notification/dist/index.css'
import { fetcher } from '@services/requestV2'
import '@styles/index.scss'
import '@xyflow/react/dist/style.css'
import { App as AntdApp, ConfigProvider } from 'antd'
import 'aos/dist/aos.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
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
import { ActivityAPI } from './api/activity/route'
import CalendarApi from './api/calendar/route'
import { ClassAPI } from './api/class/route'
import { CoursesAPI } from './api/courses/route'
import { EntranceTestAPI } from './api/entrance-test/route'
import { EventTestAPI } from './api/event-test/route'
import { NotificationAPI } from './api/notification/route'
import MyProfileAPI, { AuthAPI } from './api/profile/route'
import { QuestionAPI } from './api/question/route'
import { TestServiceAPI } from './api/test-api/route'
import { UploadAPI } from './api/upload/route'
import { useRouter } from 'next/navigation'
import { LOCAL_STORAGE_KEYS, SOCKET_EVENTS } from '@lms/core'
import { io } from 'socket.io-client'
import { uploadImageToLinkedIn } from './api/certificate/route'
import { ErrorBoundary } from '@sentry/nextjs'
import ErrorRedirectPage from '@pages/error-redirect'
import { Provider } from 'react-redux'
import { store } from '@lms/contexts'
import { usePathname, useParams } from 'next/navigation'

dayjs.extend(utc)
dayjs.extend(weekday)

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

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
  return (
    <ErrorBoundary fallback={<ErrorRedirectPage />}>
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
              authManager: new AuthenticationManager(),
              pageLink: PageLink,
              menuItems: MENU_ITEMS,
              menuItemsEvent: MENU_ITEMS_EVENT,
              menuBottom: MENU_BOTTOM,
              router: router,
              pathname,
              params,
              fetcher: fetcher,
              videoUrl: process.env.NEXT_PUBLIC_VIDEO_URL as string,
              testServiceApi: TestServiceAPI,
              certificateApi: {
                uploadImageToLinkedIn,
              },
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
                      {/* <SappConfirmDialogContainer /> */}
                      <RouteGuard>
                        <ConfigProvider>
                          <AntdApp>{children}</AntdApp>
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
    </ErrorBoundary>
  )
}
