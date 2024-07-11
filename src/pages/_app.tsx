import { RouteGuard } from '@components/auth/RouteGuard'
import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import Layout from '@components/layout'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import SingleDialogLayout from '@components/layout/SingleDialog'
import LearningNotesList from '@components/mycourses/LearningNotesList'
import LearningResource from '@components/mycourses/LearningResource'
import '@fortune-sheet/react/dist/index.css'
import '@styles/globals.scss'
import { LAYOUT } from '@utils/constants'
import type { AppProps } from 'next/app'
import Head from 'next/head'
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
import SappLoading from 'src/common/SappLoading'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { getActToken, getLocalStorgeActToken, pageview } from '@utils/index'
import SinglePageLayout from '@components/layout/SinglePage'
import { CourseProvider } from '@contexts/index'
import { URL } from 'url'
import { Button, Popover, Tooltip } from 'antd'
import Link from 'next/link'
import Help from '@components/Help'
import BackToTop from '@components/BackToTop'

type MyAppProps = AppProps & {
  Component: {
    layout?: String
  }
}

function MyApp({ Component, pageProps }: MyAppProps) {
  let content = null
  const { layout = LAYOUT.DEFAULT_LAYOUT } = (Component as any) || {}
  injectStore(store)
  // const [show, setShow] = useState(false)
  const router = useRouter()
  const [openResource, setOpenResource] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const gettingNotiUnread = useAppSelector(
    (state) => state.notificationReducer?.loading,
  )
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

  const getTitleHeader = (pathname: string) => {
    if (pathname.startsWith('/explanation') && router.query?.title) {
      return router.query?.title
    }
    if (
      pathname.startsWith('/courses') ||
      pathname.startsWith('/test') ||
      pathname.startsWith('/case-study') ||
      pathname.startsWith('/casestudy')
    )
      return 'My Course'
    if (pathname.startsWith('/notifications')) return 'Notifications'
    if (pathname.startsWith('/entrance-test')) return 'Entrance Test '
    if (pathname.startsWith('/profile') || pathname.startsWith('/[page]'))
      return 'Profile'
    return 'Hệ thống Quản lý học và thi ACCA, CFA trực tuyến SAPP Academy'
  }

  useEffect(() => {
    onMessageListener().then((data: any) => {
      dispatch(showNotification())
    })
  })

  // useEffect(() => {
  //   const handleStart = (url: string) =>
  //     url !== router.asPath && setLoading(true)
  //   const handleComplete = () => setLoading(false)

  //   router.events.on('routeChangeStart', handleStart)
  //   router.events.on('routeChangeComplete', handleComplete)
  //   router.events.on('routeChangeError', handleComplete)

  //   return () => {
  //     router.events.off('routeChangeStart', handleStart)
  //     router.events.off('routeChangeComplete', handleComplete)
  //     router.events.off('routeChangeError', handleComplete)
  //   }
  // })

  switch (layout) {
    case LAYOUT.ERROR_LAYOUT:
      content = <Component {...pageProps} />
      break
    case LAYOUT.SINGLE_DIALOG_LAYOUT:
      content = (
        <SingleDialogLayout>
          <Component {...pageProps} />
        </SingleDialogLayout>
      )
      break
    case LAYOUT.FULLSCREEN_LAYOUT:
      content = (
        <FullScreenLayout>
          <Component {...pageProps} />
        </FullScreenLayout>
      )
      break
    case LAYOUT.SINGLE_PAGE_LAYOUT:
      content = (
        <SinglePageLayout>
          <Component {...pageProps} />
        </SinglePageLayout>
      )
      break
    default:
      content = (
        <Layout openDrawer={openResource} setOpenResource={setOpenResource}>
          <Component {...pageProps} />
        </Layout>
      )
  }
  const handleOnChangePage = () => {
    if (typeof window !== 'undefined') {
      if (getLocalStorgeActToken() === '') {
        setOpenResource(false)
      }
    }
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

  return (
    <>
      <Head>
        <title>{getTitleHeader(router.pathname)}</title>
        <link rel="icon" href="/sapp.svg" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
        <meta charSet="utf-8"></meta>
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="analytics" content="G-HRLKW6S3X0" />
        <meta
          name="csrf-token"
          content="Hl4U5KjkBFkHN2m2ptOE1L8QbTGV19yrEINaOrsd"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta property="og:type" content="website" />
        <meta name="author" content="SAPP Academy" />
        <meta
          property="og:title"
          content="Hệ thống Quản lý học và thi ACCA, CFA trực tuyến SAPP Academy"
          key="title"
        />
        <meta
          name="description"
          content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
          key="desc"
        />
        <meta
          name="og:description"
          content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
          key="description"
        />
        <meta
          property="og:image"
          content="https://sapp-lms-fe-prod.vercel.app/thumbnail.webp"
          key="image"
        />
        <meta name="og:url" content={'https://lms-pro.sapp.edu.vn'} />
        <meta
          name="keywords"
          content="sapp, lms, acca, ACCA, CFA, Big4, 3P, SAPP Academy"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hệ thống Quản lý học và thi ACCA, CFA trực tuyến SAPP Academy"
        />
        <meta
          name="twitter:description"
          content="Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA"
        />
        <meta
          name="twitter:image"
          content="https://sapp-lms-fe-prod.vercel.app/thumbnail.webp"
        />
      </Head>
      <main>
        <CourseProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <SappConfirmDialogContainer />
            {loading ? <SappLoading /> : <></>}
            <RouteGuard>
              <>
                {content}
                {
                  getActToken() && (
                    <>
                      <BackToTop />
                      <Help />
                    </>
                  )
                }
                <LearningResource
                  open={openResource}
                  setOpenResource={setOpenResource}
                />
                <LearningNotesList />
                <ReactQueryDevtools initialIsOpen={false} />
              </>
            </RouteGuard>
          </QueryClientProvider>
        </CourseProvider>
      </main>
    </>
  )
}

export default wrapper.withRedux(MyApp)
