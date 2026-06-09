"use client";

import {
  AddNoteAnimation,
  AttendanceAnimation,
  CalculatorAnimation,
  CalendarAnimation,
  CourseActivationAnimation,
  CourseContentAnimation,
  DashboardAnimation,
  EntranceTestAnimation,
  EventTestAnimation,
  ExamInfoAnimation,
  ExamListAnimation,
  MyCourseAnimation,
  NoteListAnimation,
  NotificationAnimation,
  OpenBookAnimation,
  ResourceAnimation,
  TestQuizListAnimation,
} from "@lms/assets/animations";
import clsx from "clsx";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
type MenuHoverAnimationProps = {
  badgeClass: string;
  className: string;
  icon?: string;
  notificationUnread: number;
};

const animationsByIcon: Record<string, object> = {
  activity: MyCourseAnimation,
  attendance: AttendanceAnimation,
  bookmark: CourseContentAnimation,
  calculator: CalculatorAnimation,
  calendar: CalendarAnimation,
  "class-resource": OpenBookAnimation,
  course: MyCourseAnimation,
  "course-activation": CourseActivationAnimation,
  "course-content": MyCourseAnimation,
  "create-note": AddNoteAnimation,
  "entrance-test": EntranceTestAnimation,
  "event-test": EventTestAnimation,
  "exam-information": ExamInfoAnimation,
  exam_list: ExamListAnimation,
  grid: DashboardAnimation,
  "learning-resource": ResourceAnimation,
  "notes-list": NoteListAnimation,
  notification: NotificationAnimation,
  result: TestQuizListAnimation,
};

export default function MenuHoverAnimation({
  badgeClass,
  className,
  icon,
  notificationUnread,
}: MenuHoverAnimationProps) {
  const animationData = animationsByIcon[icon || ""] || MyCourseAnimation;

  if (icon === "notification") {
    return (
      <div className="relative hidden group-hover/menuItem:block">
        <Lottie animationData={animationData} loop autoplay className={className} />
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

  return <Lottie animationData={animationData} loop autoplay className={className} />;
}
