// app/providers.tsx
"use client";

import {
  CourseNoteProvider,
  FeatureProvider,
  PreviousSectionRouteProvider,
  SocketContext,
} from "@lms/contexts";
import {
  ANIMATION,
  AppType,
  LOCAL_STORAGE_KEYS,
  SOCKET_EVENTS,
} from "@lms/core";
import { RouteGuard } from "@lms/feature-auth";
import { LearningNotesList, PopupCompletedCourse } from "@lms/feature-courses";
import { useTailwindBreakpoint } from "@lms/hooks";
import {
  AntConfigProvider,
  BackToTop,
  PinnedNotifications,
  SappConfirmDialogContainer,
  SappLoadingGlobal,
} from "@lms/ui";
import { pageview } from "@lms/utils";
import { fetcher } from "@services/requestV2";
import { App as AntdApp, ConfigProvider } from "antd";
import Aos from "aos";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import TagManager, { TagManagerArgs } from "react-gtm-module";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { io } from "socket.io-client";
import { ActivityAPI } from "src/api/activity";
import { uploadImageToLinkedIn } from "src/api/certificate";
import { ClassAPI } from "src/api/class";
import { CoursesAPI } from "src/api/courses";
import { NotificationAPI } from "src/api/notification";
import MyProfileAPI, { AuthAPI } from "src/api/profile";
import { QuestionAPI } from "src/api/question";
import { TestServiceAPI } from "src/api/test-api";
import { UploadAPI } from "src/api/upload";
import { UserApi } from "src/api/user";
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from "src/constants/menu-items";
import { PageLink } from "src/constants/routers";
import CourseActivityApi from "src/redux/services/Course/MyCourse/Activity";
import UserContextApi from "src/redux/services/User/user";
import { store } from "src/redux/store";
import { AuthenticationManager } from "src/utils/helpers/keycloak";
import DeferredThirdPartyScripts from "./deferred-third-party-scripts";

dayjs.extend(utc);
dayjs.extend(weekday);

const activityPath = ["/courses/[id]/activity/[activityId]"];
// Stable QueryClient — khởi tạo 1 lần duy nhất, không re-create mỗi render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000000,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthBootstrapFallback = () => (
  <SappLoadingGlobal loading>
    <></>
  </SappLoadingGlobal>
);

function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const query = useSearchParams();
  const [socket, setSocket] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const authManagerRef = useRef<AuthenticationManager | null>(null);
  if (!authManagerRef.current) {
    authManagerRef.current = new AuthenticationManager();
  }
  const authenticationManager = authManagerRef.current;

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";
  const tagManagerArgs: TagManagerArgs = { gtmId };

  const { isMobileView } = useTailwindBreakpoint();

  // Check if URL contains '/teachers'
  const prevPathRef = useRef<string | null>(null);
  // Stable query object — tránh tạo object mới mỗi render
  const queryObj = useMemo(() => Object.fromEntries(query.entries()), [query]);
  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true });
  }, []);

  useEffect(() => {
    let mounted = true;

    authenticationManager.waitUntilReady().then(() => {
      if (mounted) {
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [authenticationManager]);

  useEffect(() => {
    if (!authReady) return;

    const token = authenticationManager.getToken();
    if (token !== "") {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
        extraHeaders: {
          authorization: token,
        },
      });
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [authReady, authenticationManager]); // reconnect khi authToken thay đổi

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {});
      socket.on("disconnect", () => {});
      socket?.on(SOCKET_EVENTS.NOTIFICATION_UNREAD, (data: any) => {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
          data.payload.data.unread,
        );
        window.dispatchEvent(new Event("storage"));
      });
      return () => {
        socket?.off(SOCKET_EVENTS.NOTIFICATION_UNREAD);
      };
    }
  }, [socket]);

  const isActivityPage = !activityPath.some((path) => pathname?.includes(path));
  const showBackToTop = isMobileView ? isActivityPage : true;

  useEffect(() => {
    if (prevPathRef.current) {
      localStorage.setItem("previousUrl", prevPathRef.current);

      if (
        prevPathRef.current.includes("courses") &&
        !prevPathRef.current.includes("your-answers-detail")
      ) {
        localStorage.setItem("previousCourseUrl", prevPathRef.current);
      }
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <AntConfigProvider>
      {/* <Provider store={store}> */}
      <FeatureProvider
        value={{
          userApi: UserApi,
          courseApi: CoursesAPI,
          questionApi: QuestionAPI,
          uploadApi: UploadAPI,
          userContextApi: UserContextApi,
          notificationApi: NotificationAPI,
          authApi: AuthAPI,
          classApi: ClassAPI,
          activityApi: ActivityAPI,
          courseActivityApi: CourseActivityApi,
          myProfileApi: MyProfileAPI,
          submitQuizTest: TestServiceAPI.submitQuizTest,
          authManager: authManagerRef.current!,
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
          pathname: pathname,
          params,
          query: queryObj,
          uploadImageToLinkedIn: uploadImageToLinkedIn,
          domainTest: process.env.NEXT_PUBLIC_SUB_DOMAIN_TEST as string,
        }}
      >
        <CourseNoteProvider router={router} api={CoursesAPI}>
          <QueryClientProvider client={queryClient}>
            <SocketContext.Provider value={socket}>
              {!authReady ? (
                <AuthBootstrapFallback />
              ) : (
                <RouteGuard>
                  <PreviousSectionRouteProvider pathname={pathname}>
                    <Toaster
                      toastOptions={{
                        style: {
                          maxWidth: "400px", // Tăng chiều rộng của toast
                        },
                      }}
                    />
                    <SappConfirmDialogContainer />
                    <PinnedNotifications />
                    <AntdApp>{children}</AntdApp>
                    <>
                      {showBackToTop && <BackToTop />}
                      <LearningNotesList appType={AppType.LMS_PRO} />
                      <PopupCompletedCourse />
                      <DeferredThirdPartyScripts gaId={gaId} gtmId={gtmId} />
                    </>
                  </PreviousSectionRouteProvider>
                </RouteGuard>
              )}
            </SocketContext.Provider>
          </QueryClientProvider>
        </CourseNoteProvider>
      </FeatureProvider>
      {/* </Provider> */}
    </AntConfigProvider>
  );
}

export function ProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Providers>{children}</Providers>
    </Provider>
  );
}
