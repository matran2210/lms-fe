"use client";

import DeferredLottie from "../../components/common/DeferredLottie";
import clsx from "clsx";

export type MenuHoverAnimationProps = {
  badgeClass: string;
  className: string;
  icon?: string;
  notificationUnread: number;
  active?: boolean;
};

const loadMyCourseAnimation = () =>
  fetch("/api/lottie/MyCourse").then((response) => response.json());

const loadAnimation = (name: string) => () =>
  fetch(`/api/lottie/${name}`).then((response) => response.json());

const animationsByIcon: Record<string, () => Promise<object>> = {
  activity: loadMyCourseAnimation,
  attendance: loadAnimation("Attendance"),
  bookmark: loadAnimation("CourseContent"),
  calculator: loadAnimation("Calculator"),
  calendar: loadAnimation("Calendar"),
  "class-resource": loadAnimation("OpenBook"),
  course: loadMyCourseAnimation,
  "course-activation": loadAnimation("CourseActivation"),
  "course-content": loadMyCourseAnimation,
  "create-note": loadAnimation("AddNote"),
  "entrance-test": loadAnimation("EntranceTest"),
  "event-test": loadAnimation("EventTest"),
  "exam-information": loadAnimation("ExamInfo"),
  exam_list: loadAnimation("ExamList"),
  grid: loadAnimation("Dashboard"),
  "learning-resource": loadAnimation("Resource"),
  "notes-list": loadAnimation("NoteList"),
  notification: loadAnimation("Notification"),
  result: loadAnimation("TestQuizList"),
};

export default function MenuHoverAnimation({
  badgeClass,
  className,
  icon,
  notificationUnread,
  active = true,
}: MenuHoverAnimationProps) {
  const loadAnimationData = animationsByIcon[icon || ""] || loadMyCourseAnimation;

  if (icon === "notification") {
    return (
      <div className="relative hidden group-hover/menuItem:block">
        <DeferredLottie
          active={active}
          loadAnimationData={loadAnimationData}
          loop
          autoplay
          className={className}
        />
        {notificationUnread > 0 ? (
          <span
            className={clsx(
              "absolute aspect-1 items-center justify-center rounded-full bg-[#D35563] text-xs text-white",
              "hidden group-hover/menuItem:flex",
              badgeClass,
            )}
          >
            {notificationUnread > 99 ? "99+" : notificationUnread}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <DeferredLottie
      active={active}
      loadAnimationData={loadAnimationData}
      loop
      autoplay
      className={className}
    />
  );
}
