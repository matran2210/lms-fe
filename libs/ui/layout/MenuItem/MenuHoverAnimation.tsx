"use client";

import DeferredLottie from "../../components/common/DeferredLottie";
import clsx from "clsx";

export type MenuHoverAnimationProps = {
  badgeClass: string;
  className: string;
  icon?: string;
  notificationUnread: number;
};

// Cache animation data in memory so subsequent hovers are instant
const animationCache = new Map<string, Promise<object>>();

const fetchAnimation = (name: string): Promise<object> => {
  if (!animationCache.has(name)) {
    animationCache.set(name, fetch(`/api/lottie/${name}`).then((r) => r.json()));
  }
  return animationCache.get(name)!;
};

const loadMyCourseAnimation = () => fetchAnimation("MyCourse");

const loadAnimation = (name: string) => () => fetchAnimation(name);

export const animationsByIcon: Record<string, () => Promise<object>> = {
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

/**
 * Preload animation JSON vào cache trước khi hover.
 * Gọi lúc mount sidebar để khi hover hiện ngay lập tức.
 */
export function preloadAnimation(icon: string): void {
  const loader = animationsByIcon[icon] ?? loadMyCourseAnimation;
  loader(); // kick off fetch + cache, không cần await
}

export default function MenuHoverAnimation({
  badgeClass,
  className,
  icon,
  notificationUnread,
}: MenuHoverAnimationProps) {
  const loadAnimationData = animationsByIcon[icon || ""] || loadMyCourseAnimation;

  if (icon === "notification") {
    return (
      <div className="relative hidden group-hover/menuItem:block">
        <DeferredLottie
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
      loadAnimationData={loadAnimationData}
      loop
      autoplay
      className={className}
    />
  );
}
