"use client";

import { ExpandIcon } from "@lms/assets/icons";
import { clearNotifications, useFeature } from "@lms/contexts";
import { MenuItem as MenuItemType, TitleSidebar } from "@lms/core";
import { useNotification } from "@lms/hooks";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import {
  ComponentType,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import type { MenuHoverAnimationProps } from "./MenuHoverAnimation";

type MenuHoverAnimationComponent = ComponentType<MenuHoverAnimationProps>;

function LazyMenuHoverAnimation(props: MenuHoverAnimationProps) {
  const [Component, setComponent] =
    useState<MenuHoverAnimationComponent | null>(null);

  useEffect(() => {
    let mounted = true;

    import("./MenuHoverAnimation").then((mod) => {
      if (mounted) setComponent(() => mod.default);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Component) return null;

  return <Component {...props} />;
}

const SappNotificationComponent = dynamic(
  () => import("@sonhero/sapp-notification"),
  { ssr: false },
);

const NOTIFICATION_STYLE_ID = "sapp-notification-package-styles";

function sanitizeNotificationPackageStyle(style: HTMLStyleElement) {
  if (style.dataset.sappFontPatched === "true") return;

  const css = (style.textContent || "")
    .replace(
      /@import\s+url\(['"]https:\/\/fonts\.googleapis\.com\/css2\?family=Roboto[^'"]*['"]\);\s*/g,
      "",
    )
    .replace(/'Roboto'(?=\s*,)/g, 'var(--font-roboto, "Roboto")')
    .replace(/\bRoboto\b(?=\s*,)/g, 'var(--font-roboto, "Roboto")');

  style.textContent = `${css}

html,
body {
  font-family: var(--font-roboto, "Roboto"), sans-serif !important;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit !important;
}
`;
  style.dataset.sappFontPatched = "true";
}

function installNotificationStyleGuard() {
  if (typeof document === "undefined") return;

  const win = window as typeof window & {
    __sappNotificationStyleGuardInstalled?: boolean;
  };

  if (win.__sappNotificationStyleGuardInstalled) return;
  win.__sappNotificationStyleGuardInstalled = true;

  const currentStyle = document.getElementById(NOTIFICATION_STYLE_ID);
  if (currentStyle instanceof HTMLStyleElement) {
    sanitizeNotificationPackageStyle(currentStyle);
  }

  const appendChild = document.head.appendChild.bind(document.head);
  document.head.appendChild = ((node: Node) => {
    if (
      node instanceof HTMLStyleElement &&
      node.id === NOTIFICATION_STYLE_ID
    ) {
      sanitizeNotificationPackageStyle(node);
    }

    return appendChild(node);
  }) as typeof document.head.appendChild;
}

type NotificationMenuItemProps = {
  menuItem: MenuItemType;
  closeSideBar: () => void;
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>;
};

export default function NotificationMenuItem({
  menuItem: { name, icon: Icon, showMenu },
  closeSideBar,
}: NotificationMenuItemProps) {
  const { notificationApi, dispatch, router, params, query } = useFeature();
    const [hasActivatedAnimation, setHasActivatedAnimation] = useState(false);
  const activityId = params?.activityId || query.activityId;
  const courseId = params?.courseId || query.courseId;
  const courseSectionId = params?.course_section_id || query.course_section_id;
  const isInCourse =
    courseId ||
    (activityId && name !== TitleSidebar.EXAM) ||
    (courseSectionId && name !== TitleSidebar.EXAM);

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
      dispatch?.(clearNotifications());
    }
  }, [dispatch, selectedTab]);

  const badgeClass =
    notificationUnread > 9
      ? "w-6 h-6 -top-3.5 -right-3.5"
      : "w-4 h-4 -top-[5px] -right-1.5";

  const handleOpenNotification = () => {
    installNotificationStyleGuard();
    setOpenNotification(true);
    setHasActivatedAnimation(true)
    if (isEmpty(notifyLists)) {
      refreshNotification(false);
    }
    closeSideBar();
  };

  if (showMenu === false) return null;

  return (
    <>
      <div
        className={clsx(
          "group/menuItem sidebar-list-items relative transform cursor-pointer rounded px-4 py-2 transition-all duration-200 ease-in-out hover:bg-gray-100 last:mb-0",
          {
            hidden: isInCourse && name === TitleSidebar.NOTIFICATION,
          },
        )}
        onClick={handleOpenNotification}
      >
        <div className="sidebar-item flex items-center">
          <div className="flex items-center">
              <LazyMenuHoverAnimation
                badgeClass={badgeClass}
                className="before-icon hidden h-6 w-6 shrink-0 group-hover/menuItem:block"
                icon={Icon}
                notificationUnread={notificationUnread}
              />
            <ExpandIcon
              type={Icon}
              className="before-icon min-h-6 min-w-6 shrink-0 text-gray-800 group-hover/menuItem:hidden group-hover:text-gray-800"
              extraClassName="group-hover/menuItem:hidden"
            />
            
            <span className="label invisible line-clamp-1 whitespace-nowrap pl-3 text-base font-normal text-gray-800 opacity-0 transition-all duration-200 ease-in-out group-hover:text-gray-800 md:pl-4">
              {name}
            </span>
          </div>
        </div>
      </div>
      {(openNotification || hasActivatedAnimation) && (
        <SappNotificationComponent
          notifyDetail={{
            ...notifyDetail,
            send_time: notifyDetail?.send_time || "",
          }}
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          handleMarkAll={() => handleMarkAll(selectedTab)}
          handleMarkById={(ids: string[]) => handleMarkById(ids, selectedTab)}
          handleUnMarkById={(ids: string[]) =>
            handleUnMarkById(ids, selectedTab)
          }
          handleBack={handleBack}
          isViewDetail={isViewDetail}
          setOpenNotification={setOpenNotification}
          openNotification={openNotification}
          handleViewDetail={handleViewDetail}
          notifyLists={notifyLists}
          notificationUnread={notificationUnread}
          scrollRef={scrollRef}
          handleViewNotification={(link) => router.push(link)}
          isDesktopView={isDesktopView}
        />
      )}
    </>
  );
}
