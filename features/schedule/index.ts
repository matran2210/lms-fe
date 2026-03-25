import { AppModule } from "@lms/core";
import { scheduleRoutes } from "./routes";
import { ExtensionRegistry } from "@lms/ui";
import CalendarPage from "./src/pages";
import MyClassPage from "./src/pages/teachers/my-class/page";
import MyRequestPage from "./src/pages/teachers/my-request/page";
import MyCalendarPage from "./src/pages/teachers/my-calendar/page";
import ClassDetailPage from "./src/pages/teachers/my-class/[id]/page";
import ChapterTestPage from "./src/pages/teachers/my-class/chapter-test/page";

ExtensionRegistry.register("CALENDAR_PAGE", CalendarPage);
ExtensionRegistry.register("TEACHER_MY_CLASS_PAGE", MyClassPage);
ExtensionRegistry.register("TEACHER_MY_REQUEST_PAGE", MyRequestPage);
ExtensionRegistry.register("TEACHER_MY_CALENDAR_PAGE", MyCalendarPage);
ExtensionRegistry.register("TEACHER_CLASS_DETAIL_PAGE", ClassDetailPage);
ExtensionRegistry.register("TEACHER_CHAPTER_TEST_PAGE", ChapterTestPage);

export const scheduleModule: AppModule = {
  name: "schedule",
  routes: scheduleRoutes,
};
