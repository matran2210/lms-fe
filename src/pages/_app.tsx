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

  const [visible, setVisible] = useState(false)

  const handleVisibleChange = (newVisible: any) => {
    // Chỉ thay đổi trạng thái khi newVisible là true (mở Popover)
    if (newVisible) {
      setVisible(true)
    }
  }

  const handleButtonClick = () => {
    setVisible(!visible)
  }

  const [isHoveredFourLevel, setIsHoveredFourLevel] = useState(false)

  useEffect(() => {
    const container = document.getElementById(
      'hubspot-messages-iframe-container',
    )
    if (container && visible) {
      container.classList.add('aaaaaaaaaaaa')
    } else {
      if (container && !visible) {
        container.classList.remove('aaaaaaaaaaaa')
      }
    }
  }, [visible])

  useEffect(() => {
    // Kiểm tra xem biến actToken có tồn tại trong localStorage hay không
    // if (getLocalStorgeActToken()) {
    // Tạo một thẻ script mới
    const scriptElement = document.createElement('script')
    scriptElement.type = 'text/javascript'
    scriptElement.id = 'hs-script-loader'
    scriptElement.async = true
    scriptElement.defer = true
    scriptElement.src = `//js.hs-scripts.com/1774127.js`

    // Thêm thẻ script vào trong thẻ head của trang
    document.head.appendChild(scriptElement)

    // Cleanup: Xóa script khi component unmount (nếu cần)
    return () => {
      document.head.removeChild(scriptElement)
    }
    // }
  })

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

                <div id="container-floating">
                  <div className="cursor-pointer">
                    <Popover
                      content={
                        <div>
                          <div className="flex">
                            <svg
                              width="20"
                              height="25"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => setVisible(!visible)}
                              className="cursor-pointer"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.707 14.7072C7.51947 14.8947 7.26516 15 7 15C6.73484 15 6.48053 14.8947 6.293 14.7072L2.293 10.7072C2.10553 10.5197 2.00021 10.2654 2.00021 10.0002C2.00021 9.73505 2.10553 9.48074 2.293 9.29322L6.293 5.29321C6.4816 5.11106 6.7342 5.01026 6.9964 5.01254C7.2586 5.01482 7.50941 5.11999 7.69482 5.3054C7.88023 5.4908 7.98539 5.74162 7.98767 6.00381C7.98995 6.26601 7.88916 6.51861 7.707 6.70721L5.414 9.00021L17 9.00021C17.2652 9.00021 17.5196 9.10557 17.7071 9.29311C17.8946 9.48064 18 9.735 18 10.0002C18 10.2654 17.8946 10.5198 17.7071 10.7073C17.5196 10.8949 17.2652 11.0002 17 11.0002L5.414 11.0002L7.707 13.2932C7.89447 13.4807 7.99979 13.7351 7.99979 14.0002C7.99979 14.2654 7.89447 14.5197 7.707 14.7072Z"
                                fill="#404041"
                              />
                            </svg>
                            <div className="font-semibold text-base text-bw-1 ms-2">
                              Support Center
                            </div>
                          </div>
                          <div className="text-bw-1 text-xs mt-3 mb-4">
                            Trong quá trình học tập, nếu có các vấn đề cần hỗ
                            trợ, bạn hãy kết nối với bộ phận Hỗ trợ học viên qua
                            các kênh liên hệ sau:
                          </div>

                          <Link
                            href={'https://knowledge.sapp.edu.vn/knowledge'}
                            target="_blank"
                            className="mt-3"
                          >
                            <div
                              onMouseEnter={() => setIsHoveredFourLevel(true)}
                              onMouseLeave={() => setIsHoveredFourLevel(false)}
                              className="flex h-[55px] border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer"
                            >
                              {isHoveredFourLevel ? (
                                <div className="w-full flex items-center justify-center">
                                  Tra cứu tại đây
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center">
                                    <svg
                                      width="28"
                                      height="28"
                                      viewBox="0 0 28 28"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M23.8473 8.95508H21.113C21.1138 9.2807 21.1124 15.0992 21.113 15.6226C21.113 17.3026 19.5336 18.6632 17.5955 18.6632H11.698C11.2155 18.8799 10.1504 19.3327 9.66799 19.5426L9.66797 20.1857C9.66797 21.2751 10.7442 22.1632 12.0699 22.1632H17.4817L23.7423 24.8801C23.8237 24.9143 23.9135 24.9232 24 24.9055C24.0864 24.8879 24.1656 24.8446 24.227 24.7812C24.2885 24.7179 24.3294 24.6375 24.3444 24.5505C24.3594 24.4635 24.3478 24.3741 24.3111 24.2938L23.3048 22.1632C24.7734 22.2983 26.2231 21.5681 26.2492 20.1857C26.2487 18.959 26.2496 15.1655 26.2492 13.9995V10.9326C26.2492 9.82133 25.1948 8.95508 23.8473 8.95508Z"
                                        fill="#18355D"
                                      />
                                      <path
                                        d="M17.5963 17.7884C19.0531 17.7884 20.2388 16.8171 20.2388 15.6227V5.24961C20.2388 4.05523 19.0531 3.08398 17.5963 3.08398H4.38813C2.90937 3.08398 1.75 4.03336 1.75 5.24961V15.6227C1.75 16.8171 2.93562 17.7884 4.38813 17.7884H5.08813L3.91563 20.2515C3.87991 20.3319 3.86899 20.4212 3.88426 20.5079C3.89952 20.5945 3.94028 20.6747 4.00133 20.7381C4.06238 20.8015 4.14095 20.8453 4.22699 20.8638C4.31303 20.8823 4.40264 20.8748 4.48438 20.8421L11.515 17.7884H17.5963ZM3.7975 13.0896V7.64711C3.7973 7.5896 3.80848 7.53262 3.8304 7.47945C3.85231 7.42628 3.88453 7.37797 3.9252 7.33731C3.96586 7.29664 4.01417 7.26442 4.06734 7.24251C4.12051 7.22059 4.17749 7.20941 4.235 7.20961H7.46375C7.57978 7.20961 7.69106 7.2557 7.77311 7.33775C7.85516 7.4198 7.90125 7.53108 7.90125 7.64711C7.90125 7.76314 7.85516 7.87442 7.77311 7.95647C7.69106 8.03852 7.57978 8.08461 7.46375 8.08461H4.6725V9.38836H6.825C6.94103 9.38836 7.05231 9.43445 7.13436 9.5165C7.21641 9.59855 7.2625 9.70983 7.2625 9.82586C7.2625 9.94189 7.21641 10.0532 7.13436 10.1352C7.05231 10.2173 6.94103 10.2634 6.825 10.2634H4.6725V13.0896C4.6708 13.2045 4.62395 13.3141 4.54209 13.3948C4.46023 13.4755 4.34992 13.5207 4.235 13.5207C4.12008 13.5207 4.00977 13.4755 3.92791 13.3948C3.84605 13.3141 3.7992 13.2045 3.7975 13.0896ZM17.92 13.1246C17.996 13.2104 18.0355 13.3225 18.0298 13.437C18.0241 13.5514 17.9739 13.6591 17.8897 13.737C17.8056 13.8148 17.6943 13.8566 17.5798 13.8533C17.4652 13.8501 17.3565 13.802 17.2769 13.7196L16.6206 13.0065C14.6144 14.2523 11.7716 12.671 11.8388 10.2895C11.8435 9.45101 12.1805 8.64855 12.7759 8.05809C13.3712 7.46762 14.1765 7.13732 15.015 7.13961C17.7691 7.10278 19.2364 10.5265 17.3118 12.4596L17.92 13.1246ZM11.1475 13.164L10.1238 10.8365L8.37375 10.8496L7.34563 13.1946C7.29748 13.2981 7.21076 13.3786 7.10401 13.419C6.99725 13.4594 6.87894 13.4564 6.77435 13.4107C6.66977 13.365 6.58723 13.2802 6.54438 13.1744C6.50152 13.0686 6.50176 12.9502 6.54503 12.8446C6.55311 12.8292 7.68734 10.2509 7.69128 10.2371L8.85503 7.59027C8.89078 7.51431 8.94741 7.4501 9.01829 7.40511C9.08917 7.36013 9.17139 7.33625 9.25534 7.33625C9.33929 7.33625 9.42151 7.36013 9.4924 7.40511C9.56328 7.4501 9.61991 7.51431 9.65566 7.59027L10.8107 10.2196L11.9657 12.8446C11.9877 12.8986 11.9988 12.9564 11.9983 13.0146C11.9978 13.0729 11.9857 13.1304 11.9627 13.184C11.9397 13.2375 11.9063 13.286 11.8645 13.3265C11.8226 13.367 11.7731 13.3987 11.7188 13.4199C11.6645 13.4411 11.6066 13.4513 11.5483 13.4498C11.4901 13.4484 11.4327 13.4354 11.3795 13.4116C11.3264 13.3878 11.2785 13.3536 11.2386 13.3111C11.1988 13.2686 11.1678 13.2186 11.1475 13.164Z"
                                        fill="#18355D"
                                      />
                                      <path
                                        d="M8.76367 9.97449L9.7393 9.96137L9.25367 8.85449L8.76367 9.97449Z"
                                        fill="#18355D"
                                      />
                                      <path
                                        d="M15.0152 8.01428C14.4118 8.01429 13.8332 8.25398 13.4065 8.68063C12.9799 9.10728 12.7402 9.68594 12.7402 10.2893C12.7402 10.8927 12.9799 11.4713 13.4066 11.898C13.8332 12.3246 14.4119 12.5643 15.0153 12.5643C15.3594 12.5658 15.6992 12.488 16.0083 12.3368L15.4308 11.7112C15.3921 11.6686 15.362 11.6189 15.3425 11.5648C15.3229 11.5107 15.3142 11.4532 15.3168 11.3957C15.3195 11.3383 15.3334 11.2818 15.3579 11.2298C15.3823 11.1777 15.4168 11.1309 15.4593 11.0921C15.5451 11.0138 15.6586 10.9728 15.7747 10.9781C15.8322 10.9807 15.8886 10.9947 15.9407 11.0191C15.9928 11.0436 16.0396 11.078 16.0783 11.1205L16.7171 11.8162C18.0638 10.4266 16.9707 7.96922 15.0152 8.01428Z"
                                        fill="#18355D"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ms-3 text-[11px] text-bw-1">
                                    <span className="">
                                      Tra cứu các vấn đề thường gặp và tài liệu
                                      học tập qua trong thông tin
                                    </span>{' '}
                                    <span className="font-bold">
                                      Knowledge Base
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </Link>

                          <Link
                            href={
                              'https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy/'
                            }
                            target="_blank"
                            className="mt-3"
                          >
                            <div className="flex border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer">
                              <div className="flex items-center">
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M24.9986 15.1916C24.8807 15.772 24.3553 16.1947 23.7254 16.221C23.527 16.2288 23.3581 16.3706 23.3206 16.5623C23.2804 16.754 23.3796 16.9483 23.5592 17.0297C24.1301 17.2923 24.4491 17.8805 24.3285 18.4608L24.2159 19.0123C24.0685 19.7396 23.2482 20.1939 22.5298 20.0206C22.3288 19.9734 22.1224 19.9366 21.9187 19.8972C21.6184 19.8394 21.3182 19.779 21.018 19.7213C20.6213 19.6425 20.2245 19.5664 19.8278 19.4876C19.3561 19.3957 18.8816 19.3011 18.4098 19.2092C17.8818 19.1042 17.3537 19.0018 16.8257 18.8968C16.2627 18.7865 15.6972 18.6762 15.1342 18.5633C14.5552 18.4504 13.9762 18.3348 13.3999 18.2219C12.8263 18.109 12.2553 17.9961 11.6817 17.8832C11.1349 17.7755 10.588 17.6678 10.0412 17.5602C9.53997 17.463 9.04139 17.3632 8.54013 17.2661C8.10589 17.1821 7.67164 17.0954 7.24007 17.0114C6.89428 16.9431 6.5485 16.8749 6.20003 16.8066C5.96146 16.7593 5.72287 16.712 5.48432 16.6648C5.3744 16.6438 5.26452 16.6201 5.15462 16.5991C5.14926 16.5991 5.1439 16.5965 5.13851 16.5965C5.19748 16.8696 5.17068 17.1611 5.04201 17.4341C4.77125 18.0066 4.14132 18.3059 3.53555 18.1904C3.35596 18.1563 3.16028 18.2219 3.08254 18.3847L2.84129 18.8968C2.76359 19.0595 2.84129 19.2486 2.98339 19.3615C3.01019 19.3826 22.3315 28.1084 22.3636 28.1162C22.5432 28.1504 22.7389 28.0847 22.8166 27.9219L23.0579 27.4099C23.1356 27.2471 23.0579 27.058 22.9158 26.9451C22.4333 26.5696 22.2564 25.9052 22.5271 25.3328C22.7979 24.7604 23.4278 24.461 24.0336 24.5766C24.2131 24.6107 24.4088 24.545 24.4866 24.3822L24.7278 23.8702C24.8055 23.7074 24.7278 23.5184 24.5857 23.4054C24.1032 23.0299 23.9263 22.3656 24.1971 21.7931C24.4678 21.2207 25.0977 20.9213 25.7035 21.0369C25.8831 21.071 26.0788 21.0054 26.1565 20.8426L26.3978 20.3305C26.4755 20.1677 26.3978 19.9787 26.2557 19.8657C25.7732 19.4902 25.5963 18.8259 25.867 18.2534C26.1378 17.681 26.7677 17.3817 27.3735 17.4972C27.5531 17.5313 27.7487 17.4657 27.8265 17.3029L28.0918 16.7357C28.1696 16.5729 28.0972 16.3812 27.931 16.3051L25.0441 15L24.9986 15.1916Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M2.13004 14.635C2.16264 14.6508 23.2998 18.75 23.3351 18.75C23.5199 18.7421 23.6991 18.6318 23.7344 18.4585L23.8485 17.907C23.8838 17.7311 23.7643 17.563 23.5959 17.4869C23.0309 17.2295 22.6967 16.6255 22.8244 16.0058C22.9521 15.386 23.5035 14.9527 24.1283 14.9265C24.3131 14.9186 24.4923 14.8083 24.5277 14.635L24.6119 14.2306L24.6418 14.0809C24.6771 13.9049 24.5575 13.7369 24.3891 13.6607C23.8241 13.4034 23.49 12.7994 23.6177 12.1796C23.7453 11.5599 24.2968 11.1266 24.9216 11.1003C25.1063 11.0924 25.2856 10.9821 25.3209 10.8088L25.435 10.2574C25.4703 10.0814 25.3508 9.91334 25.1823 9.83719C24.6173 9.57983 24.2832 8.97584 24.4109 8.35609C24.5385 7.73634 25.09 7.30305 25.7148 7.27679C25.8995 7.26891 26.0788 7.15861 26.1141 6.98529L26.2418 6.37342C26.2771 6.19748 26.1603 6.02679 25.9783 5.99265C25.9783 5.99265 4.73791 1.875 4.71618 1.875C4.55862 1.875 4.42008 1.98267 4.38748 2.13498L4.25981 2.74685C4.22449 2.92279 4.34402 3.09086 4.51244 3.16702C5.07748 3.42437 5.41161 4.02836 5.28393 4.64811C5.15626 5.26786 4.6048 5.70116 3.98001 5.72742C3.79526 5.73529 3.616 5.84559 3.58068 6.01891L3.46659 6.57038C3.43127 6.74632 3.5508 6.91439 3.71922 6.99055C4.28426 7.2479 4.61841 7.85189 4.49071 8.47164C4.36304 9.09139 3.81158 9.52469 3.18679 9.55095C3.00206 9.55882 2.82277 9.66912 2.78746 9.84244L2.67337 10.3939C2.63805 10.5699 2.75761 10.7379 2.926 10.8141C3.49106 11.0714 3.82519 11.6754 3.69749 12.2952C3.56981 12.9149 3.01836 13.3482 2.39357 13.3745C2.20884 13.3824 2.02955 13.4927 1.99424 13.666L1.88015 14.2175C1.84209 14.3934 1.96159 14.5589 2.13004 14.635ZM20.2356 7.90444C20.3089 7.54992 20.6675 7.31883 21.0342 7.38973C21.401 7.46064 21.64 7.80727 21.5667 8.16179L20.6702 12.4738L20.1188 15.1313C20.0536 15.4438 19.771 15.6592 19.4532 15.6592C19.4097 15.6592 19.3636 15.6539 19.3201 15.6461C18.9534 15.5752 18.7143 15.2285 18.7877 14.874L19.4043 11.9092L20.2356 7.90444ZM7.98955 5.52786C8.06289 5.17335 8.42147 4.94225 8.7882 5.01316C9.15493 5.08406 9.39398 5.4307 9.32064 5.78522L9.01096 7.27419L8.66055 8.96274L8.37804 10.323L7.87548 12.7548C7.81031 13.0673 7.52777 13.2826 7.20994 13.2826C7.16647 13.2826 7.12029 13.2774 7.07686 13.2695C7.05784 13.2668 7.03882 13.2616 7.02252 13.2564C6.68568 13.1618 6.47648 12.8335 6.54714 12.4974L6.64762 12.0064L6.91112 10.7353L7.98955 5.52786Z"
                                    fill="#18355D"
                                  />
                                </svg>
                              </div>
                              <div className="ms-3 text-[11px] text-bw-1">
                                <span>Gửi</span>{' '}
                                <span className="font-bold">
                                  Phiếu yêu cầu dịch vụ{' '}
                                </span>{' '}
                                <span>
                                  để hỗ trợ giải quyết các vấn đề về dịch vụ
                                  khóa học
                                </span>
                              </div>
                            </div>
                          </Link>

                          <Link
                            href={'https://www.facebook.com/ServiceofSAPP'}
                            target="_blank"
                            className="mt-3"
                          >
                            <div className="flex border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer">
                              <div className="flex items-center">
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.24432 2.8125C4.79669 2.8125 2.8125 4.79669 2.8125 7.24432V22.7557C2.8125 25.2033 4.79669 27.1875 7.24432 27.1875H22.7557C25.2033 27.1875 27.1875 25.2033 27.1875 22.7557V7.24432C27.1875 4.79669 25.2033 2.8125 22.7557 2.8125H7.24432ZM12.4316 9.7624C12.4316 7.75979 14.055 6.13636 16.0575 6.13636H19.2807C19.5033 6.13636 19.6837 6.31675 19.6837 6.53926V9.7624C19.6837 9.98491 19.5033 10.1653 19.2807 10.1653H17.6692C17.0016 10.1653 16.4605 10.7064 16.4605 11.374V12.5826H19.2807C19.4048 12.5826 19.5219 12.6398 19.5983 12.7376C19.6747 12.8354 19.7017 12.9629 19.6716 13.0832L18.8658 16.3064C18.821 16.4858 18.6598 16.6115 18.475 16.6115H16.4605V23.4608C16.4605 23.6833 16.2801 23.8636 16.0575 23.8636H12.8345C12.6119 23.8636 12.4316 23.6833 12.4316 23.4608V16.6115H10.4171C10.1946 16.6115 10.0142 16.4311 10.0142 16.2087V12.9855C10.0142 12.763 10.1946 12.5826 10.4171 12.5826H12.4316V9.7624Z"
                                    fill="#18355D"
                                  />
                                </svg>
                              </div>
                              <div className="ms-3 text-[11px] text-bw-1">
                                <span className="">Nhắn tin qua</span>{' '}
                                <span className="font-bold">Fanpage</span>{' '}
                                <span className="">
                                  để được giải đáp kiến thức cùng bộ phận chuyên
                                  môn.
                                </span>
                              </div>
                            </div>
                          </Link>

                          <Link
                            href={
                              'https://www.facebook.com/groups/everydaywithsapp'
                            }
                            target="_blank"
                            className="mt-3"
                          >
                            <div className="flex border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer">
                              <div className="flex items-center">
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18.3953 12.3491C18.237 7.85013 11.7549 7.85201 11.5977 12.3492C11.7437 16.8425 18.2502 16.8407 18.3953 12.3491Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M5.08136 13.6614C5.45066 13.95 5.88359 14.1462 6.34408 14.2337C6.80458 14.3211 7.2793 14.2973 7.72871 14.1641C8.17813 14.031 8.58922 13.7924 8.92776 13.4682C9.2663 13.144 9.52248 12.7437 9.67497 12.3004C9.82745 11.8572 9.87183 11.384 9.8044 10.9201C9.73697 10.4563 9.55969 10.0153 9.28732 9.63379C9.01495 9.25232 8.65537 8.94146 8.23855 8.72709C7.82172 8.51272 7.3597 8.40104 6.89098 8.40137C6.28258 8.40989 5.69163 8.60596 5.1988 8.96282C4.70598 9.31968 4.33529 9.81994 4.13735 10.3953C3.9394 10.9707 3.92384 11.5931 4.0928 12.1776C4.26175 12.7622 4.60698 13.2803 5.08136 13.6614Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M8.19823 19.2405C8.20714 17.8576 9.15642 16.6706 10.0922 15.7713C10.3459 15.5384 10.617 15.3252 10.9032 15.1337C10.5341 14.7229 10.1021 14.3732 9.62339 14.0977C8.89689 14.8213 7.91329 15.2275 6.88793 15.2275C5.86257 15.2275 4.87898 14.8212 4.15248 14.0977C2.84636 14.8844 1.19983 16.6244 2.16474 18.2419C2.34514 18.5473 2.60233 18.8002 2.91075 18.9753C3.21917 19.1505 3.56807 19.2419 3.92276 19.2405H8.19823Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M20.1582 11.3456C20.2867 15.235 25.9186 15.2334 26.0464 11.3455C25.9065 7.44981 20.2978 7.45004 20.1582 11.3456Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M18.5157 15.8831C18.3275 15.7558 18.1318 15.6399 17.9296 15.5362C17.7934 15.6623 17.6494 15.7798 17.4984 15.8878C16.6878 16.4583 15.7065 16.7345 14.7173 16.6705C13.7281 16.6066 12.7906 16.2063 12.0602 15.5361C10.6967 16.2831 9.26653 17.5977 9.13479 19.2397C9.13172 19.8645 9.37696 20.4649 9.81657 20.9089C10.2562 21.3528 10.8541 21.604 11.4789 21.6071L18.5109 21.6072C18.9156 21.6023 19.3121 21.4935 19.6627 21.2914C20.0133 21.0893 20.3061 20.8006 20.5131 20.4529C20.7201 20.1053 20.8344 19.7102 20.845 19.3057C20.8556 18.9012 20.7622 18.5008 20.5737 18.1427C20.0867 17.2298 19.3793 16.453 18.5157 15.8831Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M27.8741 16.2071C27.4019 15.3296 26.6982 14.5983 25.8395 14.0928C25.1134 14.8184 24.1291 15.2264 23.1026 15.2273C22.0761 15.2282 21.0912 14.8218 20.3639 14.0974C19.887 14.3757 19.4554 14.725 19.084 15.1335C19.3703 15.3249 19.6415 15.538 19.895 15.7711C20.5582 16.366 21.0995 17.0841 21.489 17.8854C21.6871 18.3097 21.7911 18.7719 21.7937 19.2402H26.0692C26.4234 19.2359 26.7705 19.1406 27.0774 18.9637C27.3842 18.7867 27.6405 18.5339 27.8216 18.2295C28.0028 17.925 28.1027 17.5792 28.1119 17.2251C28.1211 16.871 28.0392 16.5204 27.8741 16.2071Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M26.3142 20.7033C26.2603 20.6735 26.201 20.6546 26.1399 20.6477C26.0787 20.6408 26.0167 20.646 25.9576 20.6631C25.8984 20.6801 25.8432 20.7087 25.7951 20.7471C25.7469 20.7855 25.7068 20.833 25.6771 20.8869C21.1445 29.2462 8.85361 29.244 4.32271 20.8867C4.29294 20.8328 4.25284 20.7853 4.20471 20.7469C4.15658 20.7085 4.10135 20.68 4.04219 20.6629C3.98302 20.6458 3.92107 20.6406 3.85988 20.6475C3.79869 20.6543 3.73945 20.6732 3.68555 20.703C3.63165 20.7328 3.58414 20.7728 3.54573 20.821C3.50733 20.8691 3.47878 20.9243 3.46172 20.9835C3.44466 21.0427 3.43942 21.1046 3.44629 21.1658C3.45317 21.227 3.47204 21.2862 3.50181 21.3401C8.38231 30.3414 21.6192 30.3393 26.498 21.34C26.5277 21.2861 26.5466 21.2269 26.5534 21.1657C26.5603 21.1046 26.555 21.0427 26.538 20.9836C26.5209 20.9244 26.4924 20.8692 26.454 20.8212C26.4155 20.7731 26.368 20.733 26.3142 20.7033Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M5.75506 7.07225C10.4122 1.43504 19.5887 1.43563 24.2452 7.07238C24.3268 7.16399 24.4411 7.21997 24.5635 7.22831C24.6859 7.23665 24.8067 7.19668 24.9 7.11698C24.9932 7.03728 25.0515 6.9242 25.0624 6.80199C25.0733 6.67978 25.0358 6.55819 24.958 6.46329C19.9421 0.390891 10.0577 0.391335 5.04222 6.46347C4.96423 6.55834 4.92657 6.68002 4.93736 6.80236C4.94814 6.9247 5.00651 7.03792 5.0999 7.11767C5.19329 7.19743 5.31425 7.23736 5.43676 7.22886C5.55928 7.22037 5.67357 7.16413 5.75506 7.07225Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M20.8504 7.56056C20.9481 7.55878 21.0428 7.52671 21.1215 7.46878C21.2002 7.41085 21.259 7.32991 21.2897 7.23714C21.3204 7.14437 21.3216 7.04436 21.2931 6.9509C21.2645 6.85744 21.2076 6.77515 21.1303 6.7154C19.3547 5.40578 17.2063 4.69921 14.9999 4.69922C12.7935 4.69923 10.6451 5.40581 8.86951 6.71546C8.7724 6.79057 8.70862 6.90077 8.69188 7.02239C8.67514 7.14401 8.70677 7.26734 8.77998 7.3659C8.85318 7.46445 8.96212 7.53036 9.08339 7.54946C9.20466 7.56856 9.32859 7.53934 9.42855 7.46806C11.0424 6.27812 12.9948 5.63615 14.9999 5.63617C17.0051 5.63618 18.9575 6.27817 20.5713 7.46813C20.6519 7.52823 20.7498 7.56065 20.8504 7.56056Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    d="M7.65486 20.8229C7.57668 20.7283 7.46454 20.6681 7.3425 20.6552C7.22046 20.6424 7.09824 20.6778 7.00204 20.754C6.90585 20.8302 6.84334 20.9411 6.82793 21.0628C6.81252 21.1846 6.84544 21.3075 6.91961 21.4053C10.8751 26.5909 19.1243 26.5904 23.0793 21.4051C23.1536 21.3074 23.1866 21.1844 23.1712 21.0626C23.1558 20.9408 23.0933 20.8299 22.997 20.7537C22.9007 20.6774 22.7785 20.642 22.6564 20.655C22.5343 20.6679 22.4221 20.7282 22.344 20.8229C18.748 25.5379 11.2504 25.5374 7.65486 20.8229Z"
                                    fill="#18355D"
                                  />
                                </svg>
                              </div>
                              <div className="ms-3 text-[11px] text-bw-1">
                                <span className="">Tham gia</span>{' '}
                                <span className="font-bold">
                                  "Everyday with SAPP"
                                </span>{' '}
                                <span className="">
                                  - cộng đồng học tập dành cho học viên
                                </span>
                              </div>
                            </div>
                          </Link>

                          <Link href={'#'} className="mt-3">
                            <div className="flex border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer">
                              <div className="flex items-center">
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M29.5174 16.0919C29.5638 17.1995 29.1689 18.2803 28.4194 19.0971C27.67 19.9139 26.6271 20.4001 25.5196 20.4489C25.4548 20.452 25.3902 20.4535 25.3256 20.4535C25.0314 20.4533 24.738 20.4214 24.4505 20.3585C23.5976 21.6754 22.4793 22.7997 21.167 23.6596C19.8546 24.5196 18.3773 25.0961 16.8294 25.3524C16.6463 25.8903 16.2811 26.3473 15.7968 26.6444C15.3125 26.9415 14.7397 27.0601 14.1772 26.9796C13.6148 26.8992 13.0982 26.6248 12.7166 26.2038C12.335 25.7828 12.1125 25.2417 12.0876 24.6741C12.0626 24.1065 12.2368 23.548 12.5799 23.0952C12.9231 22.6424 13.4137 22.3237 13.9669 22.1942C14.5201 22.0647 15.1011 22.1325 15.6096 22.386C16.1181 22.6395 16.522 23.0626 16.7516 23.5824C18.9308 23.1793 20.8995 22.0244 22.3145 20.3188C23.7296 18.6132 24.5013 16.4652 24.4951 14.249C24.4951 9.01338 20.2356 4.75391 15 4.75391C9.76431 4.75391 5.50484 9.01338 5.50484 14.249C5.50455 15.868 5.91831 17.4601 6.70677 18.8741C6.73349 18.9207 6.75355 18.9709 6.76636 19.0231C6.84252 19.2348 6.83438 19.4677 6.74362 19.6735C6.65287 19.8793 6.48645 20.0424 6.2788 20.129C5.77036 20.3429 5.22427 20.4531 4.67263 20.453C4.60771 20.453 4.54265 20.4515 4.47745 20.4485C3.37043 20.399 2.32821 19.9126 1.57932 19.0958C0.830423 18.2791 0.435979 17.1987 0.482475 16.0915C0.501166 15.65 0.490736 15.2561 0.480541 14.8752C0.471049 14.5165 0.461146 14.1456 0.477435 13.7586C0.526049 12.6776 0.991064 11.6573 1.77508 10.9114C2.5591 10.1656 3.60131 9.75204 4.68341 9.7574C6.42107 5.7817 10.391 2.99609 15 2.99609C19.6089 2.99609 23.5789 5.7817 25.3166 9.75746C26.3988 9.75129 27.4413 10.1645 28.2255 10.9103C29.0096 11.6562 29.4744 12.6768 29.5224 13.7579C29.5388 14.1455 29.5289 14.5164 29.5193 14.875C29.5092 15.256 29.4987 15.6501 29.5174 16.0919ZM22.3713 14.249C22.3709 15.3783 22.1111 16.4924 21.612 17.5055C21.1129 18.5185 20.3877 19.4033 19.4926 20.0918C18.5974 20.7802 17.556 21.2539 16.4488 21.4762C15.3416 21.6985 14.1981 21.6635 13.1066 21.374L10.1229 23.0971C9.97236 23.184 9.79941 23.2244 9.62594 23.213C9.45247 23.2017 9.28626 23.1391 9.14833 23.0333C9.01041 22.9274 8.90697 22.7831 8.8511 22.6185C8.79522 22.4538 8.78942 22.2764 8.83443 22.1084L9.59697 19.2638C8.33416 17.8989 7.63152 16.1085 7.62886 14.249C7.62886 10.1833 10.9354 6.87594 15 6.87594C19.0645 6.87594 22.3713 10.1833 22.3713 14.249ZM12.9506 14.249C12.9506 14.0159 12.858 13.7924 12.6932 13.6275C12.5284 13.4627 12.3048 13.3701 12.0717 13.3701H12.0703C11.8965 13.3704 11.7267 13.4223 11.5824 13.519C11.4381 13.6158 11.3257 13.7532 11.2594 13.9138C11.1932 14.0744 11.176 14.2511 11.2101 14.4215C11.2442 14.5919 11.328 14.7483 11.451 14.8711C11.574 14.9938 11.7306 15.0774 11.901 15.1112C12.0715 15.1449 12.2481 15.1274 12.4086 15.0609C12.5691 14.9943 12.7063 14.8816 12.8028 14.7371C12.8993 14.5926 12.9508 14.4228 12.9508 14.249H12.9506ZM15.879 14.249C15.879 14.2203 15.8774 14.1915 15.8743 14.1629C15.8716 14.1342 15.8673 14.1056 15.8615 14.0773C15.8563 14.0492 15.8492 14.0214 15.8404 13.9941C15.8322 13.9666 15.8223 13.9396 15.8117 13.9127C15.8012 13.8857 15.7883 13.8605 15.7748 13.8354C15.7614 13.81 15.7467 13.7854 15.7309 13.7615C15.7148 13.7374 15.6976 13.7142 15.6792 13.6918C15.6612 13.6694 15.6418 13.6481 15.6213 13.6279C15.6014 13.6074 15.5797 13.5881 15.5574 13.5693C15.5351 13.5518 15.5117 13.5342 15.4876 13.5184C15.4638 13.5025 15.4392 13.4878 15.4139 13.4744C15.3886 13.4609 15.3623 13.4486 15.3359 13.4375C15.3095 13.4265 15.2825 13.4169 15.2551 13.4088C15.2003 13.3912 15.1437 13.3798 15.0863 13.3748C15.0002 13.3665 14.9134 13.3707 14.8285 13.3871C14.8002 13.3929 14.7723 13.4001 14.7448 13.4088C14.7173 13.4168 14.6903 13.4264 14.6639 13.4375C14.6376 13.4486 14.6112 13.4609 14.586 13.4744C14.5608 13.4879 14.5362 13.5025 14.5121 13.5184C14.488 13.5342 14.4646 13.5518 14.443 13.5693C14.4202 13.5881 14.3991 13.6074 14.3786 13.6279C14.358 13.6481 14.3386 13.6694 14.3205 13.6918C14.3024 13.7142 14.2854 13.7374 14.2696 13.7615C14.2535 13.7854 14.2386 13.81 14.2251 13.8354C14.2115 13.8605 14.1994 13.8863 14.1887 13.9127C14.1775 13.9393 14.1678 13.9665 14.1594 13.9941C14.1512 14.0211 14.1442 14.0492 14.1383 14.0773C14.1325 14.1056 14.1282 14.1342 14.1254 14.1629C14.1225 14.1916 14.1213 14.2203 14.1213 14.249C14.1213 14.2777 14.1225 14.307 14.1254 14.3357C14.1283 14.3643 14.1326 14.3926 14.1383 14.4207C14.1442 14.4488 14.1512 14.477 14.1594 14.5045C14.1678 14.5319 14.1775 14.5589 14.1887 14.5854C14.1994 14.612 14.2115 14.638 14.2251 14.6633C14.2385 14.6885 14.2538 14.7131 14.2696 14.7371C14.2854 14.761 14.3024 14.7841 14.3205 14.8062C14.3388 14.8287 14.3581 14.8502 14.3786 14.8707C14.3991 14.8906 14.4202 14.9105 14.443 14.9287C14.4651 14.947 14.4881 14.964 14.5121 14.9797C14.5362 14.9955 14.5607 15.0107 14.586 15.0242C14.6369 15.0507 14.69 15.0727 14.7448 15.0898C14.7723 15.098 14.8004 15.1051 14.8285 15.1109C14.885 15.1225 14.9425 15.1282 15.0002 15.1279C15.233 15.1273 15.4562 15.0349 15.6213 14.8707C15.6618 14.8296 15.6985 14.7849 15.7309 14.7371C15.7467 14.7131 15.7613 14.6885 15.7748 14.6633C15.7883 14.6381 15.8006 14.6117 15.8117 14.5854C15.8228 14.559 15.8322 14.5314 15.8404 14.5045C15.8491 14.477 15.8562 14.449 15.8615 14.4207C15.8673 14.3926 15.8715 14.3643 15.8743 14.3357C15.8773 14.3069 15.8789 14.2779 15.8789 14.2489L15.879 14.249ZM18.8087 14.249C18.8087 14.0159 18.7161 13.7924 18.5513 13.6275C18.3865 13.4627 18.1629 13.3701 17.9298 13.3701H17.9281C17.7544 13.3705 17.5846 13.4223 17.4403 13.5191C17.296 13.6158 17.1836 13.7532 17.1173 13.9139C17.0511 14.0745 17.0339 14.2512 17.068 14.4215C17.1021 14.5919 17.186 14.7484 17.3089 14.8711C17.4319 14.9938 17.5885 15.0774 17.759 15.1112C17.9294 15.1449 18.1061 15.1274 18.2666 15.0609C18.4271 14.9943 18.5642 14.8816 18.6607 14.7371C18.7572 14.5926 18.8087 14.4228 18.8087 14.249Z"
                                    fill="#18355D"
                                  />
                                </svg>
                              </div>
                              <div className="ms-3 text-[11px] text-bw-1">
                                <span className="font-bold">
                                  Liên hệ Hotline: 19002225 (nhấn phím 2)
                                </span>{' '}
                                <span>
                                  Tvới tình huống cần hỗ trợ khẩn cấp.
                                </span>
                              </div>
                            </div>
                          </Link>

                          <Link href={'#'} className="mt-3">
                            <div className="flex border-[1px] border-solid border-gray-3 py-2.5 px-3.5 mt-3 hover:bg-primary cursor-pointer">
                              <div className="flex items-center">
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M19.0007 15.9424L17.358 17.5857C16.7327 18.2104 15.8847 18.5617 15.0007 18.5617C14.1167 18.5617 13.2687 18.2104 12.6433 17.5857L11.0007 15.9424L2.13867 24.8044C2.40533 24.9317 2.69934 24.9997 3.00067 24.9997H27.0007C27.302 24.9997 27.596 24.9317 27.8627 24.8044L19.0007 15.9424Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M28.8054 6.1377C28.9327 6.40436 29.0007 6.69836 29.0007 6.9997V22.9997C29.0007 23.301 28.9327 23.595 28.8054 23.8617L19.9434 14.9997L28.8054 6.1377Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.19533 6.1377L10.0573 14.9997L1.19533 23.8617C1.068 23.595 1 23.301 1 22.9997C1 18.901 1 11.0984 1 6.9997C1 6.69836 1.068 6.40436 1.19533 6.1377Z"
                                    fill="#18355D"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M27.8627 5.19533C27.596 5.068 27.302 5 27.0007 5C21.4227 5 8.57868 5 3.00067 5C2.69934 5 2.40533 5.068 2.13867 5.19533L13.5867 16.6427C13.9613 17.018 14.47 17.2287 15.0007 17.2287C15.5313 17.2287 16.04 17.018 16.4147 16.6427L27.8627 5.19533Z"
                                    fill="#18355D"
                                  />
                                </svg>
                              </div>
                              <div className="ms-3 text-[11px] text-bw-1">
                                <span className="">
                                  Liên hệ trao đổi qua email hỗ trợ chính thức:
                                </span>{' '}
                                <span className="font-bold">
                                  support@sapp.edu.vn
                                </span>
                              </div>
                            </div>
                          </Link>
                          <div className="text-xs text-center text-bw-1 mt-4">
                            Chúng tôi cam kết phản hồi trong 4 giờ làm việc (trừ
                            Thứ 7, Chủ nhật và các ngày lễ)
                          </div>
                        </div>
                      }
                      title={undefined}
                      trigger="click"
                      visible={visible}
                      onVisibleChange={handleVisibleChange}
                      placement="topLeft"
                      arrow={false}
                    >
                      {visible ? (
                        <div
                          id="floating-button"
                          onClick={handleButtonClick}
                          className={`${
                            visible ? 'bottom-5 clicked' : 'bottom-[90px]'
                          } right-[20px]`}
                        >
                          <div className="plus flex justify-center items-center bg-primary hover:opacity-75 rounded-full">
                            <svg
                              width="34"
                              height="34"
                              viewBox="0 0 34 34"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M22.3033 11.6969C22.5962 11.9897 22.5962 12.4646 22.3033 12.7575L18.0607 17.0002L22.3033 21.2428C22.5962 21.5357 22.5962 22.0106 22.3033 22.3035C22.0104 22.5964 21.5355 22.5963 21.2426 22.3035L17 18.0608L12.7574 22.3035C12.4645 22.5963 11.9896 22.5964 11.6967 22.3035C11.4038 22.0106 11.4038 21.5357 11.6967 21.2428L15.9393 17.0002L11.6967 12.7575C11.4038 12.4646 11.4038 11.9897 11.6967 11.6969C11.9896 11.404 12.4645 11.404 12.7574 11.6969L17 15.9395L21.2426 11.6969C21.5355 11.404 22.0104 11.404 22.3033 11.6969Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <Tooltip
                          arrow
                          title={
                            <div className="text-white">Support Center</div>
                          }
                          color="#FFB800"
                          placement="left"
                        >
                          <div
                            id="floating-button"
                            onClick={handleButtonClick}
                            className={`${
                              visible ? 'bottom-5 clicked' : 'bottom-[90px]'
                            } right-[20px]`}
                          >
                            <div className="plus flex justify-center items-center hover:bg-primary hover:rounded-full">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_12924_7136)">
                                  <path
                                    d="M11.9923 23.7656C11.3459 23.7656 10.7472 23.4739 10.3487 22.9645L7.95152 19.9244L3.74944 19.9218C1.68219 19.9218 0 18.2396 0 16.1718V3.93749C0 1.86969 1.68219 0.1875 3.74999 0.1875H20.25C22.3178 0.1875 24 1.86969 24 3.93749V11.4844C24 12.0022 23.5803 12.4219 23.0625 12.4219C22.5446 12.4219 22.125 12.0022 22.125 11.4844V3.93749C22.125 2.90368 21.2838 2.0625 20.25 2.0625H3.74999C2.71618 2.0625 1.875 2.90368 1.875 3.93749V16.1718C1.875 17.2057 2.71618 18.0468 3.74999 18.0468L8.40709 18.0496C8.69401 18.0498 8.96501 18.1814 9.14262 18.4066L11.8235 21.8064C11.8782 21.8765 11.945 21.8906 11.9925 21.8906H11.9934C12.0406 21.8904 12.108 21.8759 12.1604 21.808C12.162 21.8058 12.1637 21.8036 12.1653 21.8016L14.8244 18.4063C15.0022 18.1794 15.2743 18.0468 15.5625 18.0468H20.25C21.284 18.0468 22.125 17.2057 22.125 16.1718C22.125 15.654 22.5446 15.2343 23.0625 15.2343C23.5803 15.2343 24 15.654 24 16.1718C24 18.2396 22.3178 19.9218 20.25 19.9218H16.0191L13.6435 22.955C13.2473 23.4677 12.6489 23.763 12.0007 23.7656C11.998 23.7656 11.995 23.7656 11.9923 23.7656ZM12.9375 14.4843V9.42186C12.9375 8.90404 12.5178 8.48436 12 8.48436C11.4822 8.48436 11.0625 8.90404 11.0625 9.42186V14.4843C11.0625 15.0022 11.4822 15.4218 12 15.4218C12.5178 15.4218 12.9375 15.0022 12.9375 14.4843ZM12 5.24999C11.4822 5.24999 11.0625 5.66967 11.0625 6.18749C11.0625 6.70531 11.4822 7.12499 12 7.12499C12.5178 7.12499 12.9375 6.70531 12.9375 6.18749C12.9375 5.66967 12.5178 5.24999 12 5.24999Z"
                                    fill="#FFB800"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_12924_7136">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        </Tooltip>
                      )}
                    </Popover>
                  </div>
                </div>

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
