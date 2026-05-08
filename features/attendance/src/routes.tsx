import AttendancePage from "./pages/teachers/attendance";
import { ATTENDANCE_ROUTES } from "./constants/routes";

export const attendanceRoutes = [
  {
    path: ATTENDANCE_ROUTES.TEACHER_ATTENDANCE,
    element: <AttendancePage />
  },
]
