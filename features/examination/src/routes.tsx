import { EXAMINATION_ROUTES } from "./constants/routes";
import ExamList from "./pages/exam_list";

export const examinationRoutes = [
  {
    path: EXAMINATION_ROUTES.EXAM_LIST,
    element: <ExamList />
  }
]
