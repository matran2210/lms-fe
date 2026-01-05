"use client";
import {
  AddNoteAnimation,
  BlankAvatarImage,
  CalculatorAnimation,
  CalendarAnimation,
  CourseContentAnimation,
  DashboardAnimation,
  EntranceTestAnimation,
  EventTestAnimation,
  ExamInfoAnimation,
  ExamListAnimation,
  ExpandIcon,
  MyCourseAnimation,
  NoteListAnimation,
  NotificationAnimation,
  OpenBookAnimation,
  ResourceAnimation,
  TestQuizListAnimation,
} from "@lms/assets";
import {
  activeNotesList,
  clearNotifications,
  openCalculator,
  pushNotes,
  useAppDispatch,
  useAppSelector,
  useFeature,
  userReducer,
} from "@lms/contexts";
import { LANG_SIGNIN, MenuItem as MenuItemType, RouteContext, TitleSidebar } from "@lms/core";
import { useNotification } from "@lms/hooks";
import { getCourseContentSubContext, getLearningSubContext, getRouteContext, trackGAEvent } from "@lms/utils";
import SappNotificationComponent from "@sapp-fe/sapp-notification";
import { Divider } from "antd";
import clsx from "clsx";
import { isEmpty } from "lodash";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MenuItemsList from "../MenuItemsList";

type MenuItemProps = {
  menuItem: MenuItemType;
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  closeSideBar: () => void;
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>;
};

