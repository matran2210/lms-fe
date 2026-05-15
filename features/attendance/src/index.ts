import { AppModule } from "@lms/core";
import { attendanceRoutes } from "./routes";
import { ExtensionRegistry } from "@lms/ui";
import TeacherAttendancePage from "./pages/teachers/attendance";
import StudentAttendancePage from "./pages/students/attendance";
import LearningAttendancePage from "./pages/teachers/attendance/learning";

ExtensionRegistry.register("TEACHER_ATTENDANCE_PAGE", TeacherAttendancePage);
ExtensionRegistry.register("TEACHER_LEARNING_ATTENDANCE_PAGE", LearningAttendancePage);
ExtensionRegistry.register("STUDENT_ATTENDANCE_PAGE", StudentAttendancePage);

export const attendanceModule: AppModule = {
  name: "attendance",
  routes: attendanceRoutes,
};
