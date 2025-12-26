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
import { ANIMATION, AppType, LOCAL_STORAGE_KEYS, SOCKET_EVENTS } from '@lms/core'
import { RouteGuard } from '@lms/feature-auth'
import { LearningNotesList, PopupCompletedCourse } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import '@lms/styles'
import { BackToTop, Help, PinnedNotifications, SappConfirmDialogContainer } from '@lms/ui'
import { initializeGA, pageview } from '@lms/utils'
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
import Aos from 'aos'
import 'aos/dist/aos.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
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
import 'src/utils/helpers/keycloak'
import { AuthenticationManager } from 'src/utils/helpers/keycloak'
import { ActivityAPI } from './api/activity/route'
import CalendarApi from './api/calendar/route'
import { uploadImageToLinkedIn } from './api/certificate/route'
import { ClassAPI } from './api/class/route'
import { CoursesAPI } from './api/courses/route'
import { EntranceTestAPI } from './api/entrance-test/route'
import { EventTestAPI } from './api/event-test/route'
import { NotificationAPI } from './api/notification/route'
import MyProfileAPI, { AuthAPI } from './api/profile/route'
import { QuestionAPI } from './api/question/route'
import { TestServiceAPI } from './api/test-api/route'
import { UploadAPI } from './api/upload/route'

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
    useEffect(() => {
        TagManager.initialize(tagManagerArgs)
    }, [])

    useEffect(() => {
        if (!window.GA_INITIALIZED) {
            initializeGA()
            window.GA_INITIALIZED = true
        }
    }, [])

    /**
     * @description Sử dụng useEffect để thực hiện các tác vụ liên quan đến việc theo dõi thay đổi trong route của ứng dụng để check GA
     */
    // TODO: Next14
    // useEffect(() => {
    //     const handleRouteChange = (url: URL) => {
    //         pageview(url as any)
    //     }

    //     router.events.on('routeChangeComplete', handleRouteChange)

    //     return () => {
    //         router.events.off('routeChangeComplete', handleRouteChange)
    //     }
    // }, [router.events])
    useEffect(() => {
        if (!pathname) return
        pageview(pathname as any)
    }, [pathname])



    const isActivityPage = !activityPath.some((path) =>
        pathname?.includes(path),
    )
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

        // TODO: Next14
        // router.events.on('routeChangeComplete', handleRouteChange)

        // return () => {
        //     observer.disconnect()
        //     router.events.off('routeChangeComplete', handleRouteChange)
        // }
        return () => observer.disconnect()
    }, [router, showHelp, hiddenChatbot])


    // TODO: Next14
    // useEffect(() => {
    //     const handleRouteChange = () => {
    //         // Lưu URL hiện tại vào localStorage trước khi đổi sang URL mới
    //         localStorage.setItem('previousUrl', router.asPath)
    //         if (
    //             router.asPath.includes('courses') &&
    //             !router.asPath.includes('your-answers-detail')
    //         ) {
    //             localStorage.setItem('previousCourseUrl', router.asPath)
    //         }
    //     }

    //     // Lắng nghe sự kiện chuyển route
    //     router.events.on('routeChangeStart', handleRouteChange)

    //     // Cleanup listener
    //     return () => {
    //         router.events.off('routeChangeStart', handleRouteChange)
    //     }
    // }, [router])

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
        // <ErrorBoundary fallback={<ErrorRedirectPage />}>
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
                        query,
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
                                        <SappConfirmDialogContainer />
                                        <RouteGuard>
                                            <ConfigProvider>
                                                <AntdApp>{children}</AntdApp>
                                                <>
                                                    <div className="relative">
                                                        <PinnedNotifications />
                                                        {/* <Component {...pageProps} /> */}
                                                    </div>
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
        // </ErrorBoundary>
    )
}
