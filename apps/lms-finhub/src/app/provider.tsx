// app/providers.tsx
'use client'

import '@fortune-sheet/react/dist/index.css'
import {
  CourseProvider,
  FeatureProvider,
  PinnedNotifyProvider,
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
import {
  AntConfigProvider,
  BackToTop,
  Help,
  PinnedNotifications,
  SappConfirmDialogContainer,
} from '@lms/ui'
import { fetcher } from '@services/requestV2'
import '@xyflow/react/dist/style.css'
import { ConfigProvider } from 'antd'
import Aos from 'aos'
import 'aos/dist/aos.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { io } from 'socket.io-client'
import { ActivityAPI } from 'src/api/activity'
import { ClassAPI } from 'src/api/class'
import { CoursesAPI } from 'src/api/courses'
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
import { PageLink } from 'src/constants/routes'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import UserApi from 'src/redux/services/User/user'
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'
import { uploadImageToLinkedIn } from '../api/certificate'

dayjs.extend(utc)
dayjs.extend(weekday)
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
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
  const showSupportWidget = [
    '/short-course',
    '/entrance-test',
    '/calendar',
    '/exam_list',
    '/overview',
  ]
  const pathName = usePathname()
  const showHelp = showSupportWidget.includes(pathName) // Add condition to hide help on teacher pages
  const params = useParams()
  const query = useSearchParams()

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

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
              certificateApi: {
                uploadImageToLinkedIn,
              },
              pathname: pathName,
              params,
              query: Object.fromEntries(query.entries()),
              uploadImageToLinkedIn: uploadImageToLinkedIn,
            }}
          >
            <CourseProvider router={router}>
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
                      {/* <AntdApp> */}
                      <div className="relative">
                        <PinnedNotifications />
                        {children}
                      </div>
                      <BackToTop />
                      <Help showHelp={showHelp} />
                      <LearningNotesList appType={AppType.LMS_FINHUB} />
                      <PopupCompletedCourse />
                      {/* </AntdApp> */}
                    </>
                  </RouteGuard>
                </SocketContext.Provider>
              </QueryClientProvider>
            </CourseProvider>
          </FeatureProvider>
        </PinnedNotifyProvider>
      </Provider>
    </AntConfigProvider>
  )
}
