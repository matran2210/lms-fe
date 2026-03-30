import CalendarPage from "./pages";
import { SCHEDULE_ROUTES } from "./constants/routes";
import MyClassPage from "./pages/teachers/my-class";
import MyRequestPage from "./pages/teachers/my-request";
import MyCalendarPage from "./pages/teachers/my-calendar";
import ClassDetailPage from "./pages/teachers/my-class/[id]";
import ChapterTestPage from "./pages/teachers/my-class/chapter-test";

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