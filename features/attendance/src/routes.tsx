import TeacherAttendancePage from "./pages/teachers/attendance";
import StudentAttendancePage from "./pages/students/attendance";
import { ATTENDANCE_ROUTES } from "./constants/routes";

export const attendanceRoutes = [
  {
    path: ATTENDANCE_ROUTES.TEACHER_ATTENDANCE,
    element: <TeacherAttendancePage />
  },
  {
    path: ATTENDANCE_ROUTES.STUDENT_ATTENDANCE,
    element: <StudentAttendancePage />
  },
]
