import { RouteGuard } from '@components/auth/RouteGuard'
import SappConfirmDialogContainer from '@components/base/confirm-dialog/SappConfirmDialogContainer'
import Layout from '@components/layout'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import SingleDialogLayout from '@components/layout/SingleDialog'
import LearningNotesList from '@components/mycourses/LearningNotesList'
import LearningResource from '@components/mycourses/LearningResource'
import '@fortune-sheet/react/dist/index.css'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
} from 'src/redux/slice/Notification/Notification'
import { onMessageListener } from 'src/utils/firebase'
import { store, wrapper } from '../redux/store'

// import 'antd/dist/antd.css'

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
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const gettingNotiUnread = useAppSelector(
    (state) => state.notificationReducer?.loading,
  )

  const coutNotificationsUnRead = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken')
    if (accessToken && router?.asPath !== '/auth/login') {
      try {
        await dispatch(getCountUnRead())
      } catch (error) {}
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
    if (pathname.startsWith('/notifications')) return 'Notification'
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
    default:
      content = (
        <Layout openDrawer={openResource} setOpenResource={setOpenResource}>
          <Component {...pageProps} />
        </Layout>
      )
  }
  const handleOnChangePage = () => {
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('accessToken') === '') {
        setOpenResource(false)
      }
    }
    // Đếm số lượng noti chưa đọc, nếu lớn hơn 0 thì hiển thị thông báo
    coutNotificationsUnRead()
    // if (getNotiUnread > 0) {
    //   dispatch(showNotification())
    // } else {
    //   dispatch(hideNotification())
    // }
  }
  useEffect(() => {
    // handleOnChangePage()
    router.events.on('routeChangeError', (e) => setLoading(true))
    router.events.on('routeChangeStart', (e) => setLoading(false))
    router.events.on('routeChangeComplete', (e) => setLoading(true))

    return () => {
      router.events.off('routeChangeError', (e) => setLoading(true))
      router.events.off('routeChangeStart', (e) => setLoading(false))
      router.events.off('routeChangeComplete', (e) => setLoading(true))
    }
  }, [])
  useEffect(() => {
    const loader = document.getElementById('globalLoader')

    if (typeof window !== 'undefined') {
      if (loader) loader.className = '!hidden'
    }
  }, [])
  useEffect(() => {
    const loader = document.getElementById('globalLoader')
    if (loading && !gettingNotiUnread) {
      if (loader) loader.className = '!hidden'
    } else {
      if (loader) {
        loader.className = ''
      }
    }
  }, [loading, gettingNotiUnread])

  useEffect(() => {
    handleOnChangePage()
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>{getTitleHeader(router.pathname)}</title>
        <link rel="icon" href="/sapp.svg" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
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
        <meta http-equiv="content-language" content="en" />
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
        <Toaster />
        <SappConfirmDialogContainer />
        <RouteGuard>
          <>
            {content}
            <LearningResource
              open={openResource}
              setOpenResource={setOpenResource}
            />
            <LearningNotesList />
          </>
        </RouteGuard>
      </main>
    </>
  )
}

export default wrapper.withRedux(MyApp)
