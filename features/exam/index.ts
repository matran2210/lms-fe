import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import { ExaminationInfo } from "./src/components";
import { examRoutes } from "./routes";
import ExamList from "./src/pages/exam_list";

ExtensionRegistry.register("EXAM_INFORMATION_MODAL", ExaminationInfo);
ExtensionRegistry.register("EXAM_LIST_PAGE", ExamList);

export const examModule: AppModule = {
  name: "exam",
  routes: examRoutes,
};
