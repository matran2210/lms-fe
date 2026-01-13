"use client";
import {
  useAppSelector,
  useCourseContext,
  useFeature,
  usePinnedNotifyContext,
} from "@lms/contexts";
import { useTailwindBreakpoint } from "@lms/hooks";
import clsx from "clsx";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { PopupStep } from "../components";
import { GuidePlacement, UserGuide } from "@lms/core";
import {
  TourGuideCoursesAnimation,
  TourGuideFilterAnimation,
  TourGuideNotiAnimation,
  TourGuideSidebarAnimation,
  TourGuideStartAnimation,
} from "@lms/assets";
interface LayoutProps {
  children: ReactNode;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showSidebar?: boolean;
  fullWidth?: boolean;
  handleToggleSidebar?: () => void;
  className?: string;
  childClassName?: string;
  isEndGuide?: boolean;
  closeUserGuide?: () => void;
}

export default function Layout(props: LayoutProps): ReactElement {
  const {
    children,
    title,
    size = "lg",
    showSidebar = true,
    fullWidth = false,
    handleToggleSidebar,
    className,
    childClassName,
    isEndGuide = false,
    closeUserGuide,
  } = props;
  const { pageLink, router } = useFeature();
  const { isShowMenuContent, isMobileView, isTabletView } =
    useTailwindBreakpoint();

  const { isOpenSidebar, setOpenSidebar } = useCourseContext();
  const toggleDrawer = () => {
    handleToggleSidebar?.();
    setOpenSidebar(!isOpenSidebar);
  };

  const { openPinned, pinnedNotifications } = usePinnedNotifyContext();
  const { showPinnedTrial } = useCourseContext();

  const guideStatus = useAppSelector(
    (state: { userGuideReducer: { status: any } }) =>
      state.userGuideReducer?.status,
  );

  const [openResource, setOpenResource] = useState(false);
  const [openExaminationInfo, setOpenExaminationInfo] = useState(false);

  const isEnablePinnedPages = [
    pageLink.COURSES,
    pageLink.USERPAGE,
    pageLink.COURSE_DETAIL,
    pageLink.COURSE_PART_DETAIL,
    pageLink.COURSE_ACTIVITY,
  ].includes(router.pathname);

  let paddingTop = "";

  if (isEnablePinnedPages && openPinned && pinnedNotifications?.data?.content) {
    paddingTop = showPinnedTrial ? "pt-[102px]" : "pt-12";
  }

  const guideStep = useAppSelector((state) => state.userGuideReducer?.step);
  const getGuideStepConfig = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Search box",
          content: UserGuide.CONTENT_STEP_1,
          imgSrc: TourGuideStartAnimation,
          targetId: "search-box",
          placement: "bottom-left",
        };

      case 2:
        return {
          title: "Sidebar",
          content: UserGuide.CONTENT_STEP_2,
          imgSrc: TourGuideSidebarAnimation,
          targetId: "sidebar",
          placement: "right-top",
        };
      case 3:
        return {
          title: "Notification & Profile",
          content: UserGuide.CONTENT_STEP_3,
          imgSrc: TourGuideNotiAnimation,
          targetId: "notification-profile",
          placement: "right-top",
        };
      case 4:
        return {
          title: "Welcome",
          content: UserGuide.CONTENT_STEP_4,
          isEnd: isEndGuide,
          handleCancel: closeUserGuide,
          targetId: "welcome-to",
          placement: "bottom-left",
        };
      case 5:
        return {
          title: "Courses",
          content: UserGuide.CONTENT_STEP_5,
          imgSrc: TourGuideCoursesAnimation,
          targetId: "courses-card",
          placement: "right-top",
        };

      case 6:
        return {
          title: "Filter",
          content: UserGuide.CONTENT_STEP_6,
          handleCancel: closeUserGuide,
          imgSrc: TourGuideFilterAnimation,
          titleButtonNext: "Finish",
          targetId: "filter-courses",
          placement: "bottom-left",
        };
      default:
        return null;
    }
  };
  const stepConfig = getGuideStepConfig(guideStep);
  const customOffset =
    isTabletView &&
      (stepConfig?.targetId === "sidebar" ||
        stepConfig?.targetId === "notification-profile")
      ? { x: 115, y: 0 }
      : undefined;
  useEffect(() => {
    document.title = title
  }, [title])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={clsx("flex flex-nowrap rounded-xl", {
          "lg:ml-[calc(5rem+32px)]": showSidebar,
        })}
      >
        <Sidebar
          isOpened={isOpenSidebar}
          toggleDrawer={toggleDrawer}
          className={clsx(
            "menu-sidebar-left transition-all duration-300 ease-out",
            "hover:menu-sidebar-left--hover", // This still won't work as explained earlier
            `fixed left-0 h-[calc(100vh-32px)] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] lg:block lg:w-20`,
            {
              // 'overflow-hidden': !guideStatus,
              "menu-sidebar-left--hover !w-[220px]":
                (guideStatus && (guideStep === 2 || guideStep === 3)) ||
                isShowMenuContent,
              "h-[calc(100vh-32px-60px)]": !openPinned,
              // 'hidden': !showSidebar,
              // 'w-[220px]': isOpenSidebar,
              "w-[220px] translate-x-0": showSidebar,
              "w-[220px] -translate-x-60": !showSidebar,
            },
            paddingTop,
          )}
          setOpenResource={setOpenResource}
          openResource={openResource}
          openExaminationInfo={openExaminationInfo}
          setOpenExaminationInfo={setOpenExaminationInfo}
        />

        <div
          className={clsx("container min-h-screen", {
            "max-w-[calc(1179px+4rem)]": size === "sm",
            "max-w-[calc(1230px+4rem)]": size === "md",
            "max-w-[calc(1318px+4rem)]": size === "lg",
            "max-w-[calc(1524px+4rem)]": size === "xl",
            "max-w-[calc(1644px+4rem)]": size === "2xl",
            "!max-w-full p-0": fullWidth,
          })}
        >
          <div className={clsx(`${paddingTop} bg-[#F9F9F9]`, className)}>
            <div className={clsx("ml-0", childClassName)}>{children}</div>
          </div>
        </div>
      </div>
      {guideStatus && stepConfig && (
        <PopupStep
          index={guideStep}
          total={6}
          title={stepConfig.title}
          content={stepConfig.content}
          targetId={stepConfig.targetId as string}
          placement={
            isMobileView ? "center" : (stepConfig.placement as GuidePlacement)
          }
          imgSrc={stepConfig.imgSrc}
          isEnd={stepConfig.isEnd}
          handleCancel={stepConfig.handleCancel}
          titleButtonNext={stepConfig.titleButtonNext}
          customOffset={customOffset}
        />
      )}
    </>
  );
}
