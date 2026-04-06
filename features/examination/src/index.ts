import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import { ExaminationInfo } from "./components";
import { examinationRoutes } from "./routes";
import ExamList from "./pages/exam_list";

ExtensionRegistry.register("EXAM_INFORMATION_MODAL", ExaminationInfo);
ExtensionRegistry.register("EXAM_LIST_PAGE", ExamList);

export const examinationModule: AppModule = {
  name: "examination",
  routes: examinationRoutes,
};
