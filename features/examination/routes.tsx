import { EXAMINATION_ROUTES } from "./src/constants/routes";
import ExamList from "./src/pages/exam_list";

export const examinationRoutes = [
  {
    path: EXAMINATION_ROUTES.EXAM_LIST,
    element: <ExamList />
  }
]
