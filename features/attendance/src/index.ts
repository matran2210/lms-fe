import { AppModule } from "@lms/core";
import { attendanceRoutes } from "./routes";
import { ExtensionRegistry } from "@lms/ui";
import AttendancePage from "./pages/teachers/attendance";

ExtensionRegistry.register("TEACHER_ATTENDANCE_PAGE", AttendancePage);

export const attendanceModule: AppModule = {
  name: "attendance",
  routes: attendanceRoutes,
};
