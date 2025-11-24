import blankAvatar from "@assets/images/blank_avatar.webp";
import { useCourseContext, useFeature } from "@lms/contexts";
import { IAuthManager, ICoursesAPI, TitleSidebar, TitleTeacherSidebar } from "@lms/core";
import { LearningResource } from "@lms/feature-courses";
import { Layout, Menu, Tooltip } from "antd";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  BellIcon,
  BookMenuIcon,
  FileMenuIcon,
  HelpMenuIcon,
  HomeMenuIcon,
  LogOutMenuIcon,
  MyCalendarMenuIcon,
  MyCourseTeacherIcon,
} from "src/assets/icons";
import { IUser, userReducer, activeNotesList, pushNotes, openCalculator, useAppDispatch, useAppSelector } from "@lms/contexts";
import { v4 as uuidv4 } from "uuid";
import { ExpandIcon } from "node_modules/@lms/assets";
const { Sider } = Layout;

export default function TeacherMenu({
  isCourseDetail,
  isActivity,
 
}: {
  isCourseDetail: boolean;
  isActivity: boolean;
}) {
  const { authManager, pageLink, router } = useFeature();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(userReducer);

  const [selectedKey, setSelectedKey] = useState("Home");
  const [openResource, setOpenResource] = useState(false);
  const { showPinnedTrial } = useCourseContext();
  const isCurrent = useCallback(
    (path: string | string[]) =>
      Array.isArray(path)
        ? path.includes(router.pathname)
        : router.pathname === path,
    [router.pathname],
  );

  const handleLogout = useCallback(async () => {
    try {
      await authManager.logout();
    } catch {}
  }, []);

  const actionHandlers: Record<string, () => void> = {
    [TitleSidebar.NOTES_LIST]: () => {
      dispatch(activeNotesList());
      document.body.style.overflow = "hidden";
    },
    [TitleSidebar.RESOURCES]: () => {
      setOpenResource(true);
      document.body.style.overflow = "hidden";
    },
    [TitleSidebar.NEW_NOTE]: () => {
      dispatch(
        pushNotes({ uuid: uuidv4(), id: "", name: "Note", description: "" }),
      );
    },
    [TitleSidebar.CALCULATOR]: () => dispatch(openCalculator()),
  };

  const getMenuItems = useCallback(() => {
    if (isCourseDetail || isActivity) {
      const baseItems = [
        {
          key: TitleSidebar.COURSE_CONTENT,
          title: TitleSidebar.COURSE_CONTENT,
          icon: (
            <HomeMenuIcon
              selected={selectedKey === TitleSidebar.COURSE_CONTENT}
            />
          ),
          link: `${pageLink.TEACHER_MY_COURSE}/my-course/${router.query.id || router.query.courseId}`,
          active:
            isCurrent(`${pageLink.TEACHERS}${pageLink.COURSE_DETAIL}`) &&
            selectedKey !== TitleSidebar.NOTES_LIST,
        },
        {
          key: TitleSidebar.NOTES_LIST,
          title: TitleSidebar.NOTES_LIST,
          icon: (
            <BookMenuIcon selected={selectedKey === TitleSidebar.NOTES_LIST} />
          ),
          link: "#",
          active: selectedKey === TitleSidebar.NOTES_LIST,
        },
        {
          key: TitleSidebar.RESOURCES,
          title: TitleSidebar.RESOURCES,
          icon: (
            <FileMenuIcon selected={selectedKey === TitleSidebar.RESOURCES} />
          ),
          link: "#",
          active: selectedKey === TitleSidebar.RESOURCES,
        },
        {
          key: TitleSidebar.RESULTS,
          title: TitleSidebar.RESULTS,
          icon: (
            <MyCourseTeacherIcon
              selected={selectedKey === TitleSidebar.RESULTS}
            />
          ),
          link: `${pageLink.TEACHER_MY_COURSE}/my-course/${router.query.id || router.query.courseId}/results`,
          active: isCurrent(
            `${pageLink.TEACHER_MY_COURSE}/my-course/${router.query?.id ? "[id]" : "[courseId]"}/results`,
          ),
        },
      ];

      if (isActivity) {
        baseItems.push(
          {
            key: TitleSidebar.NEW_NOTE,
            title: TitleSidebar.NEW_NOTE,
            icon: (
              <MyCalendarMenuIcon
                selected={selectedKey === TitleSidebar.NEW_NOTE}
              />
            ),
            link: "#",
            active: selectedKey === TitleSidebar.NEW_NOTE,
          },
          {
            key: TitleSidebar.CALCULATOR,
            title: TitleSidebar.CALCULATOR,
            icon: (
              <BellIcon selected={selectedKey === TitleSidebar.CALCULATOR} />
            ),
            link: "#",
            active: selectedKey === TitleSidebar.CALCULATOR,
          },
        );
      }
      return baseItems;
    }

    return [
      {
        key: "Home",
        title: TitleTeacherSidebar.DASHBOARD,
        icon: <HomeMenuIcon selected={selectedKey === "Home"} />,
        link: pageLink.TEACHERS,
        active: isCurrent(pageLink.TEACHERS),
      },
      {
        key: "MyCourse",
        title: TitleSidebar.COURSES,
        icon: <MyCourseTeacherIcon selected={selectedKey === "MyCourse"} />,
        link: pageLink.TEACHER_MY_COURSE,
        active: isCurrent(pageLink.TEACHER_MY_COURSE),
      },
      {
        key: "Book",
        title: TitleTeacherSidebar.MYCLASS,
        icon: <BookMenuIcon selected={selectedKey === "Book"} />,
        link: pageLink.TEACHER_MY_CLASS,
        active: isCurrent([
          pageLink.TEACHER_MY_CLASS,
          `${pageLink.TEACHER_MY_CLASS}/[id]`,
          pageLink.TEACHER_CHAPTER_TEST,
        ]),
      },
      {
        key: "MyCalendar",
        title: TitleTeacherSidebar.MYCALENDAR,
        icon: <MyCalendarMenuIcon selected={selectedKey === "MyCalendar"} />,
        link: pageLink.MY_CALENDAR,
        active: isCurrent(pageLink.MY_CALENDAR),
      },
      {
        key: "File",
        title: TitleTeacherSidebar.MYREQUEST,
        icon: <FileMenuIcon selected={selectedKey === "File"} />,
        link: pageLink.TEACHER_MY_REQUEST,
        active: isCurrent(pageLink.TEACHER_MY_REQUEST),
      },
      {
        key: "Bell",
        title: TitleTeacherSidebar.NOTIFICATIONS,
        icon: <BellIcon selected={selectedKey === "Bell"} />,
        link: pageLink.TEACHERS,
        active: isCurrent(pageLink.TEACHERS),
      },
    ];
  }, [isCourseDetail, isActivity, selectedKey, router.query, isCurrent]);

  const menuItems = useMemo(() => getMenuItems(), [getMenuItems]);

  useEffect(() => {
    setSelectedKey((prevKey) => {
      if (prevKey === "Home" || prevKey === "") {
        return menuItems.find((item) => item.active)?.key ?? "Home";
      }
      return prevKey;
    });
  }, [menuItems]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (actionHandlers[key]) {
      actionHandlers[key]();
    } else {
      const target = menuItems.find((item) => item.key === key);
      if (target?.link) router.push(target.link);
    }
    if (key !== selectedKey) setSelectedKey(key);
  };

  return (
    <Fragment>
      <Sider
        width={80}
        collapsed
        className={clsx(
          "bg-blue-2 fixed bottom-0 left-0 top-0 flex h-screen flex-col items-center",
          showPinnedTrial && "pt-[54px]",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <SidebarMenu
            items={menuItems}
            selectedKey={selectedKey}
            onClick={handleMenuClick}
          />
          <BottomActionMenu user={user} onLogout={handleLogout} pageLink={pageLink} />
        </div>
      </Sider>
      <LearningResource
        open={openResource}
        setOpenResource={setOpenResource}
      />
    </Fragment>
  );
}

const SidebarMenu = ({
  items,
  selectedKey,
  onClick,
}: {
  items: {
    key: string;
    title: string;
    icon: React.ReactNode;
    link: string;
    active: boolean;
  }[];
  selectedKey: string;
  onClick: (key: { key: string }) => void;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-8 mt-6 h-10 w-10 cursor-pointer">
      <ExpandIcon type="teacher-logo-full" />
    </div>
    <div className="mb-7 h-[1.2px] w-8 bg-white" />
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      className="flex w-12 flex-col items-center gap-6 [&_.ant-menu-item]:p-3"
    >
      {items.map((item) => (
        <Tooltip
          key={item.key}
          title={item.title}
          placement="right"
          overlayClassName="teacher-sidebar-tooltip"
        >
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => onClick({ key: item.key })}
          />
        </Tooltip>
      ))}
    </Menu>
  </div>
);

const BottomActionMenu = ({
  user,
  onLogout,
  pageLink
}: {
  user: IUser;
  onLogout: () => void;
  pageLink: { [key: string]: string;
  };
}) => (
  <div className="mb-6 flex flex-col items-center gap-6">
    <Link href={pageLink.TEACHER_MY_PROFILE}>
      <Image
        alt="avatar"
        src={
          user?.detail?.avatar["32x32"] ||
          user?.detail?.avatar["ORIGIN"] ||
          blankAvatar
        }
        width={32}
        height={32}
        className="cursor-pointer rounded-full object-cover"
      />
    </Link>
    <div className="cursor-pointer p-2">
      <HelpMenuIcon />
    </div>
    <div className="cursor-pointer p-2" onClick={onLogout}>
      <LogOutMenuIcon />
    </div>
  </div>
);
