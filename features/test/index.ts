import { AppModule } from "@lms/core";
import { ExtensionRegistry } from "@lms/ui";
import { testRoutes } from "./routes";
import EntranceTestPage from "./src/pages/entrance-test/page";
import EntranceTestResultPage from "./src/pages/entrance-test/page";
import TableEntranceResult from "./src/pages/entrance-test/table-result/[id]/page";
import EventTestPage from "./src/pages/event-test/page";

ExtensionRegistry.register("ENTRANCE_TEST_PAGE", EntranceTestPage);
ExtensionRegistry.register("ENTRANCE_TEST_RESULT_PAGE", EntranceTestResultPage);
ExtensionRegistry.register("ENTRANCE_TABLE_RESULT_PAGE", TableEntranceResult);
ExtensionRegistry.register("EVENT_TEST_PAGE", EventTestPage);

export const testModule: AppModule = {
  name: "test",
  routes: testRoutes,
};
