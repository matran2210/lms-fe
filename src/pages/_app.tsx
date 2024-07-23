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
import { getActToken, getLocalStorgeActToken, pageview } from '@utils/index'
import { CourseProvider } from '@contexts/index'
import { URL } from 'url'
import { io } from 'socket.io-client'
import { ICert } from 'src/type'
import {
  PinnedNotifyProvider,
} from '@contexts/PinnedNotifyContext'
import PinnedNotifications from '@components/layout/PinnedNotifications'
import PopupCert from '@components/mycourses/PopupCert'
import Help from '@components/Help'
import BackToTop from '@components/BackToTop'

type MyAppProps = AppProps & {
  Component: {
    layout?: String
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  injectStore(store)
  // const [show, setShow] = useState(false)
  const router = useRouter()
  // const [showPinned, setShowPinned] = useState(true)
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
      } catch (error) { }
    }
  }

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
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const isExclusivePages = [
      PageLink.AUTH_LOGIN,
      PageLink.AUTH_CHANGE_PASSWORD,
      PageLink.AUTH_CHANGE_PASSWORD_SUCCESS,
      PageLink.AUTH_FORGOT_PASSWORD,
      PageLink.AUTH_FORGOT_PASSWORD_RECOVER,
    ].includes(router.asPath)

    if (!isExclusivePages) {
      localStorage.setItem('beforeLoginPath', router.asPath.toString())
    }
  }, [router])

  // Lấy token từ cokkieStorage (giả sử 'accessToken' là key lưu token)

  const [openCert, setOpenCert] = useState(false)
  const [dataStudent, setDataStudent] = useState<ICert>()

  let authToken = getActToken()

  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    if (authToken) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
        extraHeaders: {
          authorization: authToken,
        },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [authToken]); // reconnect khi authToken thay đổi

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => { });
      socket.on('disconnect', () => { });
      socket.on('STUDENT_COMPLETE_COURSE', (data: ICert) => {
        setOpenCert(true)
        setDataStudent(data)
      })
    }
  }, [socket])

  const handleCancel = () => {
    setOpenCert(false)
    setDataStudent(undefined)
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
                {getActToken() && (
                  <>
                    <BackToTop />
                    <Help />
                  </>
                )}
                <LearningNotesList />
                <PopupCert
                  open={openCert}
                  onCancel={handleCancel}
                  dataStudent={dataStudent}
                />
              </>
            </RouteGuard>
          </QueryClientProvider>
        </CourseProvider>
      </PinnedNotifyProvider>
    </main>
  )
}

export default wrapper.withRedux(MyApp)