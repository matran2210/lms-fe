import CalendarPage from "./src/pages";
import { SCHEDULE_ROUTES } from "./src/constants/routes";
import MyClassPage from "./src/pages/teachers/my-class/page";
import MyRequestPage from "./src/pages/teachers/my-request/page";
import MyCalendarPage from "./src/pages/teachers/my-calendar/page";
import ClassDetailPage from "./src/pages/teachers/my-class/[id]/page";
import ChapterTestPage from "./src/pages/teachers/my-class/chapter-test/page";

export const scheduleRoutes = [
  {
    path: SCHEDULE_ROUTES.CALENDAR,
    element: <CalendarPage />
  },
  {
    path: SCHEDULE_ROUTES.TEACHER_MY_CLASS,
    element: <MyClassPage />
  },
  {
    path: SCHEDULE_ROUTES.TEACHER_MY_CLASS_DETAIL,
    element: <ClassDetailPage />
  },
  {
    path: SCHEDULE_ROUTES.TEACHER_MY_CLASS_CHAPTER_TEST,
    element: <ChapterTestPage />
  },
  {
    path: SCHEDULE_ROUTES.TEACHER_MY_REQUEST,
    element: <MyRequestPage />
  },
  {
    path: SCHEDULE_ROUTES.TEACHER_MY_CALENDAR,
    element: <MyCalendarPage />
  },
]