export default function MenuItem({
  menuItem: { name, icon: Icon, url, type, subItems },
  setOpenResource,
  closeSideBar,
  setOpenExaminationInfo,
}: MenuItemProps) {
  const { notificationApi, pageLink, router, pathname, query, params } = useFeature();
  const id = params?.id || query.id
  const courseId = params?.courseId || query.courseId
  const activityId = params?.activityId || query.activityId
  const course_section_id = params?.course_section_id || query.course_section_id
  const {
    isViewDetail,
    openNotification,
    setOpenNotification,
    selectedTab,
    setSelectedTab,
    notifyDetail,
    notifyLists,
    scrollRef,
    handleMarkAll,
    handleMarkById,
    handleUnMarkById,
    handleViewDetail,
    handleBack,
    refreshNotification,
    isDesktopView,
    notificationUnread,
  } = useNotification(notificationApi);

  const isLoading = useAppSelector(
    (state) => state.notificationReducer.loading,
  );
  const tabs = [
    {
      id: 1,
      title: "All Notifications",
    },
    {
      id: 2,
      title: `Unread ${notificationUnread ? `(${notificationUnread})` : ""}`,
    },
  ];

  useEffect(() => {
    if (selectedTab) {
      dispatch(clearNotifications());
    }
  }, [selectedTab]);

  const [isExpanded, toggleExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(userReducer);
  const isNested = subItems && subItems?.length > 0;
  const courseContext = getCourseContentSubContext(pathname as string);
  const learningContext = getLearningSubContext(pathname as string);
  const selected = (() => {
    const context: RouteContext = getRouteContext(pathname as string);
    if (context === "GLOBAL") return pathname === url;

    else if (context === "COURSE_MANAGEMENT") {
      switch (name) {
        case TitleSidebar.COURSE_CONTENT:
          return courseContext === "CONTENT";

        case TitleSidebar.DASHBOARD:
          return courseContext === "DASHBOARD";

        case TitleSidebar.RESULTS:
          return courseContext === "RESULTS";

        case TitleSidebar.CLASS_RESOURCE:
          return courseContext === "CLASS_RESOURCE";

        default:
          return false;
      }
    } else if (context === "COURSE_LEARNING") {
      switch (name) {
        case TitleSidebar.COURSE_CONTENT:
          return learningContext === "CONTENT";

        default:
          return false;
      }
    }

  })();
  const [badgeClass, setBadgeClass] = useState("w-4 h-4 -top-[5px] -right-1.5"); // Default width

  useEffect(() => {
    if (notificationUnread > 9) {
      setBadgeClass("w-6 h-6 -top-3.5 -right-3.5");
    } else {
      setBadgeClass("w-4 h-4 -top-[5px] -right-1.5"); // Default width for single digits
    }
  }, [notificationUnread]);
  const onClick = () => {
    toggleExpanded((prev) => !prev);
  };

  const handleOpenResource = () => {
    setOpenResource && setOpenResource(true);
    document.body.style.overflow = "hidden";
  };

  const handleOpenNotesList = () => {
    dispatch(activeNotesList());
    document.body.style.overflow = "hidden";
  };

  const handleAddNote = () => {
    const note = {
      uuid: uuidv4(),
      id: "",
      name: "Note",
      description: "",
    };
    dispatch(pushNotes(note));
  };

  const handleOpenCalculator = () => {
    dispatch(openCalculator());
  };

  const handleOpenCourseContentPage = () => {
    router.push(`/courses/my-course/${courseId || id}`);
  };
  const handleOpenResultsPage = () => {
    router.push(`/courses/my-course/${courseId || id}/results`);
  };

  const handleViewNotification = (link: string) => {
    router.push(link);
  };

  const handleOpenExaminationInfoPage = () => {
    setOpenExaminationInfo && setOpenExaminationInfo(true);
  };

  const onClickMenuItem = () => {
    const hasCourseContext = courseId || id;

    // Nếu url trống => là menu Notification
    if (isEmpty(url)) {
      setOpenNotification(true);
      if (isEmpty(notifyLists)) {
        refreshNotification(false);
      }
      closeSideBar();
      return;
    }

    // Nếu đang ở trong course
    if (hasCourseContext) {
      switch (name) {
        case TitleSidebar.COURSE_CONTENT:
          handleOpenCourseContentPage();
          break;
        case TitleSidebar.RESOURCES:
          handleOpenResource();
          break;
        case TitleSidebar.NOTES_LIST:
          handleOpenNotesList();
          break;
        case TitleSidebar.NEW_NOTE:
          handleAddNote();
          break;
        case TitleSidebar.CALCULATOR:
          handleOpenCalculator();
          break;
        case TitleSidebar.RESULTS:
          handleOpenResultsPage();
          break;
        case TitleSidebar.EXAM:
          handleOpenExaminationInfoPage();
          break;
        default:
          // Nếu có url cụ thể
          if (url && url !== "#") {
            const targetUrl =
              url === pageLink.RESULTS
                ? `/courses/my-course/${courseId || id}/results`
                : url === pageLink.DASHBOARD
                  ? `/courses/my-course/${courseId || id}/dashboard`
                  : name === TitleSidebar.COURSE_CONTENT
                    ? `/courses/my-course/${courseId || id}`
                    : name === TitleSidebar.CLASS_RESOURCE
                      ? `/courses/my-course/${courseId || id}/class-resource`
                      : url;

            router.push(targetUrl);
          }
          break;
      }
    } else {
      // Nếu không ở trong course thì chỉ điều hướng URL bình thường
      if (url && url !== "#") router.push(url);
    }
    closeSideBar();
  };

  function formatName(fullName?: string): string {
    if (!fullName) return "";

    const words = fullName.trim().split(/\s+/);
    const lastTwo = words.slice(-2);
    return lastTwo.join(" ");
  }

  const isActivity = activityId;
  const isInCourse =
    courseId ||
    (activityId && name !== TitleSidebar.EXAM) ||
    (course_section_id && name !== TitleSidebar.EXAM);
  const isInMyProfile = pathname === pageLink.MYPROFILE;

  const checkIsHiddenDashboard = (info: any) => {
    return name == TitleSidebar.DASHBOARD && !info;
  };

  const animationClass = clsx(
    `before-icon w-6 h-6 hidden group-hover/menuItem:block`,
  );
  const renderIcon = () => {
    switch (Icon) {
      case "course":
      case "course-content":
      case "activity":
        return (
          <Lottie
            animationData={MyCourseAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "notes-list":
        return (
          <Lottie
            animationData={NoteListAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "create-note":
        return (
          <Lottie
            animationData={AddNoteAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "learning-resource":
        return (
          <Lottie
            animationData={ResourceAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "caculator":
        return (
          <Lottie
            animationData={CalculatorAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "calendar":
        return (
          <Lottie
            animationData={CalendarAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "grid":
        return (
          <Lottie
            animationData={DashboardAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "entrance-test":
        return (
          <Lottie
            animationData={EntranceTestAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "exam_list":
        return (
          <Lottie
            animationData={ExamListAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "result":
        return (
          <Lottie
            animationData={TestQuizListAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "bookmark":
        return (
          <Lottie
            animationData={CourseContentAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "event-test":
        return (
          <Lottie
            animationData={EventTestAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "exam-information":
        return (
          <Lottie
            animationData={ExamInfoAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
      case "notification":
        return (
          <div className="relative">
            <Lottie
              animationData={NotificationAnimation}
              loop
              autoplay
              className={animationClass}
            />
            {notificationUnread > 0 && (
              <span
                className={clsx(
                  "absolute aspect-1 items-center justify-center rounded-full bg-[#D35563] text-xs text-white",
                  "hidden group-hover/menuItem:flex",
                  badgeClass,
                )}
              >
                {notificationUnread > 99 ? "99+" : notificationUnread}
              </span>
            )}
          </div>
        );
      case "class-resource":
        return (
          <Lottie
            animationData={OpenBookAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );

      default:
        return (
          <Lottie
            animationData={MyCourseAnimation}
            loop
            autoplay
            className={animationClass}
          />
        );
        break;
    }
  };

  const isShowHoverIcon = () => {
    return true;
    // return !['notification'].includes(Icon)
  };

  const renderMenuContent = () => {
    return (
      <div className="flex items-center">
        {Icon === "avatar" ? (
          <div
            className={clsx("h-10 w-10 shrink-0", {
              "rounded-full !border-2 border-primary": isInMyProfile,
            })}
          >
            {user?.detail?.avatar?.["40x40"] ||
              user.detail.avatar?.["ORIGIN"] ? (
              <Image
                src={
                  user.detail.avatar?.["40x40"] ||
                  user.detail.avatar?.["ORIGIN"]
                }
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src={BlankAvatarImage}
                alt="avatar"
                className="rounded-full"
                width={40}
                height={40}
                priority={true}
              />
            )}
          </div>
        ) : (
          <>
            {Icon === "profile-detail" ? (
              <div className="h-10 w-10 shrink-0">
                <Image
                  src={
                    user.detail.avatar?.["40x40"] ||
                    user.detail.avatar?.["ORIGIN"] ||
                    BlankAvatarImage
                  }
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                  width={40}
                  height={40}
                  priority={true}
                />
              </div>
            ) : (
              <>
                {!selected && isShowHoverIcon() && renderIcon()}
                <ExpandIcon
                  type={Icon}
                  className={clsx(
                    `before-icon min-h-6 min-w-6 shrink-0 ${selected ? "bg-primary text-white" : "text-gray-800"
                    }`,
                    {
                      "group-hover:text-gray-800": !selected,
                      "group-hover/menuItem:hidden":
                        !selected && isShowHoverIcon(),
                    },
                  )}
                  extraClassName={clsx({
                    "group-hover/menuItem:hidden":
                      !selected && isShowHoverIcon(),
                  })}
                />
              </>
              // <ExpandIcon
              //   type={Icon}
              //   className={clsx(
              //     `before-icon min-h-6 min-w-6 shrink-0 ${
              //       selected ? 'bg-primary text-white' : 'text-gray-800'
              //     }`,
              //     {
              //       'group-hover:text-gray-800': !selected,
              //     },
              //   )}
              // />
            )}
          </>
        )}
        {Icon === "avatar" ? (
          <div
            className={clsx(
              `label avatar invisible pl-4 text-base font-normal opacity-0 transition-all duration-150 ${selected ? "text-white" : "text-gray-800"
              }`,
              {
                "group-hover:text-gray-800": !selected,
              },
            )}
          >
            <div
              className={clsx(
                "line-clamp-1 text-base font-semibold text-[#050505]",
                {
                  "group-hover:text-gray-800": !selected,
                  "!text-primary": isInMyProfile,
                },
              )}
            >
              {formatName(user?.detail?.full_name)}
            </div>
            <div
              className={clsx(
                "line-clamp-1 text-sm font-normal capitalize text-[#A1A1A1]",
                {
                  "group-hover:text-gray-800": !selected,
                  "!text-primary": isInMyProfile,
                },
              )}
            ></div>
          </div>
        ) : (
          <>
            {Icon === "profile-detail" ? (
              <span
                className={clsx(
                  `label invisible line-clamp-1 pl-3 text-base font-normal opacity-0 transition-all duration-200 ease-in-out md:pl-4 ${selected ? "bg-primary text-white" : "text-gray-800"
                  }`,
                  {
                    "group-hover:text-gray-800": !selected,
                  },
                )}
              >
                {formatName(user?.detail?.full_name)}
              </span>
            ) : (
              <span
                className={clsx(
                  `label invisible line-clamp-1 pl-3 text-base font-normal opacity-0 transition-all duration-200 ease-in-out md:pl-4 ${selected ? "bg-primary text-white" : "text-gray-800"
                  }`,
                  {
                    "group-hover:text-gray-800": !selected,
                  },
                )}
                onClick={() => trackGAEvent(`Click Button ${name} Menu `)}
              >
                {name}
              </span>
            )}
          </>
        )}
      </div>
    );
  };


  return (
    <>
      {isActivity && name === TitleSidebar.NEW_NOTE && (
        <div className="mx-auto w-[calc(100%-48px)] min-w-[50px] text-center">
          <Divider className="my-2 bg-[#DCDDDD]" />
        </div>
      )}
      <div
        className={clsx(
          `group/menuItem transform cursor-pointer rounded transition-all duration-200 ease-in-out ${selected &&
            ((type === "level-1" &&
              Icon !== "avatar" &&
              Icon !== "profile-detail") ||
              (type === "level-2" &&
                (Icon === "result" || Icon === "bookmark")))
            ? "bg-primary text-white"
            : ""
          } sidebar-list-items relative px-4 py-2 last:mb-0 ${!isActivity &&
            (name === TitleSidebar.NEW_NOTE || name === TitleSidebar.CALCULATOR)
            ? "hidden"
            : ""
          }
        ${!isInCourse &&
            (name === TitleSidebar.COURSE_CONTENT ||
              name === TitleSidebar.NOTES_LIST ||
              name === TitleSidebar.RESOURCES ||
              name === TitleSidebar.RESULTS ||
              name === TitleSidebar.EXAM ||
              name === TitleSidebar.DASHBOARD ||
              name === TitleSidebar.CLASS_RESOURCE ||
              Icon === "stats-chart-sharp" ||
              Icon === "profile-detail")
            ? "hidden"
            : ""
          }
        ${isInCourse &&
            (name === TitleSidebar.COURSES ||
              name === TitleSidebar.EXAM_LIST ||
              name === TitleSidebar.ENTRANCE_TEST ||
              // hidden when in course
              name === TitleSidebar.CALENDAR ||
              // hidden when in course
              name === LANG_SIGNIN.eventTest ||
              name === TitleSidebar.NOTIFICATION ||
              Icon === "avatar" ||
              Icon === "profile-detail" ||
              checkIsHiddenDashboard(
                JSON.parse(localStorage.getItem("courseInfo") as any),
              ) ||
              Icon === "avatar")
            ? "hidden"
            : ""
          }
        `,
          {
            "hover:bg-gray-100": !selected,
          },
        )}
        onClick={() => onClickMenuItem()}
      >
        <div
          className={`sidebar-item flex items-center ${Icon === "avatar" || Icon === "profile-detail" ? "-ml-2" : ""
            }`}
        >
          {url !== "#" && !isEmpty(url) ? (
            <Link
              href={
                url === pageLink.RESULTS
                  ? `/courses/my-course/${query?.courseId || query?.id}/results`
                  : url === pageLink.DASHBOARD
                    ? `/courses/my-course/${query?.courseId || query?.id}/dashboard`
                    : name === TitleSidebar.CLASS_RESOURCE
                      ? `/courses/my-course/${query?.courseId || query?.id}/class-resource`
                      : name === TitleSidebar.COURSE_CONTENT
                        ? `/courses/my-course/${query?.courseId || query?.id}`
                        : url
              }
            // passHref
            >
              {renderMenuContent()}
            </Link>
          ) : (
            <>{renderMenuContent()}</>
          )}
          {isNested && type === "level-2" ? (
            <ExpandIcon
              isExpanded={isExpanded}
              handleClick={onClick}
              type={"ontoggle"}
              className={clsx(
                `transition-all duration-200 ease-in-out ${selected ? "bg-primary text-white" : ""}`,
                {
                  "group-hover:text-gray-800": !selected,
                },
              )}
            />
          ) : null}
        </div>
        {isNested ? (
          <div
            className={`sidebar-child ${type} ${isExpanded && type === "level-2" ? "active" : ""
              }`}
          >
            <MenuItemsList
              options={subItems || []}
              setOpenResource={setOpenResource}
              closeSideBar={closeSideBar}
              setOpenExaminationInfo={setOpenExaminationInfo}
            />
          </div>
        ) : null}
      </div>
      <SappNotificationComponent
        notifyDetail={{
          ...notifyDetail,
          send_time: notifyDetail?.send_time || "", // Ensure send_time is always a string
        }}
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleMarkAll={() => handleMarkAll(selectedTab)}
        handleMarkById={(ids: string[]) => handleMarkById(ids, selectedTab)}
        handleUnMarkById={(ids: string[]) => handleUnMarkById(ids, selectedTab)}
        handleBack={handleBack}
        isViewDetail={isViewDetail}
        setOpenNotification={setOpenNotification}
        openNotification={openNotification}
        handleViewDetail={handleViewDetail}
        notifyLists={notifyLists}
        notificationUnread={notificationUnread}
        scrollRef={scrollRef}
        handleViewNotification={(link) => handleViewNotification(link)}
        isDesktopView={isDesktopView}
      />
    </>
  );
}
